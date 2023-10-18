import { type SetStateAction, type Dispatch, type ChangeEvent } from "react";
import { type Project } from "~/lib/types";

/**
 * Props
 */
interface Props {
  project: Project;
  setProject: Dispatch<SetStateAction<Project>>;
}

/**
 * Create new project inputs
 * @param {Props} props Props
 * @returns {JSX.Element} JSX.Element
 */
export default function CreateNewProjectInputs(props: Props): JSX.Element {
  const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    props.setProject({ ...props.project, name: e.target.value });
  };

  const onDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    props.setProject({ ...props.project, description: e.target.value });
  };

  const IS_INVALID_NAME = props.project.name.length > 20;
  const IS_INVALID_DESCRIPTION = props.project.description.length > 50;

  return (
    <>
      <input
        className="h-10 w-full rounded-md border-2 border-slate-100 border-b-slate-100 px-4 py-2 text-sm text-slate-600"
        placeholder="Project Name"
        onChange={onNameChange}
      />
      <p className="my-1 text-sm font-normal text-red-500">
        {IS_INVALID_NAME && "Project name must be less than 20 characters"}
      </p>

      <input
        className="h-10 w-full rounded-md border-2 border-slate-100 border-b-slate-100 px-4 py-2 text-sm text-slate-600"
        placeholder="Project Description"
        onChange={onDescriptionChange}
      />
      <p className="my-1 text-sm font-normal text-red-500">
        {IS_INVALID_DESCRIPTION &&
          "Project description must be less than 50 characters"}
      </p>
    </>
  );
}
