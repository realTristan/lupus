import Link from "next/link";
import { type NextRouter } from "next/router";
import { trpcDeleteProject } from "~/lib/trpc/deleteProject";
import { type Project } from "~/lib/types";
import ExternalSVG from "../Svgs/External";
import CrossSVG from "../Svgs/Cross";

/**
 * Project card props
 */
interface Props {
  project: Project;
  userSecret: string;
  router: NextRouter;
}

/**
 * Project card
 * @param {Project} props.project Project
 * @param {string | null} props.secret User secret
 * @returns {JSX.Element} JSX.Element
 */
export default function ProjectCard(props: Props): JSX.Element {
  const { deleteProject } = trpcDeleteProject(
    props.userSecret,
    props.project.id,
  );

  return (
    <tr key={props.project.id} className="cursor-pointer hover:bg-slate-100/60">
      <td className="border px-4 py-2 text-sm">{props.project.name}</td>
      <td className="border px-4 py-2 text-sm">{props.project.description}</td>
      <td className="border px-4 py-2 text-sm">
        {new Date(props.project.createdAt ?? "").toLocaleString()}
      </td>
      <td className="border px-4 py-2 text-sm">
        {new Date(props.project.updatedAt ?? "").toLocaleString()}
      </td>
      <td className="flex flex-row gap-2 border px-4 py-2">
        <Link
          target="_blank"
          href={`/projects/id/${props.project.id}`}
          className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-7 py-2 text-sm font-normal tracking-wider text-slate-950 hover:border-slate-200 hover:bg-slate-200"
        >
          <ExternalSVG className="h-5 w-5 fill-slate-950" /> <p>Open</p>
        </Link>

        <button
          onClick={() => {
            deleteProject();
            props.router.reload();
          }}
          className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-50 bg-red-500 px-7 py-2 text-sm font-normal tracking-wider text-white hover:border-red-600 hover:bg-red-600"
        >
          <CrossSVG className="h-3 w-3 fill-white" /> <p>Delete</p>
        </button>
      </td>
    </tr>
  );
}
