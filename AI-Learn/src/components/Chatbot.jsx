import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function Chatbot({ fullscreen = false, onClose }) {
  const [materials, setMaterials] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hello! I'm your AI Learning Assistant. Select a document above to ask context-specific questions, or just ask me anything generally!",
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
    if (isOpen || fullscreen) {
      fetchMaterials();
    }
  }, [isOpen, fullscreen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const fetchMaterials = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/materials?userId=123`);
      setMaterials(res.data);
      if (res.data.length > 0 && !selectedFile) {
        setSelectedFile(res.data[0].filename);
      }
    } catch (err) {
      console.log("Error fetching materials");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const question = input;
    const userMessage = {
      id: Date.now(),
      text: question,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/chatbot`, {
        message: question,
        filename: selectedFile,
      });

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
        text: "❌ Server error. " + (error.response?.data?.error || "Please try again later."),
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
        text: "👋 Chat cleared. How can I assist you with this document?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  };

  const showWindow = fullscreen || isOpen;

  return (
    <div className={fullscreen ? "fixed inset-0 z-50 bg-slate-100/50 backdrop-blur-md p-4 md:p-8 flex items-center justify-center font-sans text-slate-800" : "fixed bottom-6 right-6 z-50 font-sans text-slate-800"}>
      
      {!fullscreen && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-full shadow-[0_8px_30px_rgba(99,102,241,0.4)] hover:scale-110 transition-all duration-300 border border-white/20"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-white"></span>
          </span>
        </button>
      )}

      {showWindow && (
        <div className={`relative flex flex-col bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_40px_rgba(31,38,135,0.1)] overflow-hidden ${
          fullscreen ? "w-full max-w-4xl h-[85vh] rounded-3xl" : "w-80 md:w-[26rem] h-[32rem] rounded-3xl animate-fade-in-up origin-bottom-right"
        }`}>
          
          {/* Header */}
          <div className="bg-white/90 backdrop-blur-md p-4 border-b border-indigo-100 flex flex-col gap-3 relative z-10 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 shadow-inner border border-indigo-200">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <div>
                  <h3 className="text-slate-800 font-extrabold tracking-wide">AI Tutor</h3>
                  <p className="text-emerald-500 text-xs font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button title="Clear Chat" onClick={clearChat} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 hover:bg-indigo-50 rounded-lg border border-slate-200 hover:border-indigo-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
                <button
                  onClick={() => {
                    if (onClose) onClose();
                    else setIsOpen(false);
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors bg-slate-50 hover:bg-rose-50 rounded-lg border border-slate-200 hover:border-rose-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            </div>

            {/* Document Selector */}
            <div className="relative mt-1">
              <select
                value={selectedFile}
                onChange={(e) => setSelectedFile(e.target.value)}
                className="w-full bg-indigo-50/50 hover:bg-indigo-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl pl-4 pr-10 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-colors cursor-pointer shadow-inner"
              >
                <option value="" className="bg-white font-bold text-indigo-600">🌐 General AI Chat (No Document)</option>
                {materials.map((m) => (
                  <option key={m.filename} value={m.filename} className="bg-white text-slate-700 font-medium">
                    📄 {m.originalName}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-indigo-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gradient-to-b from-indigo-50/30 to-slate-50/50 relative">
            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div key={msg.id} className={`flex flex-col ${isUser ? "items-end" : "items-start"} animate-fade-in-up`}>
                  <div className="flex items-end gap-2.5 max-w-[88%]">
                    {!isUser && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-100 to-purple-200 shrink-0 flex items-center justify-center text-[10px] text-indigo-700 font-black shadow-sm border border-indigo-200">
                        AI
                      </div>
                    )}
                    <div
                      className={`px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                        isUser
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-sm shadow-indigo-500/20"
                          : "bg-white text-slate-700 border border-slate-200 rounded-bl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                  <span className={`text-[10px] font-medium text-slate-400 mt-1.5 ${isUser ? "mr-1" : "ml-10"}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-end gap-2.5 max-w-[85%] animate-fade-in">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-100 to-purple-200 shrink-0 flex items-center justify-center text-[10px] text-indigo-700 font-black shadow-sm border border-indigo-200">AI</div>
                <div className="px-5 py-4 rounded-2xl rounded-bl-sm bg-white border border-slate-200 flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef}></div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white/90 backdrop-blur-md border-t border-indigo-50 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
            <div className="relative flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 shadow-inner focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                className="flex-1 bg-transparent text-slate-800 text-[15px] placeholder-slate-400 px-3 py-2 outline-none resize-none max-h-32 min-h-[44px]"
                placeholder="Message AI Tutor..."
                rows={1}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className={`p-2.5 rounded-xl shrink-0 transition-all ${
                  !input.trim() || loading
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 active:scale-95"
                }`}
              >
                <svg className="w-5 h-5 -mt-0.5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
              </button>
            </div>
          </form>

        </div>
      )}
    </div>
  );
}