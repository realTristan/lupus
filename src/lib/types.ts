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
  id: string;
  input: number[];
}

export interface TableInput {
  headers: string[];
  data: TableData[];
}

export interface Layer {
  type: "dense" | "conv2d" | "maxpool2d";
  neurons?: number;
  inputShape?: number;
}
