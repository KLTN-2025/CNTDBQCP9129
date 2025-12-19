import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { AI_CONFIG } from "../config/ai.config.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel(AI_CONFIG.FLASH);
const fallbackModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const analyzeMessage = async (message) => {
  try {
    return await callGemini(model, message);
  } catch (err) {
    if (err?.status === 503) {
      console.warn("Gemini flash overloaded → fallback 1.5");
      return await callGemini(fallbackModel, message);
    }
    throw err;
  }
};

const callGemini = async (model, message) => {
  const prompt = `
Chỉ trả về JSON HỢP LỆ, KHÔNG markdown, KHÔNG giải thích.

Schema:
{
  "intent": "ASK_PRICE | ASK_RECOMMEND | DESCRIBE_PRODUCT | UNKNOWN",
  "product": string | null
}

Quy tắc:
- product là TÊN CHUNG của đồ uống
- KHÔNG chứa: đá, nóng, dừa, size
- Nếu người dùng hỏi mô tả, hương vị, thành phần -> DESCRIBE_PRODUCT
- Nếu người dùng họ chỉ điền mỗi tên sản phẩm thì mày gửi vào mục DESCRIBE_PRODUCT nào hỏi giá, tiền, bao nhiêu thì đưa vào ASK_PRICE
Ví dụ hợp lệ:
{"intent":"ASK_PRICE","product":"latte"}
{"intent":"ASK_PRICE","product":"Mít sấy"}
{"intent":"ASK_PRICE","product":"bạc xỉu foam dừa"}
{"intent":"DESCRIBE_PRODUCT","product":"bạc xỉu form dừa"}
{"intent":"ASK_RECOMMEND","product":null}
{"intent":"UNKNOWN","product":null}

Câu hỏi: "${message}"
`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text();

  console.log("RAW AI >>>", raw);

  const cleaned = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error(cleaned);
    throw err;
  }
};
