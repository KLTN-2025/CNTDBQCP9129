import { useState, useRef, useEffect } from "react";
import { X, Send, Bot } from "lucide-react";
import chatbotApi from "../api/chatbotApi";

const AIChatBox = () => {
  const [isOpenChat, setIsOpenChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() && !isLoading) {
      const userMessage = inputMessage.trim();
      
      // Thêm tin nhắn của user
      setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
      setInputMessage("");
      setIsLoading(true);

      try {
        // Gọi API
        const response = await chatbotApi.sendMess({ message: userMessage });
        
        // Thêm tin nhắn từ AI
        setMessages(prev => [...prev, { 
          text: response.reply,
          isUser: false,
          options: response.options || null
        }]);
      } catch (error) {
        console.error("Error sending message:", error.response.data);
        setMessages(prev => [...prev, { 
          text: error.response.data.reply,
          isUser: false 
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleOptionClick = (option) => {
    setInputMessage(option);
  };

  return (
    <>
      {/* Nút mở chat AI */}
      <button
        onClick={() => setIsOpenChat(!isOpenChat)}
        className="fixed bottom-20 right-6 rounded-full p-4 cursor-pointer z-50 hover:scale-110 transition-transform"
      >
        <img src="/chatbot.png" className="object-cover w-12 h-12" alt="chat bot" />
      </button>

      {/* Khung chat AI */}
      {isOpenChat && (
        <div className="fixed bottom-40 right-10 w-80 h-[440px] bg-white rounded-lg shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="bg-orange-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={24} />
              <span className="font-semibold">Coffee Go</span>
            </div>
            <button
              onClick={() => setIsOpenChat(false)}
              className="hover:bg-orange-700 rounded p-1 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-grow overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-20">
                <Bot size={48} className="mx-auto mb-4 text-orange-600" />
                <p>Xin chào! Tôi có thể giúp gì cho bạn?</p>
              </div>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <div key={index}>
                    <div
                      className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 whitespace-pre-line ${
                          msg.isUser
                            ? "bg-orange-600 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                    
                    {/* Hiển thị options nếu có */}
                    {msg.options && !msg.isUser && (
                      <div className="flex flex-wrap gap-2 mt-2 ml-2">
                        {msg.options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleOptionClick(option)}
                            className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm hover:bg-orange-200 transition-colors"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 text-gray-800 rounded-lg p-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input area */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
                placeholder="Nhập tin nhắn..."
                disabled={isLoading}
                className="flex-grow border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 disabled:bg-gray-100"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-orange-600 cursor-pointer hover:bg-orange-700 text-white rounded-lg px-4 py-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatBox;