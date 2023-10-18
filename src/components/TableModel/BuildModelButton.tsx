import { type Dispatch, type SetStateAction, useState } from "react";
import { buildModel } from "../../lib/projects/project/tables/buildModel";
import { type Model, type Network, type TableValue } from "~/lib/types";
import { LoadingRelative } from "~/components/SvgComponents/Loading";
import { genId } from "~/lib/crypto";
import SlateBorderButton from "../SlateBorderButton";

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
    <SlateBorderButton disabled={true}>
      <LoadingRelative className="h-5 w-5 fill-white" />
      <span>Building</span>
    </SlateBorderButton>
  ) : (
    <SlateBorderButton onClick={async () => await onClick()}>
      Build
    </SlateBorderButton>
  );
}
