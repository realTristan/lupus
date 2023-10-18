import Link from "next/link";
import { type NextRouter } from "next/router";
import { trpcDeleteProject } from "~/lib/trpc/deleteProject";
import { type Project } from "~/lib/types";
import ExternalSVG from "../svgs/External";
import TrashcanSVG from "../svgs/Trashcan";

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
      <td className="border px-4 py-2">{props.project.name}</td>
      <td className="border px-4 py-2">{props.project.description}</td>
      <td className="border px-4 py-2">
        {new Date(props.project.createdAt ?? "").toLocaleString()}
      </td>
      <td className="border px-4 py-2">
        {new Date(props.project.updatedAt ?? "").toLocaleString()}
      </td>
      <td className="flex flex-col gap-2 border px-4 py-2">
        <Link
          href={`/projects/id/${props.project.id}`}
          className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-14 py-3 text-base font-normal tracking-wider text-slate-950 hover:border-slate-200 hover:bg-slate-200"
        >
          <ExternalSVG className="fill-slate-950" /> <p>Open Project</p>
        </Link>

        <button
          onClick={() => {
            deleteProject();
            props.router.reload();
          }}
          className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-red-500 bg-red-500 px-14 py-3 text-base font-normal tracking-wider text-white hover:border-red-600 hover:bg-red-600"
        >
          <TrashcanSVG className="fill-white" /> <p>Delete Project</p>
        </button>
      </td>
    </tr>
  );
}
