import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Chatbot from "../components/Chatbot";

export default function Home() {
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="bg-slate-50 text-slate-800 font-sans selection:bg-indigo-200">

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/60 via-slate-50 to-purple-50 overflow-hidden">
        {/* Decorative Floating Blobs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-[-50px] w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10 w-full">
          
          <div className="max-w-2xl text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white shadow-sm text-indigo-700 text-sm font-semibold mb-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
              AI-Powered Learning Platform
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-slate-900 drop-shadow-sm">
              Transform Study Material into{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">AI Quizzes</span>
            </h1>

            <p className="text-xl text-slate-600 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
              Upload your notes or PDFs and instantly generate smart, interactive multiple-choice tests using advanced Artificial Intelligence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <button
                onClick={() => navigate("/upload")}
                className="group relative inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-300 font-bold overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative flex items-center gap-2">
                  Get Started 🚀
                </span>
              </button>

              <button
                onClick={() => navigate("/upload")}
                className="inline-flex items-center justify-center bg-white/80 backdrop-blur-md border border-indigo-200 text-indigo-700 hover:bg-white hover:shadow-md hover:-translate-y-0.5 px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-sm"
              >
                Upload Material
              </button>

              <button
                onClick={() => setShowChat(true)}
                className="inline-flex items-center justify-center bg-slate-100/80 backdrop-blur-md border border-slate-200 text-slate-700 hover:bg-white hover:text-indigo-600 px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-sm"
              >
                Chat with AI 💬
              </button>
            </div>
          </div>

          <div className="w-full max-w-lg lg:max-w-xl relative">
             <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl blur-lg opacity-40"></div>
             <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="AI Illustration"
              className="relative w-full rounded-2xl shadow-2xl border border-white/50 object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </section>

      {/* CHAT SECTION */}
      {showChat && (
        <section className="bg-slate-50/80 backdrop-blur-3xl sticky inset-0 z-50">
           <Chatbot fullscreen onClose={() => setShowChat(false)} />
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="py-24 bg-white/40">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-4 text-slate-900 tracking-tight">How It Works</h2>
          <p className="text-lg text-slate-500 mb-16 max-w-2xl mx-auto font-medium">Three simple steps to supercharge your learning experience with AI.</p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-inner border border-indigo-50 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-800">1. Upload Material</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Upload your PDF or text notes securely to our private, intelligent storage platform.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-inner border border-purple-50 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-800">2. AI Generation</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Our Gemini 2.5 Flash AI automatically analyzes your document and creates highly relevant multiple-choice questions.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
               <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-inner border border-emerald-50 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-800">3. Take Test & Analyze</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Attempt the quiz dynamically and get instant evaluation with visual performance insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white/60">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-4 text-slate-900 tracking-tight">Key Features</h2>
          <p className="text-lg text-slate-500 mb-16 max-w-2xl mx-auto font-medium">Everything you need to study smarter, not harder.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {[
              { title: "AI Powered Generation", desc: "State of the art LLM pipeline for deep document understanding." },
              { title: "Real Time Quiz System", desc: "Interactive dashboards with dynamic progress tracking." },
              { title: "Auto Evaluation", desc: "Instant scoring and correct answer revealing." },
              { title: "Chat Assistant", desc: "Talk directly to your documents using the AI Tutor." },
              { title: "Performance Tracking", desc: "Visualize your history and improve over time." },
              { title: "Premium Aesthetic", desc: "Sleek, modern Light Glassmorphism UI." }
            ].map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-indigo-100 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4 text-indigo-600 font-bold">
                  {index + 1}
                </div>
                <h4 className="font-bold text-xl text-slate-800 mb-2">{feature.title}</h4>
                <p className="text-slate-500 font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}