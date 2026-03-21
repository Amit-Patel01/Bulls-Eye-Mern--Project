import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../firebase";
import logo from "../assets/logo.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email address");
      setMessageType("error");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await resetPassword(email);
      setSubmitted(true);
      setMessageType("success");
      setMessage("✅ Password reset email sent! Check your inbox.");
    } catch (error) {
      setMessageType("error");
      if (error.code === "auth/user-not-found") {
        setMessage("❌ No account found with this email address");
      } else if (error.code === "auth/invalid-email") {
        setMessage("❌ Invalid email address");
      } else {
        setMessage("❌ Failed to send reset email. Please try again.");
      }
      console.error("Reset Password Error:", error);
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
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 tracking-tight">Recovery</h1>
          <p className="text-slate-600 font-medium mt-3 text-lg">Regain access to your intelligent study hub</p>
        </div>

        {/* Reset Card */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_40px_rgba(31,38,135,0.06)] p-8 border border-white/80 relative overflow-hidden">
          {!submitted ? (
            <>
              <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">Reset Password</h2>

              {/* Message */}
              {message && (
                <div
                  className={`mb-8 p-4 rounded-xl border font-medium shadow-sm animate-shake ${
                    messageType === "error"
                      ? "bg-rose-50 border-rose-200 text-rose-700"
                      : "bg-emerald-50 border-emerald-200 text-emerald-700"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Reset Form */}
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-[11px] uppercase tracking-wider font-extrabold text-slate-500 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                     <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                     </span>
                     <input
                       id="email"
                       type="email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       placeholder="you@example.com"
                       className="w-full pl-11 pr-4 py-3.5 bg-white/80 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-800 font-medium transition-all shadow-sm"
                       disabled={loading}
                     />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 shadow-md ${
                    loading
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:scale-[0.98]"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-indigo-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Sending Direct Link...
                    </span>
                  ) : "Send Reset Protocol"}
                </button>
              </form>

              {/* Back to Login */}
              <div className="mt-8 text-center border-t border-slate-100 pt-6">
                <p className="text-slate-500 text-sm font-medium">
                  Remembered your credentials?{" "}
                  <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition-colors">
                    Back to Login
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Success Screen */}
              <div className="text-center animate-scale-in">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full mb-6 border-4 border-emerald-100 shadow-sm">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                  </svg>
                </div>

                <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Check Inbox</h2>
                <p className="text-slate-500 font-medium mb-6">
                  Reset instructions have been dispatched to<br/>
                  <strong className="text-slate-800 font-bold mt-1 block">{email}</strong>
                </p>

                <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 text-left mb-8 shadow-sm">
                  <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-3">Next Action Required</p>
                  <ul className="text-slate-700 text-sm font-medium space-y-3">
                     <li className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">1.</span> Click the secure link in the email
                     </li>
                     <li className="flex items-start gap-2">
                        <span className="text-indigo-500 font-bold">2.</span> Define a new, strong password
                     </li>
                     <li className="flex items-start gap-2">
                        <span className="text-purple-500 font-bold">3.</span> Return here to authenticate
                     </li>
                  </ul>
                </div>

                <Link
                  to="/login"
                  className="block w-full bg-slate-800 hover:bg-slate-900 text-white py-4 rounded-xl font-bold text-center transition-all shadow-md hover:shadow-slate-800/20 mb-3"
                >
                  Return to Sign In
                </Link>

                <button
                  onClick={() => {
                    setEmail("");
                    setSubmitted(false);
                    setMessage("");
                  }}
                  className="w-full bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 py-4 rounded-xl font-bold transition-all shadow-sm"
                >
                  Reset Different Account
                </button>
                
                <p className="text-xs text-slate-400 mt-6 font-medium">Link expires in 1 hour for security compliance.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
