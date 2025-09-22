export const predictWithModel = async (features: number[]) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) || "http://localhost:3000"; 

    const response = await fetch(`${baseUrl}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features }),
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

      const result = await response.json();
      
    return { prediction: result.prediction, success: true };
  }
  catch (err: any) {
    console.log(err)
    return { success: false, error: err.message };
  }
};
