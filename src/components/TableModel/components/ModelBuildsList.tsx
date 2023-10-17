import { type Sequential } from "@tensorflow/tfjs";
import { type Build } from "~/lib/types";
import downloadModel from "../lib/downloadModel";

/**
 * Model builds list props
 * @interface Props
 * @property {Build[]} builds The builds
 * @property {Function} setBuilds Set the builds
 * @property {Function} setModel Set the model
 */
interface Props {
  builds: Build[];
  setBuilds: (builds: Build[]) => void;
  setModel: (model: Sequential) => void;
}

/**
 * Model builds list component
 * @returns JSX.Element
 */
export default function ModelBuildsList(props: Props): JSX.Element {
  const HAS_BUILDS = props.builds.length > 0;

  return (
    <div
      className={`mt-4 w-full gap-2 ${HAS_BUILDS ? "flex flex-col" : "hidden"}`}
    >
      <h1 className="text-2xl font-black">Previous Builds</h1>
      <div className="flex w-full flex-col gap-2">
        {props.builds.map((build: Build) => (
          <div key={build.id} className="group flex flex-row gap-4">
            <span className="w-full rounded-md border-2 border-slate-100 bg-white px-7 py-3 text-base font-normal tracking-wider text-slate-950 group-hover:bg-slate-50">
              <strong>{build.networkName}</strong>
              <br />
              {build.createdAt.toLocaleString()}
            </span>
            <button
              className="flex w-auto flex-row items-center justify-start gap-2 rounded-md border-2 border-slate-100 bg-white px-14 py-3 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50"
              onClick={async () => await downloadModel(build.model)}
            >
              Download Model
            </button>
            <button
              className="flex w-auto flex-row items-center justify-start gap-2 rounded-md border-2 border-slate-100 bg-white px-14 py-3 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50"
              onClick={() => props.setModel(build.model)}
            >
              Use Model
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
