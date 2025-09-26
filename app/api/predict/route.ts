// NOT IN USE

import type { NextApiRequest, NextApiResponse } from "next";
import * as ort from "onnxruntime-node";
import path from "path";

// Define the output type
type PredictionResponse = {
  prediction: number[] | Float32Array;
};

// Model path (inside public/)
const modelPath = path.join(process.cwd(), "public", "scan-classifier.onnx");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PredictionResponse | { error: string }>
) {

  try {
    // Accept POST only
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Grab input from body
    // Body should be: { features: number[] }
    const { features } = req.body as { features?: number[] };

    if (!features || !Array.isArray(features)) {
      return res
        .status(400)
        .json({ error: "Request body must contain features array" });
    }

    // Load the ONNX model session
    const session = await ort.InferenceSession.create(modelPath);

    // Convert JS numbers → Float32Array
    const inputArray = Float32Array.from(features);

    // Input tensor must match the shape the model expects
    // For example: [1, 56] if you have 56 features
    const inputTensor = new ort.Tensor("float32", inputArray, [
      1,
      features.length,
    ]);

    // ONNX input name must match what you exported (default 'float_input')
    const feeds: Record<string, ort.Tensor> = { float_input: inputTensor };

    // Run inference
    const results = await session.run(feeds);

    // Usually the first output name is correct
    const outputName = session.outputNames[0];
    const prediction = results[outputName].data as Float32Array;

    return res.status(200).json({ prediction });
    console.log("working welll")
  }
  catch (err: any) {
    console.error("ONNX inference error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Internal Server Error" });
  }
}
