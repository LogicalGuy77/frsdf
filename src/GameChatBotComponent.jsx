import { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

const GameChatbotComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const chatContainerRef = useRef(null);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const prompt = `You are a knowledgeable video game expert and recommender. The user says: "${input}". Provide a friendly and informative response, including game recommendations if appropriate. Keep your response concise but informative. Also give the user a review summary of the games you recommend.`;

      const result = await model.generateContent(prompt);
      const botReply = result.response.text();

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botReply, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Sorry, I couldn't process that request. Can you try again?",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 1000,
      }}
    >
      {isOpen ? (
        <div
          style={{
            width: "300px",
            height: "400px",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "10px",
              borderBottom: "1px solid #ccc",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0 }}>Vapor's AI Assistant</h3>
            <button
              onClick={toggleChat}
              style={{
                background: "none",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
          <div
            ref={chatContainerRef}
            style={{
              flexGrow: 1,
              overflowY: "auto",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  alignSelf:
                    message.sender === "user" ? "flex-end" : "flex-start",
                  backgroundColor:
                    message.sender === "user" ? "#007bff" : "#28a745",
                  color: "white",
                  padding: "5px 10px",
                  borderRadius: "10px",
                  marginBottom: "5px",
                  maxWidth: "70%",
                }}
              >
                {message.text}
              </div>
            ))}
            {isLoading && <div>Thinking...</div>}
          </div>
          <div style={{ display: "flex", padding: "10px" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              style={{ flexGrow: 1, marginRight: "5px", padding: "5px" }}
              placeholder="Ask about games..."
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              style={{
                padding: "5px 10px",
                backgroundColor: isLoading ? "#ccc" : "#007bff",
                color: "white",
                border: "none",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          }}
        >
          💬
        </button>
      )}
    </div>
  );
};

export default GameChatbotComponent;
