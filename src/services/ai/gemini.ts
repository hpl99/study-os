import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateAIChatResponse(prompt: string, context?: string) {
  if (!genAI) {
    return "Error: Gemini API key is not configured. Please add GEMINI_API_KEY to your environment variables.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const fullPrompt = context 
      ? `System Context: ${context}\n\nUser Query: ${prompt}` 
      : prompt;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I encountered an error while processing your request. Please try again.";
  }
}

export async function analyzeWeakTopics(solvedTopics: string[]) {
  if (!genAI) {
    return "Configure your GEMINI_API_KEY to see AI-driven weak topic analysis.";
  }

  if (!solvedTopics || solvedTopics.length === 0) {
    return "You haven't solved enough problems yet! Solve a few problems so I can analyze your weak areas.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
      You are an expert Data Structures and Algorithms coach.
      The user has solved problems with the following topic tags: ${solvedTopics.join(", ")}.
      
      Based on this list:
      1. What are their strong areas?
      2. What topics are conspicuously missing or underrepresented?
      3. Recommend 2-3 specific topics they should focus on next to become well-rounded.
      
      Keep the response concise, encouraging, and format it nicely in Markdown.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Analysis currently unavailable.";
  }
}
