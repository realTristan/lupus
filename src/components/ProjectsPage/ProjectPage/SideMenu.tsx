import NetworkSVG from "~/components/SvgComponents/Network";
import TableSVG from "~/components/SvgComponents/Table";
import { type ObjectState } from "~/lib/state";
import { type Project, type Network, Table } from "~/lib/types";

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
    <div className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col gap-2 bg-slate-50 p-6 pt-36">
      {/* Project name and description */}
      <div className="mb-2">
        <h1 className="text-xl font-black">{props.project.name}</h1>
        <p className="mt-1 text-sm font-thin">{props.project.description}</p>
      </div>

      {/* Networks */}
      <div className="flex flex-col gap-2">
        {props.project.networks?.map((network: Network) => {
          return (
            <a
              href={`#${network.id}`}
              key={network.id}
              className={`flex flex-row items-center justify-start gap-3 rounded-full px-5 py-2 text-sm font-normal tracking-wider text-slate-950 hover:bg-gray-200 ${
                network.id === props.activeNetwork.value.id
                  ? "bg-gray-200"
                  : "bg-none"
              }`}
            >
              <NetworkSVG className="h-5 w-5 fill-slate-800" />
              <span>{network.name}</span>
            </a>
          );
        })}
      </div>

      {/* Tables */}
      <div className="flex flex-col gap-2">
        {props.project.tables?.map((table: Table) => (
          <a
            href={`#${table.id}`}
            key={table.id}
            className="flex flex-row items-center justify-start gap-3 rounded-full px-5 py-2 text-sm font-normal tracking-wider text-slate-950 hover:bg-gray-200"
          >
            <TableSVG className="mt-0.5 h-5 w-5 fill-slate-800" />
            <span>{table.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
