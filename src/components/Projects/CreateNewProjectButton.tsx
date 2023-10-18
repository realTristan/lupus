import { type NextRouter } from "next/router";
import { type Project } from "~/lib/types";

interface Props {
  project: Project;
  router: NextRouter;
  createProject: () => Promise<void>;
}

export default function CreateNewProjectButton(props: Props): JSX.Element {
  const IS_INVALID_NAME = props.project.name.length > 20;
  const IS_INVALID_DESCRIPTION = props.project.description.length > 50;

  const createNewProject = async () => {
    if (IS_INVALID_NAME) return;
    if (IS_INVALID_DESCRIPTION) return;

    props.createProject();
    props.router.push("/projects").catch((e) => console.log(e.message));
  };

  return (
    <button
      onClick={() => createNewProject()}
      className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-8 py-3 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50"
    >
      <p>Create</p>
    </button>
  );
}
