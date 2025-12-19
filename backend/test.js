import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

async function testGemini() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  try {
    const result = await model.generateContent("Say hello in Vietnamese");
    console.log("✅ Response:", result.response.text());
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testGemini();