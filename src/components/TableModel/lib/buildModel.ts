import {
  type Sequential,
  layers as tfLayers,
  sequential,
  tensor2d,
} from "@tensorflow/tfjs";
import { type TableValue, type Network } from "~/lib/types";

/**
 * The parameters
 * @typedef {Object} Parameters
 * @property {Network} activeNetwork The active network
 * @property {number} epochs The epochs
 * @property {TableValue[]} values The values
 */
interface Parameters {
  activeNetwork: Network;
  epochs: number;
  values: TableValue[];
}

/**
 * Build the model
 * @returns Promise<void>
 * @param params The parameters
 * @param params.activeNetwork The active network
 * @param params.epochs The epochs
 * @param params.values The values
 */
export async function buildModel(params: Parameters): Promise<Sequential> {
  const model = sequential();

  for (const layer of params.activeNetwork.layers) {
    model.add(
      tfLayers.dense({
        units: layer.neurons ?? 1,
        inputShape: [layer.shape ?? 1],
      }),
    );
  }

  model.compile({ loss: "meanSquaredError", optimizer: "adam" });

  const valuesLength: number = params.values.length;

  const xs = tensor2d(
    params.values.map((t: TableValue) => t.values[0] ?? 0),
    [valuesLength, 1],
  );

  const ys = tensor2d(
    params.values.map((t: TableValue) => t.values[1] ?? 0),
    [valuesLength, 1],
  );

  await model.fit(xs, ys, { epochs: params.epochs });

  return model;
}
