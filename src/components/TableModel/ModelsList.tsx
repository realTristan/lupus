import { type Network, type Model } from "~/lib/types";
import { downloadModel } from "../../lib/projects/project/tables/downloadModel";
import { type Dispatch, type SetStateAction } from "react";

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

  return (
    <div
      className={`mt-4 w-full gap-2 ${HAS_MODELS ? "flex flex-col" : "hidden"}`}
    >
      <h1 className="mt-5 text-2xl font-black">My Models</h1>
      <div className="flex w-full flex-col gap-2">
        {props.models.map((model: Model) => (
          <div key={model.id} className="group flex flex-row gap-4">
            <span className="w-full rounded-md border-2 border-slate-100 bg-white px-7 py-3 text-base font-normal tracking-wider text-slate-950 group-hover:bg-slate-50">
              <strong>{model.networkName}</strong>
              <br />
              {model.createdAt.toLocaleString()}
            </span>
            <button
              className="flex w-auto flex-row items-center justify-start gap-2 rounded-md border-2 border-slate-100 bg-white px-14 py-3 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50"
              onClick={async () => await downloadModel(model.model)}
            >
              Download model
            </button>
            <button
              disabled={props.currentModel?.id === model.id}
              className="flex w-auto flex-row items-center justify-start gap-2 rounded-md border-2 border-slate-100 bg-white px-14 py-3 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50 disabled:opacity-50"
              onClick={() => props.setCurrentModel(model)}
            >
              {props.currentModel?.id === model.id
                ? "Already in use"
                : "Use model"}
            </button>
            <button
              disabled={props.currentModel?.id === model.id}
              className="flex w-auto flex-row items-center justify-start gap-2 rounded-md border-2 border-slate-100 bg-white px-14 py-3 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50 disabled:opacity-50"
              onClick={() => {
                if (props.currentModel?.id === model.id) {
                  return;
                }

                props.setModels(
                  props.models.filter((m: Model) => m.id !== model.id),
                );
              }}
            >
              Delete model
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
