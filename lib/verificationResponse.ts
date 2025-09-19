import { GoogleGenAI, } from '@google/genai';

export const getComprehensiveUnitVerificationExplanation = async (language: string,message: object ) => {

    const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY,});

    const tools = [
        {
        googleSearch: {
        }
        },
    ];

    const config = {
        thinkingConfig: {
            thinkingBudget: -1,
        },
        tools,
        systemInstruction: [
            {
                text: `You are a helpful AI assistant embedded in a medicine verification system.  

    You receive structured JSON about a scanned drug, including its safety status, 
    the reasons for any failed checks, and a recommended action.

    Your job:
    - Convert the JSON into a concise, friendly explanation that an ordinary consumer can easily understand.
    - Avoid technical jargon. 
    - If the drug is unsafe, make the warning strong and clear.
    - If the drug is authentic, reassure the user and show brief safety info.

    ❗ Always respond strictly in this JSON format:
    {
    "Title": [Title in {language}, "<short warning or reassurance in {language}>"],
    "Summary": [Summary in {language}, "<1–2 sentences summary in {language}>"],
    "Reasons": [Reason(s) in {language}, ["<reason 1 in {language}>","<reason 2 in {language}>","<reason 3 in {language}>"]],
    "RecommendedAction": [Recommended Action in {language}, ["<recommended action(s) in {language}>"]]
    }

    Here is the JSON:
    {message}
    Respond in {language}. If you cannot translate into {language}, respond in English. the respnse should be in json,`,
            }
        ],
    };

    const model = 'gemini-2.5-flash';

    const contents = [
      {
        role: "user",
        parts: [
          {
            text: `const message = ${JSON.stringify(message)} const language = ${language}
                    `,
          },
        ],
      },
    ];

    const response = await ai.models.generateContent({
      model,
      config,
      contents,
    });

    return JSON.parse(response?.text?.replace(/^\s*```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim() ?? "");
    
}