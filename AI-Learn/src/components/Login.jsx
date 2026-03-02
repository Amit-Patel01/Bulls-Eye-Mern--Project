import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithGoogle, signInWithEmail } from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (error) {
      setError("Failed to sign in with Google. Please try again.");
      console.error("Google Sign-in Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await signInWithEmail(email, password);
      navigate("/");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setError("No account found with this email. Please sign up first.");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else {
        setError("Failed to sign in. Please try again.");
      }
      console.error("Sign-in Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-indigo-600 text-white rounded-full p-3 mb-4">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 7H7v6h6V7z" />
              <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2V2a1 1 0 112 0v1h1a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2h1a2 2 0 01-2 2h-1v1a1 1 0 11-2 0v-1h-2v1a1 1 0 11-2 0v-1H7a2 2 0 01-2-2v-1H4a1 1 0 110-2h1V9H4a1 1 0 010-2h1V5a2 2 0 012-2h1V2z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800">AI-Learn</h1>
          <p className="text-gray-600 mt-2">Transform your study materials into smart quizzes</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-indigo-600">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 rounded">
              <p className="text-red-700 font-semibold">⚠️ {error}</p>
            </div>
          )}

          {/* Email Sign In Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4 mb-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                📧 Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 transition"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                🔒 Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 transition"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-lg font-semibold text-white transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
              }`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="text-center mb-6">
            <Link to="/forgot-password" className="text-indigo-600 font-semibold hover:text-indigo-700 underline text-sm">
              Forgot your password?
            </Link>
          </div>
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-600 font-semibold">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            type="button"
            className={`w-full flex justify-center items-center py-2.5 px-4 rounded-lg border-2 font-semibold transition ${
              loading
                ? "border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed"
                : "border-gray-300 text-gray-700 hover:border-indigo-600 hover:bg-indigo-50 active:scale-95"
            }`}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {loading ? "Signing In..." : "Google"}
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 font-semibold hover:text-indigo-700 underline">
              Sign up here
            </Link>
          </p>

          {/* Terms */}
          <p className="text-center text-xs text-gray-500 mt-4">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="text-center">
            <div className="text-3xl mb-2">📚</div>
            <p className="text-sm text-gray-600 font-semibold">Upload Materials</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🤖</div>
            <p className="text-sm text-gray-600 font-semibold">AI Quizzes</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">📊</div>
            <p className="text-sm text-gray-600 font-semibold">Analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
}
