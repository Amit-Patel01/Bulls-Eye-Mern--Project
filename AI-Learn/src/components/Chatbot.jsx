import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function Chatbot({ fullscreen = false, onClose }) {

  const [messages, setMessages] = useState([
    {
      id: Date.now(),
      text: "👋 Hello! I'm your AI Learning Assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const question = input;
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/chatbot",
        { message: question }
      );

      const botMessage = {
        id: Date.now() + 1,
        text: response.data?.reply || "I couldn't generate a response.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {

      const errorMessage = {
        id: Date.now() + 2,
        text: "❌ Server error. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);

    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        text: "👋 Hello! I'm your AI Learning Assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  };

  // if fullscreen mode we always render the window and ignore toggle button
  const showWindow = fullscreen || isOpen;

  return (
    <div className={fullscreen ? "fixed inset-0 z-50 bg-white" : "fixed bottom-4 right-4 z-50"}>

      {!fullscreen && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 text-white p-4 rounded-full shadow-lg"
        >
          🤖
        </button>
      )}

      {showWindow && (
        <div className={fullscreen ? "w-full h-full flex flex-col" : "bg-white w-96 h-[450px] rounded-xl shadow-xl flex flex-col"}>
          {fullscreen && (
            <button
              onClick={() => {
                if (onClose) onClose();
                else setIsOpen(false);
              }}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
              title="Close chat"
            >
              ✖
            </button>
          )}

          <div className="bg-indigo-600 text-white p-3 flex justify-between">
            <h3>AI Assistant</h3>
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id}
                className={msg.sender === "user" ? "text-right" : "text-left"}>

                <div
                  className={`inline-block px-3 py-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {msg.text}
                </div>

              </div>
            ))}

            {loading && <p className="text-gray-500 text-sm">AI is typing...</p>}

            <div ref={messagesEndRef}></div>
          </div>

          <form onSubmit={handleSendMessage} className="p-3 flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2"
              placeholder="Ask something..."
            />

            <button className="bg-indigo-600 text-white px-4 rounded-lg">
              Send
            </button>
          </form>

          <button
            onClick={clearChat}
            className="text-xs text-red-500 pb-2"
          >
            Clear Chat
          </button>

        </div>
      )}
    </div>
  );
}