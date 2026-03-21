import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MaterialUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/materials?userId=123`);
      setMaterials(res.data);
    } catch (err) {
      console.log("Error fetching materials", err);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file first.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", "123"); 

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/upload`, formData);
      setMessage("🎉 File uploaded successfully!");
      setMessageType("success");
      setFile(null);
      fetchMaterials();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("❌ Upload failed. " + (error.response?.data?.error || "Please try again."));
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/materials/${filename}`);
      setMaterials(materials.filter((m) => m.filename !== filename));
      setMessage("🗑️ Material deleted successfully!");
      setMessageType("success");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("❌ Failed to delete material.");
      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-white to-purple-50 p-6 md:p-12 text-slate-800 font-sans selection:bg-indigo-200">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up relative z-10">
        <header className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 drop-shadow-sm">
            Knowledge Hub
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-light">
            Upload your PDFs and let our AI transform your study material into interactive quizzes and summaries.
          </p>
        </header>

        {/* Upload Form */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-white/60 backdrop-blur-2xl border border-white/80 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] p-8 md:p-10">
            <form onSubmit={handleUpload} className="space-y-6">
              <div 
                onDragEnter={handleDrag} 
                onDragLeave={handleDrag} 
                onDragOver={handleDrag} 
                onDrop={handleDrop}
                className={`relative overflow-hidden border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ease-out cursor-pointer group/dropzone ${
                  dragActive 
                    ? "border-indigo-400 bg-indigo-50/80 scale-[1.02] shadow-inner" 
                    : file 
                      ? "border-emerald-400 bg-emerald-50/80 shadow-inner" 
                      : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50/50"
                }`}
              >
                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer flex flex-col items-center justify-center space-y-4">
                  <div className={`p-4 rounded-full transition-colors duration-300 shadow-sm ${file ? "bg-emerald-100 text-emerald-600" : "bg-indigo-100 text-indigo-600 group-hover/dropzone:bg-indigo-200"}`}>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  </div>
                  {file ? (
                    <div className="space-y-1">
                      <p className="text-xl font-medium text-emerald-700">{file.name}</p>
                      <p className="text-sm text-emerald-600/80">Ready to upload</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-xl font-medium text-slate-700"><span className="text-indigo-600 font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-sm text-slate-500">PDF or TXT documents (max. 10MB)</p>
                    </div>
                  )}
                </label>
              </div>

              <button
                type="submit"
                disabled={!file || loading}
                className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-semibold rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ${
                  !file || loading
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 hover:shadow-indigo-500/30 hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Material...
                  </span>
                ) : (
                  "Upload Material Insights"
                )}
              </button>
            </form>

            {message && (
              <div
                className={`mt-6 p-4 rounded-xl border flex items-center gap-3 animate-fade-in-up shadow-sm ${
                  messageType === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-rose-50 border-rose-200 text-rose-800"
                }`}
              >
                <span className="text-xl">{messageType === 'success' ? '✨' : '⚠️'}</span>
                <p className="font-medium">{message}</p>
              </div>
            )}
          </div>
        </div>

        {/* Materials List */}
        <div className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-2xl p-8 md:p-10 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)]">
          <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-800 to-purple-800 drop-shadow-sm">
              Your Library
            </h2>
            <span className="px-4 py-1.5 rounded-full bg-indigo-50 text-sm font-semibold text-indigo-700 border border-indigo-100 shadow-sm">
              {materials.length} files
            </span>
          </div>

          {materials.length === 0 ? (
            <div className="text-center py-16 bg-white/50 rounded-xl border border-dashed border-slate-300">
              <span className="text-5xl mb-4 block">📚</span>
              <p className="text-slate-600 text-lg font-medium">Your library is currently empty.</p>
              <p className="text-slate-500 text-sm mt-2">Upload your first document above to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((item, index) => (
                <div
                  key={item._id || index}
                  className="group bg-white/80 hover:bg-white border border-slate-200 rounded-xl p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600 shrink-0 border border-indigo-100 shadow-sm">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-semibold text-slate-800 truncate" title={item.originalName}>
                        {item.originalName}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 font-medium">
                        {new Date(item.uploadedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <a
                      href={`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/uploads/${item.filename}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold transition-colors border border-slate-200 shadow-sm"
                    >
                      View
                    </a>
                    <button
                      onClick={() => navigate("/quiz")}
                      className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-md shadow-indigo-500/20"
                    >
                      Quiz Me
                    </button>
                    <button
                      onClick={() => handleDelete(item.filename)}
                      className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors border border-rose-200 shadow-sm"
                      title="Delete material"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialUpload;