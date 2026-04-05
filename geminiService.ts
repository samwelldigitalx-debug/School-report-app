import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error("Gemini API Key is missing. Please add it to the Secrets panel.");
  }
  return new GoogleGenAI({ apiKey });
};

export async function generateComment(average: number, role: 'teacher' | 'principal') {
  try {
    const ai = getAI();
    const prompt = `Generate a professional, encouraging ${role} comment for a student with an average score of ${average} out of 100 in a Nigerian school. Keep it concise (1-2 sentences).`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "Keep up the good work.";
  } catch (err) {
    console.error('AI Comment Generation Error:', err);
    return "Keep up the good work."; // Fallback
  }
}

export async function analyzePerformance(results: any[]) {
  try {
    const ai = getAI();
    const prompt = `Analyze the following student results and provide insights on top students, weak subjects, and overall class performance: ${JSON.stringify(results)}`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "No insights available.";
  } catch (err) {
    console.error('AI Performance Analysis Error:', err);
    return "No insights available.";
  }
}

export async function calculateGrade(score: number) {
  try {
    const ai = getAI();
    const prompt = `What is the grade and remark for a score of ${score} based on this system: 70-100=A (Excellent), 60-69=B (Very Good), 50-59=C (Good), 40-49=D (Fair), 0-39=F (Poor). Return as JSON: {"grade": "A", "remark": "Excellent"}`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            grade: { type: Type.STRING },
            remark: { type: Type.STRING },
          },
          required: ["grade", "remark"],
        },
      },
    });

    return JSON.parse(response.text || '{"grade": "F", "remark": "Poor"}');
  } catch (err) {
    console.error('AI Grade Calculation Error:', err);
    // Fallback to local calculation logic if needed, or return F
    return { grade: "F", remark: "Poor" };
  }
}
