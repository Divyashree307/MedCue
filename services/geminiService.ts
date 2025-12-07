import { GoogleGenAI } from "@google/genai";

// Initialize the client
// In a real production app, ensure this key is guarded.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeSymptoms = async (symptoms: string, userAge: string, userGender: string): Promise<string> => {
  try {
    const prompt = `
      I am a ${userAge} year old ${userGender}.
      I am experiencing the following symptoms: ${symptoms}.
      
      Please provide a simple, easy-to-understand analysis of what this might be. 
      List 3-5 possible causes.
      Keep the language very simple, suitable for an elderly person.
      Do not give a medical diagnosis, just possibilities.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful medical assistant for elderly people. Be kind, clear, and reassuring. Always emphasize seeing a real doctor."
      }
    });

    return response.text || "Unable to analyze at this time. Please consult a doctor.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while connecting to the medical assistant. Please check your internet connection.";
  }
};