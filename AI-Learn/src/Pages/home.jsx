import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-white text-gray-800">

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center justify-between gap-10">
          
          <div className="max-w-xl text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
              Transform Study Material into{" "}
              <span className="text-indigo-600">AI-Powered Quizzes</span>
            </h1>

            <p className="mt-6 text-lg text-gray-600">
              Upload your notes or PDFs and instantly generate smart MCQs using Artificial Intelligence.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate("/upload")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md transition"
              >
                Get Started 🚀
              </button>

              <button
                onClick={() => navigate("/upload")}
                className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-lg transition"
              >
                Upload Material
              </button>
            </div>
          </div>

          <div className="w-full max-w-md">
            <img
              src="https://illustrations.popsy.co/gray/artificial-intelligence.svg"
              alt="AI Illustration"
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl shadow-md border hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Upload Material</h3>
              <p className="text-gray-600">
                Upload your PDF or text notes securely to the platform.
              </p>
            </div>

            <div className="p-6 rounded-2xl shadow-md border hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">AI Generates MCQs</h3>
              <p className="text-gray-600">
                Our AI automatically creates multiple choice questions.
              </p>
            </div>

            <div className="p-6 rounded-2xl shadow-md border hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Take Test & Analyze</h3>
              <p className="text-gray-600">
                Attempt quiz and get instant evaluation with performance insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">Key Features</h2>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              "AI Powered Question Generation",
              "Real Time Quiz System",
              "Auto Evaluation & Scoring",
              "Secure JWT Authentication",
              "Performance Tracking",
              "Smart Learning Experience"
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition"
              >
                <p className="font-medium text-gray-700">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 bg-indigo-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">
            Start Smart Learning Today 🚀
          </h2>

          <button
            onClick={() => navigate("/register")}
            className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-gray-200 transition"
          >
            Create Free Account
          </button>
        </div>
      </section>

    </div>
  );
}