import { type Sequential } from "@tensorflow/tfjs";

/**
 * Download a specific model
 * @param model The model to download
 * @returns Promise<void>
 */
export default async function downloadModel(model: Sequential): Promise<void> {
  if (!model) {
    return;
  }

  const savedModel = await model.save("downloads://model");
  const modelJSON = JSON.stringify(savedModel);
  const ENCODING_PREFIX = "data:text/plain;charset=utf-8,";

  window.location.href = ENCODING_PREFIX + encodeURIComponent(modelJSON);
}
