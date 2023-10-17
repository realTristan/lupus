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
  // Create a new network with the deleted layer
  const newNetwork = {
    ...params.network,
    layers: params.network.layers.filter(
      (_: NetLayer, i: number) => i !== params.index,
    ),
  };

  // Update the project with the new network and layers
  params.project.set({
    ...params.project.value,
    networks: params.project.value.networks?.map((network: Network) => {
      if (network.id === params.network.id) {
        return newNetwork;
      }

      return network;
    }),
  });
}
