import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle, setCurrentUser } from "../firebase";
import logo from "../assets/logo.png";

export default function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithGoogle();
      if (result && result.user) {
        setCurrentUser(result.user);
        if (onLogin) onLogin(result.user);
        navigate("/");
      }
    } catch (err) {
      console.error("Google Sign-in Error:", err);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/50 via-slate-50 to-purple-50 flex items-center justify-center p-6 font-sans">
      
      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-28 h-28 mb-4 transform hover:scale-105 transition-all duration-300">
            <img src={logo} alt="AI-Learn Logo" className="w-full h-full object-contain drop-shadow-md" />
          </div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 tracking-tight">AI-Learn</h1>
          <p className="text-slate-600 font-medium mt-3 text-lg">Your intelligent study companion</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_40px_rgba(31,38,135,0.06)] p-8 border border-white/80 relative overflow-hidden text-center">
            
            <h2 className="text-2xl font-bold text-slate-800 mb-8">Welcome Back</h2>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium shadow-sm animate-shake">
              <p>⚠️ {error}</p>
            </div>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            type="button"
            className={`w-full flex justify-center items-center py-4 px-6 rounded-xl border-2 font-bold transition-all duration-300 shadow-sm ${
              loading
                ? "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed shadow-none"
                : "border-slate-200 text-slate-700 hover:border-indigo-500 hover:bg-indigo-50/50 hover:text-indigo-700 hover:shadow-indigo-500/10 active:scale-[0.98]"
            }`}
          >
            <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {loading ? "Authenticating..." : "Continue with Google"}
          </button>

          {/* Terms */}
          <p className="text-center text-[11px] font-semibold text-slate-400 mt-6 max-w-xs mx-auto">
            By securely signing in, you agree to our <span className="text-slate-500 cursor-pointer hover:underline">Terms of Service</span> and <span className="text-slate-500 cursor-pointer hover:underline">Privacy Policy</span>.
          </p>
        </div>

        {/* Features Preview */}
        <div className="mt-10 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 border border-white/50 shadow-sm transition-transform hover:-translate-y-1">
            <div className="text-3xl mb-2 drop-shadow-sm">📚</div>
            <p className="text-xs text-slate-700 font-bold">Smart Upload</p>
          </div>
          <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 border border-white/50 shadow-sm transition-transform hover:-translate-y-1">
            <div className="text-3xl mb-2 drop-shadow-sm">🤖</div>
            <p className="text-xs text-slate-700 font-bold">AI Generation</p>
          </div>
          <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 border border-white/50 shadow-sm transition-transform hover:-translate-y-1">
            <div className="text-3xl mb-2 drop-shadow-sm">📊</div>
            <p className="text-xs text-slate-700 font-bold">Analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
}
