import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../firebase";

export default function Test() {
  const [materials, setMaterials] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/materials`);
      setMaterials(res.data);
    } catch (err) {
      console.log("Error fetching materials");
    }
  };

  const handleGenerateTest = async () => {
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
      setCurrentQuestion(0);
    } catch (err) {
      console.log("Error generating test", err);
      let msg = err.response?.data?.message || err.message || "Failed to generate test. Please try again.";
      if (err.response?.data?.details) {
        msg += "\nDetails: " + err.response.data.details;
      }
      if (err.response?.data?.raw) {
        msg += "\nRaw response: " + err.response.data.raw;
      }
      console.error(msg);
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: option,
    });
  };

  const handleSubmit = async () => {
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setSubmitted(true);

    try {
      const user = getCurrentUser();
      if (!user || !user.uid) {
        // Just show results, not saved
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/save-result`, {
          userId: user.uid,
          filename: selectedFile,
          score: correctCount,
          totalQuestions: questions.length,
          answers: selectedAnswers,
          timestamp: new Date().toISOString(),
        });
        setTimeout(() => navigate("/results"), 3000);
      }
    } catch (err) {
      console.log("Error saving result", err);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRetry = () => {
    setSelectedFile("");
    setQuestions([]);
    setSelectedAnswers({});
    setScore(null);
    setSubmitted(false);
    setCurrentQuestion(0);
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/50 via-slate-50 to-purple-50 p-6 md:p-12 text-slate-800 font-sans">
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
          <header className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 drop-shadow-sm">
              Focus Test Mode
            </h1>
            <p className="text-lg text-slate-600 font-light max-w-xl mx-auto">
              Simulate a real testing environment. Questions are presented one by one to test your pure knowledge retention.
            </p>
          </header>

          <div className="relative group/card cursor-default mt-10">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-2xl blur opacity-30 transition overflow-hidden"></div>
            <div className="relative bg-white/60 backdrop-blur-2xl border border-white/80 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] p-8 md:p-10 text-center flex flex-col items-center">
              
              {errorMessage && (
                <div className="w-full mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl whitespace-pre-wrap shadow-sm">
                  {errorMessage}
                </div>
              )}

              <div className="w-full mb-8 space-y-4 text-left">
                <label className="block text-indigo-800 font-bold text-sm uppercase tracking-wider">
                  Select a document to test yourself on
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
                        📄 {item.filename.split("-").slice(1).join("-") || item.filename}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>

                {materials.length === 0 && (
                  <p className="text-rose-600 text-sm mt-3 flex items-center gap-2 font-medium bg-rose-50 p-3 rounded-lg border border-rose-100">
                    Your library is empty. Please upload a material first.
                  </p>
                )}
              </div>

              <button
                onClick={handleGenerateTest}
                disabled={!selectedFile || loading}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg inline-flex justify-center items-center shadow-lg transition-all duration-300 border border-transparent ${
                  !selectedFile || loading
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-500/30 hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-indigo-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Preparing Test...
                  </span>
                ) : (
                  <>Begin Test Session 🎯</>
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
      <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/50 via-slate-50 to-teal-50 flex items-center justify-center p-6 md:p-12 text-slate-800 font-sans">
        <div className="bg-white/70 backdrop-blur-2xl border border-white/80 p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] max-w-md w-full text-center relative overflow-hidden animate-fade-in-up">
          
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mb-2 relative z-10 drop-shadow-sm">
            Test Complete
          </h2>
          <p className="text-slate-600 mb-8 font-medium">Evaluation finalized</p>

          <div className="relative bg-white/90 border border-slate-200 p-8 rounded-2xl mb-8 shadow-sm flex flex-col items-center">
             <div className="relative flex items-center justify-center w-36 h-36 rounded-full border-[12px] border-slate-100 shadow-[inset_0_4px_10px_rgba(0,0,0,0.05)] bg-white mb-6">
              <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r="54" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                <circle cx="50%" cy="50%" r="54" stroke="currentColor" strokeWidth="12" fill="transparent" 
                  strokeDasharray={`${(percentage / 100) * 339.292} 339.292`}
                  className={`${percentage >= 70 ? 'text-emerald-500' : 'text-amber-500'} transition-all duration-1000 ease-out`} strokeLinecap="round" />
              </svg>
              <div className="flex flex-col items-center">
                <p className={`text-4xl font-black ${percentage >= 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {percentage}<span className="text-2xl">%</span>
                </p>
              </div>
            </div>
            
            <p className="text-slate-600 text-lg font-medium">
              You scored <strong className="text-slate-900 text-xl">{score}</strong> out of <strong className="text-slate-900 text-xl">{questions.length}</strong>
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate("/results")}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-xl font-bold border border-slate-300 transition-colors shadow-sm"
            >
              View Detailed Analytics
            </button>
            <button
              onClick={handleRetry}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-indigo-500/30 hover:-translate-y-0.5"
            >
              Take Another Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-slate-50 to-purple-50 p-6 md:p-12 text-slate-800 font-sans pb-24">
      <div className="max-w-4xl mx-auto animate-fade-in-up">
        
        {/* Header / Progress Card */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700">Test Session</h1>
            <p className="text-slate-500 text-sm font-semibold mt-1">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>

          <div className="w-full md:w-64">
            <div className="bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner border border-slate-300/50">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
              ></div>
            </div>
            <p className="text-right text-xs font-bold text-indigo-600 mt-2">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Completed
            </p>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-[0_8px_40px_rgba(31,38,135,0.06)] p-8 md:p-12 mb-8 min-h-[350px] flex flex-col">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 leading-snug drop-shadow-sm flex-1">
            <span className="text-indigo-400 mr-2">Q.</span>{currentQ.question}
          </h2>

          <div className="space-y-4">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion] === option;
              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 group flex items-center ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-50/50 shadow-md shadow-indigo-500/10"
                      : "border-slate-200 bg-white/50 hover:border-indigo-300 hover:bg-white"
                  }`}
                >
                  <div className={`shrink-0 w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${
                    isSelected ? "border-indigo-600 bg-white" : "border-slate-300 bg-white group-hover:border-indigo-300"
                  }`}>
                    {isSelected && <div className="w-3 h-3 bg-indigo-600 rounded-full scale-in-center"></div>}
                  </div>
                  <span className={`text-lg font-semibold transition-colors ${isSelected ? "text-indigo-900" : "text-slate-700 group-hover:text-slate-900"}`}>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/50 backdrop-blur-md border border-white/50 p-4 rounded-2xl shadow-sm">
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestion === 0}
            className={`px-8 py-3.5 rounded-xl font-bold transition-colors w-full sm:w-auto ${
              currentQuestion === 0
                ? "bg-slate-200 text-slate-400 cursor-not-allowed hidden sm:block opacity-0 pointer-events-none"
                : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-sm"
            }`}
          >
            ← Previous
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(selectedAnswers).length < questions.length}
              className={`px-10 py-3.5 rounded-xl font-extrabold text-white transition-all w-full sm:w-auto shadow-md ${
                Object.keys(selectedAnswers).length < questions.length
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-emerald-500/30 hover:-translate-y-0.5"
              }`}
            >
              Submit Result ✨
            </button>
          ) : (
            <button
              onClick={goToNextQuestion}
              className="px-8 py-3.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md hover:shadow-indigo-500/20 w-full sm:w-auto hover:-translate-y-0.5"
            >
              Next Info →
            </button>
          )}
        </div>

        {/* Question Answer Summary Strip */}
        <div className="mt-8 flex justify-center">
          <div className="flex flex-wrap justify-center gap-2 p-3 bg-white/60 backdrop-blur-md rounded-2xl border border-white shadow-sm inline-flex">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-9 h-9 rounded-lg font-bold text-sm transition-all focus:outline-none ${
                  currentQuestion === index
                    ? "bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300 ring-offset-1"
                    : selectedAnswers[index]
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
