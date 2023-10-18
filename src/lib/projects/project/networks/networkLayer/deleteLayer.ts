import { type ObjectState } from "~/lib/state";
import { type Network, type Project, type NetLayer } from "~/lib/types";

/**
 * The parameters
 * @typedef {Object} Parameters
 * @property {Project} project The project
 * @property {SetState<Project>} setProject The set project function
 * @property {Network} network The network
 * @property {number} index The index
 */
interface Parameters {
  project: ObjectState<Project>;
  network: Network;
  index: number;
}

/**
 * Delete a layer
 * @param {Parameters} params The parameters
 * @param {Project} params.project The project
 * @param {SetState<Project>} params.setProject The set project function
 * @param {Network} params.network The network
 * @param {number} params.index The index
 * @returns void
 */
export function deleteLayer(params: Parameters) {
  const networkLayers = params.network.layers ?? [];
  const networkLayer = networkLayers[params.index];
  if (!networkLayer) return;

  const newLayers = networkLayers.filter(
    (_: NetLayer, index: number) => index !== params.index,
  );

  const newNetwork: Network = {
    ...params.network,
    layers: newLayers,
  };

  const networks = params.project.value.networks ?? [];
  const networkToUpdate = networks.find(
    (network) => network.id === params.network.id,
  );
  if (!networkToUpdate) return;

  const newNetworks = networks.map((network) =>
    network.id === params.network.id ? newNetwork : network,
  );

  params.project.set({
    ...params.project.value,
    networks: newNetworks,
  });
}
