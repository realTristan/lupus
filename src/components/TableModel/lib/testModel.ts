import {
  type Tensor,
  type Sequential,
  type Rank,
  tensor2d,
} from "@tensorflow/tfjs";

import { buildModel } from "./buildModel";
import { type TableValue, type Model, type Network } from "~/lib/types";
import { genId } from "~/lib/crypto";
import { type Dispatch, type SetStateAction } from "react";

/**
 * The parameters
 * @typedef {Object} Parameters
 * @property {number} input The input
 * @property {Sequential} model The model
 * @property {Network} activeNetwork The active network
 * @property {number} epochs The epochs
 * @property {Model[]} models The models
 * @property {TableValue[]} values The values
 * @property {SetState<Model | null>} setCurrentModel The set current model function
 * @property {SetState<Model[]>} setModels The set models function
 */
interface Parameters {
  input: number;
  model: Sequential | null;
  activeNetwork: Network;
  epochs: number;
  models: Model[];
  values: TableValue[];
  setCurrentModel: Dispatch<SetStateAction<Model | null>>;
  setModels: Dispatch<SetStateAction<Model[]>>;
}

/**
 * Test the model
 * @param {Parameters} params The parameters
 * @param {number} params.input The input
 * @param {Sequential} params.model The model
 * @param {Network} params.activeNetwork The active network
 * @param {number} params.epochs The epochs
 * @param {Model[]} params.models The models
 * @param {TableValue[]} params.values The values
 * @param {SetState<Model | null>} params.setCurrentModel The set current model function
 * @param {SetState<Model[]>} params.setModels The set models function
 * @returns Promise<Tensor<Rank> | Tensor<Rank>[] | null>
 */
export async function testModel(params: Parameters) {
  const predict = async (model: Sequential) => {
    const testTensor = tensor2d([params.input], [1, 1]);
    const pred = model.predict(testTensor);

    return pred;
  };

  if (params.model == null) {
    const newSeqModel = await buildModel({
      activeNetwork: params.activeNetwork,
      epochs: params.epochs,
      values: params.values,
    }).catch((e) => console.log(e.message));

    if (!newSeqModel) {
      return null;
    }

    const newModel = {
      id: await genId(),
      networkName: params.activeNetwork.name,
      networkId: params.activeNetwork.id,
      createdAt: new Date(),
      model: newSeqModel,
    };

    params.setModels([...params.models, newModel]);

    params.setCurrentModel(newModel);

    const pred: Tensor<Rank> | Tensor<Rank>[] = await predict(newModel.model);
    return pred;
  }

  const pred: Tensor<Rank> | Tensor<Rank>[] = await predict(params.model);
  return pred;
}
