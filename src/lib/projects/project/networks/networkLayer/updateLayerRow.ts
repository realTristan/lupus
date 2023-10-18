import { type ChangeEvent } from "react";
import { type ObjectState } from "~/lib/state";
import { type Network, type Project } from "~/lib/types";

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

  const networkLayers = params.network.layers ?? [];
  const networkLayer = networkLayers[params.index];
  if (!networkLayer) return;

  const newLayers = networkLayers.map((layer, index) =>
    index === params.index
      ? {
          ...layer,
          [params.key]: parseInt(value),
        }
      : layer,
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

  console.log(params.project.value);
}
