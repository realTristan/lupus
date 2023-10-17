import { type Dispatch, type SetStateAction, useState } from "react";
import buildModel from "../lib/buildModel";
import { type Build, type Network, type TableValue } from "~/lib/types";
import { type Sequential } from "@tensorflow/tfjs";
import { LoadingRelative } from "~/components/svgs/Loading";

/**
 * Build Model Button props
 * @interface Props
 * @property {Network} activeNetwork The active network
 * @property {number} epochs The epochs
 * @property {TableValue[]} values The values
 * @property {Function} setModel Set the model
 */
interface Props {
  activeNetwork: Network;
  epochs: number;
  values: TableValue[];
  setModel: (model: Sequential) => void;
  builds: Build[];
  setBuilds: Dispatch<SetStateAction<Build[]>>;
}

/**
 * Build model button component
 * @param {Props} props Build model button props
 * @param {Network} props.activeNetwork The active network
 * @param {number} props.epochs The epochs
 * @param {TableValue[]} props.values The values
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

    const newModel = await buildModel({
      activeNetwork: props.activeNetwork,
      epochs: props.epochs,
      values: props.values,
    });

    props.setModel(newModel);
    props.setBuilds([
      {
        model: newModel,
        createdAt: new Date(),
        networkName: props.activeNetwork.name,
      },
      ...props.builds,
    ]);

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
