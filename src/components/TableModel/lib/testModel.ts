import {
  type Tensor,
  type Sequential,
  type Rank,
  tensor2d,
} from "@tensorflow/tfjs";

import buildModel from "./buildModel";
import { type TableValue, type Build, type Network } from "~/lib/types";
import { genId } from "~/lib/crypto";

interface Parameters {
  input: number;
  model: Sequential | null;
  activeNetwork: Network;
  epochs: number;
  builds: Build[];
  values: TableValue[];
  setNewModel: (model: Sequential) => void;
  setBuilds: (builds: Build[]) => void;
}

/**
 * Test the model
 * @returns Tensor<Rank> | Tensor<Rank>[]
 * @memberof Table
 * @param params The parameters
 * @param params.input The input
 * @param params.model The model
 * @param params.activeNetwork The active network
 * @param params.epochs The epochs
 * @param params.builds The builds
 * @param params.values The values
 * @param params.setNewModel The set new model function
 * @param params.setBuilds The set builds function
 */
export default async function testModel(params: Parameters) {
  const predict = async (model: Sequential) => {
    const testTensor = tensor2d([params.input], [1, 1]);
    const pred = model.predict(testTensor);

    return pred;
  };

  if (params.model == null) {
    const newModel = await buildModel({
      activeNetwork: params.activeNetwork,
      epochs: params.epochs,
      values: params.values,
    }).catch((e) => console.log(e.message));

    if (!newModel) {
      return null;
    }

    params.setBuilds([
      ...params.builds,
      {
        id: await genId(),
        networkName: params.activeNetwork.name,
        createdAt: new Date(),
        model: newModel,
      },
    ]);

    params.setNewModel(newModel);

    const pred: Tensor<Rank> | Tensor<Rank>[] = await predict(newModel);
    return pred;
  }

  const pred: Tensor<Rank> | Tensor<Rank>[] = await predict(params.model);
  return pred;
}
