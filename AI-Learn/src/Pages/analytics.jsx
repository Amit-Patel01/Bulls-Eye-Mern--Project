import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCurrentUser } from "../firebase";

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const user = getCurrentUser();
      const url = user ? `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/analytics?userId=${encodeURIComponent(user.uid)}` : `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/analytics`;
      const res = await axios.get(url);
      setAnalytics(res.data);
      setLoading(false);
    } catch (err) {
      console.log("Error fetching analytics", err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/50 via-slate-50 to-purple-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
           <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
           <div className="text-xl font-bold text-slate-700 animate-pulse">Loading Analytics Dashboard...</div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-slate-50 to-purple-50 flex items-center justify-center font-sans text-slate-800">
         <div className="bg-white/70 backdrop-blur-xl border border-white/80 p-12 rounded-3xl shadow-sm text-center">
            <span className="text-6xl mb-6 block">📈</span>
            <p className="text-slate-600 text-xl font-medium">No analytics data available yet.</p>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-slate-50 to-purple-50 p-6 md:p-12 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
        
        {/* Header Section */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 p-6 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 tracking-tight">Performance Analytics</h1>
          <p className="text-slate-500 font-medium mt-1">High-level insights into your learning progress.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.08)] transition-all flex flex-col items-center justify-center text-center group">
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-4 text-indigo-500 group-hover:scale-110 transition-transform">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider">Total Quizzes</h3>
            <p className="text-5xl font-black text-slate-800 mt-2">{analytics.totalTests}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.08)] transition-all flex flex-col items-center justify-center text-center group">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4 text-emerald-500 group-hover:scale-110 transition-transform">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
            </div>
            <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider">Average Score</h3>
            <p className="text-5xl font-black text-emerald-500 mt-2">{analytics.averageScore}%</p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.08)] transition-all flex flex-col items-center justify-center text-center group">
             <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-500 group-hover:scale-110 transition-transform">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
            </div>
            <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider">Best Score</h3>
            <p className="text-5xl font-black text-blue-500 mt-2">{analytics.bestScore}%</p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.08)] transition-all flex flex-col items-center justify-center text-center group">
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mb-4 text-rose-500 group-hover:scale-110 transition-transform">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
            </div>
            <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider">Worst Score</h3>
            <p className="text-5xl font-black text-rose-500 mt-2">{analytics.worstScore}%</p>
          </div>
        </div>

        {/* Results by File */}
        {Object.keys(analytics.resultsByFile).length > 0 && (
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_40px_rgba(31,38,135,0.05)] border border-white">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="text-indigo-500">📄</span> Performance by Material
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="py-4 px-4 font-bold text-slate-500 uppercase tracking-wider text-sm">Material</th>
                    <th className="py-4 px-4 font-bold text-slate-500 uppercase tracking-wider text-sm text-center">Tests Taken</th>
                    <th className="py-4 px-4 font-bold text-slate-500 uppercase tracking-wider text-sm text-center">Average Score</th>
                    <th className="py-4 px-4 font-bold text-slate-500 uppercase tracking-wider text-sm text-right">All Scores</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(analytics.resultsByFile).map(
                    ([filename, stats]) => (
                      <tr key={filename} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                        <td className="py-4 px-4 text-slate-800 font-bold group-hover:text-indigo-700">
                          {filename.split("-").slice(1).join("-")}
                        </td>
                        <td className="py-4 px-4 text-slate-600 font-semibold text-center">
                           <span className="bg-slate-100 px-3 py-1 rounded-full">{stats.count}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`font-black ${stats.average >= 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {stats.average}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-500 font-medium text-right">
                          {stats.scores.join("%, ")}%
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
