import { type Project } from "~/lib/types";
import ProjectCard from "./ProjectCard";
import { type NextRouter } from "next/router";
import { type Session } from "next-auth";

interface Props {
  projects: Project[];
  router: NextRouter;
  session: Session;
}

export default function ProjectsTable(props: Props): JSX.Element {
  return (
    <table className="w-full table-auto">
      <thead>
        <tr className="text-left">
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Description</th>
          <th className="px-4 py-2">Created at</th>
          <th className="px-4 py-2">Last updated at</th>
          <th className="px-4 py-2"></th>
        </tr>
      </thead>
      <tbody>
        {props.projects.map((project: Project) => (
          <ProjectCard
            project={project}
            key={project.id}
            router={props.router}
            userSecret={props.session.user.secret ?? ""}
          />
        ))}
      </tbody>
    </table>
  );
}
