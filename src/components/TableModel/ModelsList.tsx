import { type Network, type Model } from "~/lib/types";
import { type Dispatch, type SetStateAction } from "react";
import SlateBorderButton from "../SlateBorderButton";
import DownloadModelButton from "./DownloadModelButton";

/**
 * Previous models list props
 * @interface Props
 * @property {Model[]} models The models
 * @property {Network} activeNetwork The active network
 * @property {Model | null} currentModel The current model
 * @property {Function} setModels Set the models
 * @property {Function} setCurrentModel Set the current model
 */
interface Props {
  models: Model[];
  activeNetwork: Network;
  currentModel: Model | null;
  setModels: Dispatch<SetStateAction<Model[]>>;
  setCurrentModel: Dispatch<SetStateAction<Model | null>>;
}

/**
 * Models list component
 * @param {Props} props Props
 * @param {Model[]} props.models The models
 * @param {Network} props.activeNetwork The active network
 * @param {Model | null} props.currentModel The current model
 * @param {Function} props.setModels Set the models
 * @param {Function} props.setCurrentModel Set the current model
 * @returns JSX.Element
 */
export default function PreviousModelsList(props: Props): JSX.Element {
  const HAS_MODELS = props.models.length > 0;
  const SLICED_MODELS = props.models.slice(0, 5);
  const deleteModel = (model: Model) => {
    if (props.currentModel?.id === model.id) return;

    props.setModels(SLICED_MODELS.filter((m: Model) => m.id !== model.id));
  };

  return (
    <div
      className={`mt-4 w-full gap-2 ${HAS_MODELS ? "flex flex-col" : "hidden"}`}
    >
      <h1 className="mt-5 text-2xl font-black">My Models</h1>
      <div className="flex w-full flex-col gap-2">
        {SLICED_MODELS.map((model: Model) => (
          <div key={model.id} className="group flex flex-row gap-4">
            <div className="flex w-full flex-row items-center justify-start gap-2 rounded-md border-2 border-slate-100 bg-white px-7 py-3 text-sm font-normal tracking-wider text-slate-950 group-hover:bg-slate-50">
              <strong>{model.networkName}</strong>
              <mark className="bg-transparent text-xs">
                {model.createdAt.toLocaleString()}
              </mark>
            </div>
            <SlateBorderButton
              disabled={props.currentModel?.id === model.id}
              onClick={() => props.setCurrentModel(model)}
            >
              {props.currentModel?.id === model.id ? "Activated" : "Activate"}
            </SlateBorderButton>
            <SlateBorderButton
              disabled={props.currentModel?.id === model.id}
              onClick={() => deleteModel(model)}
              className="border-0 bg-red-500 text-white hover:bg-red-500/80"
            >
              Delete
            </SlateBorderButton>
            <DownloadModelButton model={model.model} />
          </div>
        ))}
      </div>
    </div>
  );
}
