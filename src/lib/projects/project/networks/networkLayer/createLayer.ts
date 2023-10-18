import { MAX_NETWORK_LAYERS } from "~/lib/constants";
import { genId } from "~/lib/crypto";
import { type ObjectState } from "~/lib/state";
import { type Network, type Project } from "~/lib/types";

/**
 * The parameters
 * @typedef {Object} Parameters
 * @property {Network} network The network
 * @property {Project} project The project
 */
interface Parameters {
  network: Network;
  project: ObjectState<Project>;
}

/**
 * Add a layer
 * @param {Parameters} params The parameters
 * @param {Network} params.network The network
 * @param {Project} params.project The project
 * @returns Promise<void>
 */
export async function createLayer(params: Parameters) {
  if (params.network.layers.length >= MAX_NETWORK_LAYERS) {
    return;
  }

  const NetLayerId: string = await genId();
  const newLayer = {
    id: NetLayerId,
    type: "dense",
    neurons: 1,
    shape: 1,
  };

  const newNetwork = {
    ...params.network,
    layers: [...params.network.layers, newLayer],
  };

  const networks = params.project.value.networks ?? [];
  const networkToAppendTo = networks.find(
    (network) => network.id === params.network.id,
  );
  if (!networkToAppendTo) return;

  const newNetworks = networks.map((network) =>
    network.id === params.network.id ? newNetwork : network,
  );

  params.project.set({
    ...params.project.value,
    networks: newNetworks,
  });
}
