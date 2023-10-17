import { type ObjectState } from "~/lib/state";
import { type Project, type Network, type Table } from "~/lib/types";

/**
 * Side menu props
 */
interface Props {
  project: Project;
  activeNetwork: ObjectState<Network>;
}

/**
 * Side menu component
 * @param {Props} props Props
 * @param {Project} props.project The project
 * @param {ObjectState<Network>} props.activeNetwork The active network
 * @returns {JSX.Element} JSX.Element
 */
export default function SideMenu(props: Props): JSX.Element {
  return (
    <div className="fixed left-0 top-0 z-40 flex h-screen w-80 flex-col gap-7 bg-white p-10 pt-48">
      {/* Project name and description */}
      <div>
        <h1 className="text-2xl font-black">{props.project.name}</h1>
        <p className="text-md mt-1 font-thin">{props.project.description}</p>
      </div>

      {/* Networks */}
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-black">Networks</h1>
        {props.project.networks?.map((network: Network) => {
          return (
            <a
              href={`#${network.id}`}
              key={network.id}
              className={`flex flex-row items-center justify-start gap-2 rounded-md border-2 border-slate-100 bg-white px-7 py-3 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50 ${
                props.activeNetwork.value.id === network.id ? "bg-slate-50" : ""
              }`}
              onClick={() => props.activeNetwork.set(network)}
            >
              <span>{network.name}</span>
            </a>
          );
        })}
      </div>

      {/* Tables */}
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-black">Tables</h1>
        {props.project.tables?.map((table: Table) => (
          <a
            href={`#${table.id}`}
            key={table.id}
            className="flex flex-row items-center justify-start gap-2 rounded-md border-2 border-slate-100 bg-white px-7 py-3 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50"
          >
            <span>{table.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
