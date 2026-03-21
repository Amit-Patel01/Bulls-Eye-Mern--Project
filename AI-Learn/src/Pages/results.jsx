import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../firebase";

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const user = getCurrentUser();
      const url = user ? `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/results?userId=${encodeURIComponent(user.uid)}` : `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/results`;
      const res = await axios.get(url);
      setResults(res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      setLoading(false);
    } catch (err) {
      console.log("Error fetching results", err);
      setLoading(false);
    }
  };

  const handleDeleteResult = async (id) => {
    if (!window.confirm("Are you sure you want to delete this result?")) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/results/${id}`);
      setResults(results.filter((r) => r.id !== id));
      setSelectedResult(null);
    } catch (err) {
      console.log("Error deleting result");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/50 via-slate-50 to-purple-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
           <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
           <div className="text-xl font-bold text-slate-700 animate-pulse">Loading Results Analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-slate-50 to-purple-50 p-6 md:p-12 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/60 backdrop-blur-xl border border-white/80 p-6 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 tracking-tight">Quiz Results</h1>
            <p className="text-slate-500 font-medium mt-1">Track your performance intelligence</p>
          </div>
          <button
            onClick={() => navigate("/quiz")}
            className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-md shadow-indigo-500/20 hover:-translate-y-0.5 transition-all"
          >
            Take Another Quiz
          </button>
        </div>

        {results.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-xl border border-white/80 p-12 rounded-3xl shadow-sm text-center">
            <span className="text-6xl mb-6 block">📊</span>
            <p className="text-slate-600 text-xl font-medium mb-6">
              You haven't completed any quizzes yet.<br/>Start testing your knowledge to generate analytics!
            </p>
            <button
              onClick={() => navigate("/quiz")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold shadow-md hover:shadow-indigo-500/20 transition-all"
            >
              Start Your First Quiz
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Results Sidebar List */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/80 overflow-hidden flex flex-col h-[600px]">
                <div className="p-6 bg-slate-50/50 border-b border-slate-100/80">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center justify-between">
                    History <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">{results.length} Entries</span>
                  </h2>
                </div>

                <div className="overflow-y-auto flex-1 p-2 space-y-2">
                  {results.map((result) => (
                    <div
                      key={result.id}
                      onClick={() => setSelectedResult(result)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 group relative overflow-hidden ${
                        selectedResult?.id === result.id
                          ? "bg-indigo-50/80 border-indigo-200 shadow-sm"
                          : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
                      }`}
                    >
                      {selectedResult?.id === result.id && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                      )}
                      <p className={`font-bold truncate text-[15px] mb-1 ${selectedResult?.id === result.id ? "text-indigo-900" : "text-slate-800 group-hover:text-indigo-700"}`}>
                        {result.filename ? result.filename.split("-").slice(1).join("-") : "Unknown Document"}
                      </p>
                      <div className="flex justify-between items-end">
                        <p className="text-xs font-medium text-slate-400">
                          {new Date(result.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className={`text-lg font-black ${selectedResult?.id === result.id ? "text-indigo-600" : "text-slate-600"}`}>
                          {result.percentage}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Result Details Main Pane */}
            <div className="lg:col-span-8">
              {selectedResult ? (
                <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-[0_8px_40px_rgba(31,38,135,0.05)] border border-white h-full animate-fade-in">
                  
                  {/* Header info */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10 pb-6 border-b border-slate-100">
                    <div>
                      <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-tight mb-2">
                        {selectedResult.filename ? selectedResult.filename.split("-").slice(1).join("-") : "Unknown Document"}
                      </h2>
                      <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {new Date(selectedResult.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short'})}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteResult(selectedResult.id)}
                      className="bg-white text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center gap-2 shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      Delete Entry
                    </button>
                  </div>

                  {/* Score Highlights Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    
                    {/* Primary Score */}
                    <div className="col-span-2 lg:col-span-2 bg-gradient-to-br from-indigo-50 to-blue-50/50 p-6 rounded-2xl border border-indigo-100 shadow-sm flex items-center justify-between overflow-hidden relative">
                       <div className="absolute right-0 -bottom-6 w-32 h-32 bg-indigo-200/50 rounded-full blur-2xl"></div>
                       <div>
                        <p className="text-indigo-800/60 font-bold text-sm uppercase tracking-wider mb-1">Final Score</p>
                        <p className="text-5xl font-black text-indigo-700 tracking-tight">
                          {selectedResult.score}<span className="text-3xl text-indigo-400 font-bold mx-1">/</span><span className="text-3xl text-indigo-400 font-bold">{selectedResult.totalQuestions}</span>
                        </p>
                       </div>
                       <div className="text-right z-10">
                          <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                            {selectedResult.percentage}%
                          </p>
                       </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-center">
                      <p className="text-emerald-700 font-bold text-sm uppercase tracking-wider mb-1">Correct</p>
                      <p className="text-3xl font-black text-emerald-600">
                        {selectedResult.score}
                      </p>
                    </div>

                    <div className="bg-rose-50/80 p-5 rounded-2xl border border-rose-100 shadow-sm flex flex-col justify-center">
                      <p className="text-rose-700 font-bold text-sm uppercase tracking-wider mb-1">Incorrect</p>
                      <p className="text-3xl font-black text-rose-600">
                        {selectedResult.totalQuestions - selectedResult.score}
                      </p>
                    </div>
                  </div>

                  {/* Answers review logic could go here in a sleek list */}
                  {selectedResult.answers && (
                    <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-2xl">
                      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                        Selected Answers Log
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(selectedResult.answers).map(
                          ([qIndex, answer]) => (
                            <div
                              key={qIndex}
                              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4"
                            >
                              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-sm">
                                Q{parseInt(qIndex) + 1}
                              </div>
                              <div className="pt-1.5 overflow-hidden">
                                <p className="font-semibold text-slate-700 break-words">
                                  {answer}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white/40 backdrop-blur-md border border-white/50 p-8 rounded-3xl h-full flex flex-col items-center justify-center text-center shadow-inner min-h-[500px]">
                  <div className="w-24 h-24 bg-indigo-50/80 rounded-full flex items-center justify-center mb-6 border border-indigo-100 shadow-sm">
                    <svg className="w-10 h-10 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">Select an entry</h3>
                  <p className="text-slate-500 font-medium">Click on a previous quiz from the left column to reveal detailed analytics and answer logs.</p>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
