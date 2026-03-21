import React from 'react';
import { useNavigate } from 'react-router-dom';
import Chatbot from '../components/Chatbot';

export default function ChatPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-slate-50 to-purple-50 p-6 md:p-12 flex flex-col items-center font-sans">
      
      {/* Decorative background blobs */}
      <div className="fixed top-20 left-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>

      <div className="w-full max-w-4xl relative z-10 animate-fade-in-up">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl shadow-inner border border-indigo-200 mb-6 text-indigo-500 transform -rotate-6 hover:rotate-0 transition-all duration-300 relative overflow-hidden">
             <div className="absolute inset-0 bg-white/40"></div>
             <svg className="w-10 h-10 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
          </div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 tracking-tight">AI Assistant Hub</h1>
          <p className="text-slate-600 font-medium mt-3 text-lg max-w-2xl mx-auto">
            Your personal learning companion. Ask questions, analyze documents, and explore complex topics interactively.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_40px_rgba(31,38,135,0.06)] border border-white/80 p-6 md:p-8 relative overflow-hidden">
          <div className="h-[70vh] relative rounded-2xl overflow-hidden bg-white/50 border border-slate-100 shadow-inner">
            <Chatbot fullscreen onClose={() => navigate(-1)} />
          </div>
        </div>

      </div>
    </div>
  );
}
