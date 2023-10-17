import { MAX_NETWORKS } from "~/lib/constants";
import { genId } from "~/lib/crypto";
import { type ObjectState } from "~/lib/state";
import { type Network, type Project } from "~/lib/types";

/**
 * The parameters
 * @typedef {Object} Parameters
 * @property {Project} project The project
 */
interface Parameters {
  project: ObjectState<Project>;
}

/**
 * Create a new network
 * @param {Parameters} params The parameters
 * @param {Project} params.project The project
 * @returns Promise<void>
 */
export async function createNewNetwork(params: Parameters) {
  if (params.project.value.networks.length >= MAX_NETWORKS) {
    return;
  }

  // Create a new network
  const networkId: string = await genId();
  const newNetwork: Network = {
    id: networkId,
    name: `Network-${networkId.slice(0, 5)}`,
    description: "User created network",
    layers: [
      {
        id: await genId(),
        type: "dense",
        neurons: 1,
        shape: 1,
      },
    ],
  };

  // Update the project with the new network
  params.project.set({
    ...params.project.value,
    networks: [...params.project.value.networks, newNetwork],
  });
}
