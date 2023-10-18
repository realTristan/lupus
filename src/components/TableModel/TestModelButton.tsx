import { type Dispatch, type SetStateAction, useState } from "react";
import { testModel } from "../../lib/projects/project/tables/testModel";
import { type Sequential } from "@tensorflow/tfjs";
import { type Model, type TableValue, type Network } from "~/lib/types";
import { LoadingRelative } from "~/components/SvgComponents/Loading";
import SlateBorderButton from "../SlateBorderButton";

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
    <SlateBorderButton disabled={true}>
      <LoadingRelative /> Loading
    </SlateBorderButton>
  ) : (
    <SlateBorderButton onClick={async () => await onClick()}>
      Test
    </SlateBorderButton>
  );
}
