import { type Project } from "~/lib/types";

export const generateDefaultProject = (): Project => {
  const randomProjectId: number = Math.floor(Math.random() * 1000000);
  const randomProjectIdString: string = randomProjectId.toString();

  return {
    id: randomProjectIdString,
    name: `my-project-${randomProjectId}`,
    description: "A super cool description!",
    tags: [""],
  };
};
