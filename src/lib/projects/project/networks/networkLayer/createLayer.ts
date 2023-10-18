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
  const newNetwork = {
    ...params.network,
    layers: [
      ...params.network.layers,
      {
        id: NetLayerId,
        type: "dense",
        neurons: 1,
        shape: 1,
      },
    ],
  };

  params.project.set({
    ...params.project.value,
    networks: params.project.value.networks?.map((network: Network) =>
      network.id === newNetwork.id ? newNetwork : network,
    ),
  });
}
