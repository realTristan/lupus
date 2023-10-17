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
  tables: Table[];
  networks: Network[];
  builds: Build[];
}

export interface Build {
  id?: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Network {
  id?: string;
  name: string;
  description?: string;
  layers: NetworkLayer[];
}

export interface NetworkLayer {
  id?: string;
  type: string;
  neurons?: number;
  shape?: number;
}

export interface Table {
  id?: string;
  name: string;
  description?: string;
  headers: string[];
  values: number[];
}

export interface TableValue {
  id?: string;
  values: number[];
}

export interface User {
  id?: number;
  email: string;
  secret: string;
  projects?: Project[];
}
