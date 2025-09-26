// NOT IN USE

// import * as ort from "onnxruntime-node";
import * as ort from "onnxruntime-web";
// import path from "path";

// Load model once (good for performance)
const modelUrl = "/scan-classifier.onnx";

// Reuse the session rather than reloading every call
let session: ort.InferenceSession | null = null;

export const modelPrediction = async (
  features: number[]
): Promise<Float32Array> => {
  if (!Array.isArray(features)) {
    throw new Error("Features must be an array of numbers");
  }

  // Lazy-load session
  // if (!session) {
  //   session = await ort.InferenceSession.create(modelUrl);
  // }
  
  if (!session) {
    // Configure ONNX Runtime Web
    ort.env.wasm.numThreads = 1;
    ort.env.wasm.proxy = false;

    session = await ort.InferenceSession.create(modelUrl, {
      executionProviders: ["wasm"],
    });
  }

  // Convert JS numbers → Float32Array
  const inputArray = Float32Array.from(features);

  // Input tensor must match shape model expects, e.g. [1, 56]
  const inputTensor = new ort.Tensor("float32", inputArray, [
    1,
    features.length,
  ]);

  // ONNX input name must match what you exported (often 'float_input')
  const feeds: Record<string, ort.Tensor> = { float_input: inputTensor };

  // Run inference
  const results = await session.run(feeds);

  // Usually the first output name is correct
  const outputName = session.outputNames[0];

  return results[outputName].data as Float32Array;
};
