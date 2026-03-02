import React from "react"
import { useNavigate } from "react-router-dom"

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
        
        {/* LEFT CONTENT */}
        <div className="max-w-xl text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
            Convert Notes into 
            <span className="text-indigo-600"> AI Generated Quizzes</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Upload your study material and let AI generate smart MCQs.
            Practice, analyze and improve your learning instantly.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={() => navigate("/upload")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md transition"
            >
              Get Started 🚀
            </button>

            <button
              onClick={() => navigate("/quiz")}
              className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-lg transition"
            >
              Try Demo Quiz
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="w-full max-w-md">
          <img
            src="https://illustrations.popsy.co/gray/artificial-intelligence.svg"
            alt="AI Illustration"
            className="w-full"
          />
        </div>
      </div>
    </section>
  )
}