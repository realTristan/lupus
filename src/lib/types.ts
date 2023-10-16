import { type Dispatch, type SetStateAction } from "react";

export type SetState<T> = Dispatch<SetStateAction<T>>;

export interface Project {
  id: string;
  name: string;
  description?: string;
  type: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  user: User;
  userSecret: string;
}

export interface User {
  id?: number;
  email: string;
  secret: string;
  projects?: Project[];
}

export interface TableData {
  headers: string[];
  data: any[][];
}
