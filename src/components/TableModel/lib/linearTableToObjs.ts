import { genId } from "~/lib/crypto";
import { type TableValue } from "~/lib/types";

/**
 * Convert a linear array of numbers to an array of objects
 * @param {number[]} nums The linear array of numbers
 * @returns {Promise<{id: string, values: number[]}[]>} The array of objects
 * @async
 */
export async function linearTableToObjs(
  cols: number,
  nums: number[],
): Promise<TableValue[]> {
  const result: TableValue[] = [];

  for (let i = 0; i < nums.length; i += cols) {
    const values: number[] = [nums[i] ?? 0, nums[i + 1] ?? 0];
    const id: string = await genId();

    result.push({
      id,
      values,
    });
  }

  return result;
}
