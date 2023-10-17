import { useState } from "react";
import testModel from "../lib/testModel";
import { type Sequential } from "@tensorflow/tfjs";
import { type Build, type TableValue, type Network } from "~/lib/types";
import { LoadingRelative } from "~/components/svgs/Loading";

/**
 * Test Model Button props
 * @interface Props
 * @property {number} input The input
 * @property {Sequential} model The model
 * @property {Network} activeNetwork The active network
 * @property {number} epochs The epochs
 * @property {Build[]} builds The builds
 * @property {TableValue[]} values The values
 * @property {Function} setNewModel Set the new model
 * @property {Function} setBuilds Set the builds
 * @property {Function} setPrediction Set the prediction
 */
interface Props {
  input: number;
  model: Sequential | null;
  activeNetwork: Network;
  epochs: number;
  builds: Build[];
  values: TableValue[];
  setNewModel: (model: Sequential) => void;
  setBuilds: (builds: Build[]) => void;
  setPrediction: (prediction: string) => void;
}

/**
 * Generate the prediction button
 * @param {Props} props Props
 * @param {number} props.input The input
 * @param {Sequential} props.model The model
 * @param {Network} props.activeNetwork The active network
 * @param {number} props.epochs The epochs
 * @param {Build[]} props.builds The builds
 * @param {TableValue[]} props.values The values
 * @param {Function} props.setNewModel Set the new model function
 * @param {Function} props.setBuilds Set the builds function
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
      builds: props.builds,
      values: props.values,
      setNewModel: props.setNewModel,
      setBuilds: props.setBuilds,
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
      className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-14 py-4 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50"
    >
      <span>Test Model</span>
    </button>
  );
}
