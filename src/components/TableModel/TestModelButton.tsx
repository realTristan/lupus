import { type Dispatch, type SetStateAction, useState } from "react";
import { testModel } from "../../lib/projects/project/tables/testModel";
import { type Sequential } from "@tensorflow/tfjs";
import { type Model, type TableValue, type Network } from "~/lib/types";
import { LoadingRelative } from "~/components/Svgs/Loading";

/**
 * Test Model Button props
 * @interface Props
 * @property {number} input The input
 * @property {Sequential} model The model
 * @property {Network} activeNetwork The active network
 * @property {number} epochs The epochs
 * @property {Model[]} models The models
 * @property {TableValue[]} values The values
 * @property {Function} setCurrentModel Set the current model
 * @property {Function} setModels Set the models
 * @property {Function} setPrediction Set the prediction
 */
interface Props {
  input: number;
  model: Sequential | null;
  activeNetwork: Network;
  epochs: number;
  models: Model[];
  values: TableValue[];
  setCurrentModel: Dispatch<SetStateAction<Model | null>>;
  setModels: Dispatch<SetStateAction<Model[]>>;
  setPrediction: Dispatch<SetStateAction<string>>;
}

/**
 * Generate the prediction button
 * @param {Props} props Props
 * @param {number} props.input The input
 * @param {Sequential} props.model The model
 * @param {Network} props.activeNetwork The active network
 * @param {number} props.epochs The epochs
 * @param {Model[]} props.models The models
 * @param {TableValue[]} props.values The values
 * @param {Function} props.setCurrentModel Set the new model function
 * @param {Function} props.setModles Set the models function
 * @param {Function} props.setPrediction Set the prediction function
 * @returns JSX.Element
 * @async
 */
export default function TestModelButton(props: Props): JSX.Element {
  const [testing, setTesting] = useState(false);

  const onClick = async () => {
    if (props.epochs > 100) {
      return;
    }

    if (testing) {
      return;
    }

    setTesting(true);

    const pred = await testModel({
      input: props.input,
      model: props.model,
      activeNetwork: props.activeNetwork,
      epochs: props.epochs,
      models: props.models,
      values: props.values,
      setCurrentModel: props.setCurrentModel,
      setModels: props.setModels,
    });

    props.setPrediction(pred?.toString() ?? "Error (None)");

    setTesting(false);
  };

  return testing ? (
    <button
      onClick={async () => await onClick()}
      className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-14 py-3 tracking-wider text-slate-950 hover:bg-slate-50"
    >
      <LoadingRelative className="h-8 w-8" />
    </button>
  ) : (
    <button
      onClick={async () => await onClick()}
      className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-14 py-3 text-sm font-normal tracking-wider text-slate-950 hover:bg-slate-50"
    >
      <span>Test Model</span>
    </button>
  );
}
