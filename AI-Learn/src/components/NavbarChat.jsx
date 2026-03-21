import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function NavbarChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hi! I'm your AI assistant. Ask me anything about AI-Learn!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userText = input;

    // Add user message first
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        text: userText,
        sender: "user",
        timestamp: new Date(),
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/chatbot`,
        { message: userText }
      );

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text:
            response.data.reply ||
            "I couldn't generate a response. Please try again.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Chat Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: "❌ Sorry, I encountered an error. Please try again.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6 font-sans">
      <div 
        className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] w-full max-w-md h-[600px] max-h-[85vh] flex flex-col border border-white/80 overflow-hidden relative animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="bg-white/50 backdrop-blur-md p-5 border-b border-slate-100/80 flex justify-between items-center relative z-10 shadow-sm">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
               <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
             </div>
             <div>
                <h3 className="font-extrabold text-slate-800 tracking-tight text-lg">AI Assistant</h3>
                <p className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
                </p>
             </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-600 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] px-5 py-3.5 text-[15px] font-medium leading-relaxed drop-shadow-sm transition-all ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl rounded-tr-sm shadow-indigo-500/20"
                    : "bg-white border border-slate-100 text-slate-700 rounded-2xl rounded-tl-sm shadow-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] px-5 py-4 rounded-2xl rounded-tl-sm bg-white border border-slate-100 text-slate-500 shadow-sm flex gap-1.5 items-center">
                 <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                 <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                 <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white/80 backdrop-blur-md p-4 border-t border-slate-100/80 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <form onSubmit={handleSendMessage} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message your Assistant..."
              disabled={loading}
              className="w-full pl-5 pr-14 py-4 bg-slate-100/70 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500/30 text-[15px] font-medium text-slate-800 placeholder-slate-400 transition-all drop-shadow-sm"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className={`absolute right-2.5 w-10 h-10 flex items-center justify-center rounded-xl transition-all shadow-sm ${
                loading || !input.trim()
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 text-lg"
              }`}
            >
              <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
            </button>
          </form>
          <div className="text-center mt-2.5">
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-300">AI-Learn Assistant Preview</span>
          </div>
        </div>
      </div>
    </div>
  );
}