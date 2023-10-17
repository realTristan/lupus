import { type Dispatch, type SetStateAction, useState } from "react";
import buildModel from "../lib/buildModel";
import { type Model, type Network, type TableValue } from "~/lib/types";
import { LoadingRelative } from "~/components/svgs/Loading";
import { genId } from "~/lib/crypto";

/**
 * Build Model Button props
 * @interface Props
 * @property {Network} activeNetwork The active network
 * @property {number} epochs The epochs
 * @property {TableValue[]} values The values
 * @property {Model[]} models The models
 * @property {Function} setModels Set the models
 * @property {Function} setCurrentModel Set the current model
 */
interface Props {
  activeNetwork: Network;
  epochs: number;
  values: TableValue[];
  models: Model[];
  setModels: Dispatch<SetStateAction<Model[]>>;
  setCurrentModel: Dispatch<SetStateAction<Model | null>>;
}

/**
 * Build model button component
 * @param {Props} props Props
 * @param {Network} props.activeNetwork The active network
 * @param {number} props.epochs The epochs
 * @param {TableValue[]} props.values The values
 * @param {Model[]} props.models The models
 * @param {Function} props.setModels Set the models
 * @param {Function} props.setCurrentModel Set the current model
 * @returns JSX.Element
 * @memberof Table
 */
export default function BuildModelButton(props: Props): JSX.Element {
  const [building, setBuilding] = useState(false);

  const onClick = async () => {
    if (building) {
      return;
    }

    setBuilding(true);

    const newSeqModel = await buildModel({
      activeNetwork: props.activeNetwork,
      epochs: props.epochs,
      values: props.values,
    });

    const newModel = {
      id: await genId(),
      model: newSeqModel,
      createdAt: new Date(),
      networkName: props.activeNetwork.name,
      networkId: props.activeNetwork.id,
    };

    props.setCurrentModel(newModel);
    props.setModels([newModel, ...props.models]);

    setBuilding(false);
  };

  return building ? (
    <button
      onClick={async () => await onClick()}
      className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-3 tracking-wider text-slate-950 hover:bg-slate-50"
    >
      <LoadingRelative className="h-8 w-8" />
    </button>
  ) : (
    <button
      onClick={async () => await onClick()}
      className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-3 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50"
    >
      <span>Build Model</span>
    </button>
  );
}
