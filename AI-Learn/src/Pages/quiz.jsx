import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../firebase";

export default function GenerateQuiz() {
  const [materials, setMaterials] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/materials?userId=123`);
      setMaterials(res.data);
    } catch (err) {
      console.log("Error fetching materials");
    }
  };

  const handleGenerateQuiz = async () => {
    if (!selectedFile) {
      alert("Please select a study material first");
      return;
    }

    setErrorMessage(null);
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/generate-quiz`,
        { filename: selectedFile }
      );

      setQuestions(res.data);
      setScore(null);
      setSelectedAnswers({});
      setSubmitted(false);
    } catch (err) {
      console.log("Error generating quiz", err);
      let msg = err.response?.data?.message || err.message || "Failed to generate quiz. Please try again.";
      if (err.response?.data?.details) {
        msg += "\nDetails: " + err.response.data.details;
      }
      console.error(msg);
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (qIndex, option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [qIndex]: option,
    });
  };

  const handleSubmit = async () => {
    let totalScore = 0;

    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        totalScore++;
      }
    });

    setScore(totalScore);
    setSubmitted(true);

    try {
      const user = getCurrentUser();
      if (!user || !user.uid) return;
      await axios.post(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/save-result`, {
        userId: user.uid,
        filename: selectedFile,
        score: totalScore,
        totalQuestions: questions.length,
        answers: selectedAnswers,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.log("Error saving result", err);
    }
  };

  const handleRetry = () => {
    setSelectedFile("");
    setQuestions([]);
    setSelectedAnswers({});
    setScore(null);
    setSubmitted(false);
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-white to-purple-50 p-6 md:p-12 text-slate-800 font-sans">
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
          <header className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 drop-shadow-sm">
              AI Quiz Generator
            </h1>
            <p className="text-lg text-slate-600 font-light">
              Transform your documents into customized multiple-choice tests instantly.
            </p>
          </header>

          <div className="relative group/card cursor-default">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-2xl blur opacity-30 transition overflow-hidden"></div>
            <div className="relative bg-white/60 backdrop-blur-2xl border border-white/80 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] p-8 md:p-10 text-center flex flex-col items-center">
              
              {errorMessage && (
                <div className="w-full mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl whitespace-pre-wrap shadow-sm">
                  {errorMessage}
                </div>
              )}

              <div className="w-full mb-8 space-y-4 text-left">
                <label className="block text-indigo-800 font-bold text-sm uppercase tracking-wider">
                  Select a document to analyze
                </label>
                <div className="relative shadow-sm">
                  <select
                    value={selectedFile}
                    onChange={(e) => setSelectedFile(e.target.value)}
                    className="w-full p-4 bg-white/80 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 text-slate-800 transition-all appearance-none cursor-pointer drop-shadow-sm"
                  >
                    <option value="">-- Choose a material from library --</option>
                    {materials.map((item, index) => (
                      <option key={index} value={item.filename}>
                        📄 {item.originalName}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>

                {materials.length === 0 && (
                  <p className="text-rose-600 text-sm mt-3 flex items-center gap-2 font-medium bg-rose-50 p-3 rounded-lg border border-rose-100">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    Your library is empty. Please upload a material first.
                  </p>
                )}
              </div>

              <button
                onClick={handleGenerateQuiz}
                disabled={!selectedFile || loading}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg inline-flex justify-center items-center shadow-lg transition-all duration-300 border border-transparent ${
                  !selectedFile || loading
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-indigo-500/30 hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-indigo-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Analyzing & Generating...
                  </span>
                ) : (
                  <>
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    Generate AI Quiz
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-white to-purple-50 flex items-center justify-center p-6 md:p-12 text-slate-800 font-sans">
        <div className="bg-white/70 backdrop-blur-2xl border border-white/80 p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] max-w-md w-full text-center relative overflow-hidden animate-fade-in-up">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-200 rounded-full blur-3xl opacity-50"></div>
          
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 mb-2 relative z-10 drop-shadow-sm">
            {percentage >= 70 ? 'Amazing Job!' : 'Quiz Complete'}
          </h2>
          <p className="text-slate-600 mb-8 font-medium relative z-10">Here are your results</p>

          <div className="relative bg-white/90 border border-slate-200 p-8 rounded-2xl mb-10 overflow-hidden shadow-sm flex flex-col items-center">
            <div className="relative flex items-center justify-center w-36 h-36 rounded-full border-[12px] border-slate-100 shadow-[inset_0_4px_10px_rgba(0,0,0,0.05)] bg-white">
              <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r="54" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                <circle cx="50%" cy="50%" r="54" stroke="currentColor" strokeWidth="12" fill="transparent" 
                  strokeDasharray={`${(percentage / 100) * 339.292} 339.292`}
                  className={`${percentage >= 70 ? 'text-emerald-500' : 'text-amber-500'} transition-all duration-1000 ease-out drop-shadow-md`} strokeLinecap="round" />
              </svg>
              <div className="flex flex-col items-center">
                <p className={`text-4xl font-black ${percentage >= 70 ? 'text-emerald-500' : 'text-amber-500'} drop-shadow-sm`}>
                  {percentage}<span className="text-2xl">%</span>
                </p>
              </div>
            </div>
            
            <p className="mt-6 text-slate-600 text-lg font-medium tracking-wide">
              You scored <strong className="text-slate-900 text-xl font-black">{score}</strong> out of <strong className="text-slate-900 text-xl font-black">{questions.length}</strong>
            </p>
          </div>

          <div className="space-y-4 relative z-10 flex flex-col">
            <button
              onClick={() => navigate("/results")}
              className="w-full bg-white hover:bg-slate-50 text-slate-800 py-4 rounded-xl font-bold border border-slate-300 transition-colors shadow-sm"
            >
              View History
            </button>
            <button
              onClick={handleRetry}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-indigo-500/30 hover:-translate-y-0.5"
            >
              Take Another Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/50 via-slate-50 to-white p-4 md:p-8 text-slate-800 font-sans pb-24">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="sticky top-20 z-40 bg-white/70 backdrop-blur-xl border border-white shadow-lg shadow-indigo-100/50 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-2 truncate drop-shadow-sm" title={selectedFile}>
              {selectedFile.split("-").slice(1).join("-") || selectedFile} Quiz
            </h1>
            <div className="flex items-center gap-3 text-sm font-semibold">
              <span className="text-indigo-800 bg-indigo-100 px-3 py-1 rounded-md border border-indigo-200 shadow-sm">
                {questions.length} Questions
              </span>
              <span className={`${Object.keys(selectedAnswers).length === questions.length ? 'text-emerald-700 bg-emerald-100/50 border border-emerald-200' : 'text-slate-600 bg-slate-100/50 border border-slate-200'} px-3 py-1 rounded-md shadow-sm`}>
                {Object.keys(selectedAnswers).length} Answered
              </span>
            </div>
          </div>
          <div className="w-full md:w-64 bg-slate-200 rounded-full h-3 overflow-hidden self-center border border-slate-300 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
              style={{ width: `${(Object.keys(selectedAnswers).length / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-8">
          {questions.map((q, index) => (
            <div key={index} className="bg-white/60 backdrop-blur-xl border border-white/80 p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(31,38,135,0.08)] transition-all">
              <div className="flex items-start gap-4 mb-6">
                <span className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-black text-lg border border-indigo-200 shadow-sm">
                  {index + 1}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug pt-1 drop-shadow-sm">
                  {q.question}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {q.options.map((option, i) => {
                  const isSelected = selectedAnswers[index] === option;
                  return (
                    <label
                      key={i}
                      className={`relative flex items-center p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 group overflow-hidden bg-white/80 ${
                         isSelected
                          ? "border-indigo-500 shadow-md shadow-indigo-500/10"
                          : "border-slate-200 hover:border-slate-400 hover:shadow-sm"
                      }`}
                    >
                      {isSelected && <div className="absolute inset-0 bg-indigo-50/50"></div>}
                      
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        checked={isSelected}
                        onChange={() => handleOptionSelect(index, option)}
                        className="peer sr-only"
                      />
                      
                      <div className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors z-10 bg-white shadow-sm ${
                        isSelected ? "border-indigo-500" : "border-slate-300 group-hover:border-slate-400"
                      }`}>
                        {isSelected && <div className="w-3 h-3 rounded-full bg-indigo-500 scale-in-center"></div>}
                      </div>

                      <span className={`text-lg font-semibold relative z-10 transition-colors ${isSelected ? "text-indigo-900" : "text-slate-700"}`}>
                        {option}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Actions */}
        {questions.length > 0 && (
          <div className="mt-14 mb-8 flex flex-col md:flex-row gap-4 p-6 bg-white/70 backdrop-blur-xl border border-white shadow-xl rounded-2xl">
            <button
              onClick={handleRetry}
              className="flex-1 px-6 py-4 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors shadow-sm"
            >
              Start Over
            </button>

            <button
              onClick={handleSubmit}
              disabled={Object.keys(selectedAnswers).length < questions.length}
              className={`flex-[2] py-4 px-8 rounded-xl font-extrabold text-lg transition-all duration-300 shadow-md ${
                Object.keys(selectedAnswers).length < questions.length
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 hover:shadow-emerald-500/30 hover:-translate-y-0.5"
              }`}
            >
              {Object.keys(selectedAnswers).length < questions.length
                ? `Answer all ${questions.length} questions`
                : "Submit Quiz ✨"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}