import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { AI_CONFIG } from "../config/ai.config.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel(AI_CONFIG.FLASH);

export const chatWithGemini = async (message, menuData, bestSellers) => {
  try {
    // 1. Chuẩn bị dữ liệu menu dạng text để AI đọc
    const menuContext = menuData.map(item => {
      const isBestSeller = bestSellers.includes(item.name) ? "🌟 (Món Bán Chạy Nhất)" : "";
      let priceInfo = `Giá: ${item.originalPrice}đ`;
      if (item.discount > 0) {
        priceInfo = `Giá gốc: ${item.originalPrice}đ, Đang GIẢM ${item.discount}%, Giá chỉ còn: ${item.finalPrice}đ`;
      }
      
      return `- ${item.name} ${isBestSeller}. ${priceInfo}. Mô tả: ${item.description || "Thơm ngon đậm đà"}`;
    }).join("\n");

    const shopInfo = `
    THÔNG TIN QUÁN "COFFEE GO":
    - Địa chỉ: 12 Bạch Đằng, quận Hải Châu, Đà Nẵng.
    - Giờ mở cửa: 8h00 - 23h00 mỗi ngày.
    - Ship: Có ship bán kính 10km quanh quận Hải Châu, phí ship 20k.
    `;

    const prompt = `
    Bạn là nhân viên phục vụ ảo thông minh, thân thiện và hài hước của quán "Coffee Go".
    
    NHIỆM VỤ CỦA BẠN:
    Trả lời tin nhắn khách hàng một cách tự nhiên bằng tiếng Việt (dùng emoji ☕✨ vui vẻ).
    KHÔNG trả lời kiểu robot hay JSON. Đừng lặp lại câu chào nếu cuộc hội thoại đã bắt đầu.

    DỮ LIỆU CỦA BẠN:
    1. THÔNG TIN QUÁN:
    ${shopInfo}

    2. THỰC ĐƠN HÔM NAY (Đã bao gồm giá giảm):
    ${menuContext}

    QUY TẮC TƯ VẤN:
    - Nếu khách hỏi "có món gì ngon" hoặc nhờ gợi ý: Hãy ưu tiên giới thiệu các món có nhãn "Món Bán Chạy Nhất".
    - Nếu khách đưa ngân sách (Ví dụ: 200k): Hãy tự tính toán và gợi ý COMBO nhiều món (nước + bánh) sao cho vừa đủ số tiền đó.
    - LUÔN báo "Giá chỉ còn" (giá sau giảm) để khách thấy hời.
    - Nếu khách hỏi món không có trong menu: Xin lỗi khéo và gợi ý món tương tự có trong danh sách trên.
    - Không bịa đặt thông tin không có trong dữ liệu.

    Khách hàng hỏi: "${message}"
    Nhân viên Coffee Go trả lời:
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return response;

  } catch (err) {
    console.error("Gemini Service Error:", err);
    return "Xin lỗi bạn tôi có chút việc, bạn chờ xíu nhé! ☕";
  }
};