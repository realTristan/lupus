import { type ChangeEvent } from "react";
import { type ObjectState } from "~/lib/state";
import { type NetLayer, type Network, type Project } from "~/lib/types";

/**
 * The parameters
 * @typedef {Object} Parameters
 * @property {ChangeEvent<HTMLInputElement>} event The change event
 * @property {Network} network The network
 * @property {number} index The index
 * @property {Project} project The project
 * @property {SetState<Project>} setProject The set project function
 * @property {string} key The key
 */
interface Parameters {
  event: ChangeEvent<HTMLInputElement>;
  network: Network;
  index: number;
  project: ObjectState<Project>;
  key: string;
}

/**
 * Update a layer row
 * @param {Parameters} params The parameters
 * @param {ChangeEvent<HTMLInputElement>} params.event The change event
 * @param {Network} params.network The network
 * @param {number} params.index The index
 * @param {Project} params.project The project
 * @param {SetState<Project>} params.setProject The set project function
 * @param {string} params.key The key
 * @returns void
 */
export function updateLayerRow(params: Parameters) {
  const value: string = params.event.target.value;

  // Create a new network with the updated layers
  const newNetwork: Network = {
    ...params.network,
    layers: params.network.layers?.map((layer: NetLayer, i: number) => {
      if (i === params.index) {
        return {
          ...layer,
          [params.key]: value,
        };
      }

      return layer;
    }),
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
