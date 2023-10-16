import { base64encode } from "./crypto";

export const TEST_PROJECT_TABLE_HEADERS = [
  "Gender (M/F)",
  "Height (cm)",
  "Actions",
];
export const TEST_PROJECT_TABLE_DATA = [
  { id: base64encode(Math.random().toString()), input: [0, 220] },
  { id: base64encode(Math.random().toString()), input: [0, 210] },
  { id: base64encode(Math.random().toString()), input: [1, 120] },
];
