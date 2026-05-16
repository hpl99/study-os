"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Creates Gemini client safely
 */
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("GEMINI_API_KEY is missing");
    return null;
  }

  return new GoogleGenerativeAI(apiKey);
}

/**
 * General AI Chat Response
 */
export async function generateAIChatResponse(
  prompt: string,
  context?: string
) {
  try {
    const genAI = getGenAI();

    if (!genAI) {
      return "AI assistant is temporarily unavailable.";
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
    });

    const fullPrompt = context
      ? `System Context: ${context}\n\nUser Query: ${prompt}`
      : prompt;

    const result = await model.generateContent(fullPrompt);

    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error("Gemini Chat Error:", error);

    return "I'm sorry, I encountered an error while processing your request.";
  }
}

/**
 * Analyze Weak DSA Topics
 */
export async function analyzeWeakTopics(solvedTopics: string[]) {
  try {
    const genAI = getGenAI();

    if (!genAI) {
      return "AI analysis is temporarily unavailable.";
    }

    if (!solvedTopics || solvedTopics.length === 0) {
      return "Solve a few problems first so I can analyze your weak areas.";
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
You are an expert Data Structures and Algorithms mentor.

The user has solved problems with the following topic tags:

${solvedTopics.join(", ")}

Based on this:
1. Identify strong areas
2. Identify weak or missing topics
3. Recommend 2-3 important next topics

Keep the response concise, practical, encouraging, and formatted in Markdown.
`;

    const result = await model.generateContent(prompt);

    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error("Gemini Analysis Error:", error);

    return "Analysis is currently unavailable.";
  }
}