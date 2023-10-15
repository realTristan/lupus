import { type Dispatch, type SetStateAction } from "react";

export type SetState<T> = Dispatch<SetStateAction<T>>;

export interface Project {
  id: number;
  name: string;
  description?: string;
  type: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  user: User;
  userSecret: number;
}

export interface User {
  id?: number;
  email: string;
  secret: string;
  projects?: Project[];
}
