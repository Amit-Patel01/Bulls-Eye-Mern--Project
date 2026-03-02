import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../firebase";

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
          <h1 className="text-4xl font-bold text-gray-800">Reset Password</h1>
          <p className="text-gray-600 mt-2">We'll send you an email to reset your password</p>
        </div>

        {/* Reset Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-indigo-600">
          {!submitted ? (
            <>
              {/* Message */}
              {message && (
                <div
                  className={`mb-6 p-4 rounded-lg border-l-4 ${
                    messageType === "error"
                      ? "bg-red-50 border-red-600 text-red-800"
                      : "bg-green-50 border-green-600 text-green-800"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Reset Form */}
              <form onSubmit={handleResetPassword} className="space-y-6">
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 transition"
                    disabled={loading}
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Enter the email address associated with your AI-Learn account
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
                  }`}
                >
                  {loading ? "Sending Reset Email..." : "Send Reset Email"}
                </button>
              </form>

              {/* Help Text */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                <p className="text-blue-800 text-sm">
                  <strong>💡 Tip:</strong> Check your spam or junk folder if you don't see the reset email
                </p>
              </div>

              {/* Back to Login */}
              <p className="text-center text-gray-600 mt-6">
                Remember your password?{" "}
                <Link to="/" className="text-indigo-600 font-semibold hover:text-indigo-700 underline">
                  Sign in here
                </Link>
              </p>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="text-center">
                <div className="inline-block bg-green-100 text-green-600 rounded-full p-4 mb-6">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-3">Check Your Email!</h2>
                <p className="text-gray-600 mb-2">
                  We've sent a password reset link to
                </p>
                <p className="text-lg font-semibold text-indigo-600 mb-6">{email}</p>

                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600 mb-6 text-left">
                  <p className="text-blue-800 text-sm mb-3">
                    <strong>Next steps:</strong>
                  </p>
                  <ul className="text-blue-800 text-sm space-y-2">
                    <li>✅ Click the link in the email</li>
                    <li>✅ Create a new password</li>
                    <li>✅ Sign in with your new password</li>
                  </ul>
                </div>

                <p className="text-gray-600 text-sm mb-6">
                  The reset link will expire in 1 hour for security reasons
                </p>

                <button
                  onClick={() => {
                    setEmail("");
                    setSubmitted(false);
                    setMessage("");
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition mb-3"
                >
                  Reset Another Account
                </button>

                <Link
                  to="/"
                  className="block w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold text-center transition"
                >
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>

        {/* FAQs */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-gray-800 text-sm mb-1">❓ How long is the reset link valid?</p>
              <p className="text-gray-600 text-sm">The reset link is valid for 1 hour. After that, you'll need to request a new one.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm mb-1">❓ I didn't receive an email</p>
              <p className="text-gray-600 text-sm">Check your spam folder. If it's not there, make sure you entered the correct email address.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm mb-1">❓ Can I use the same password?</p>
              <p className="text-gray-600 text-sm">No, for security reasons you must create a new password different from your previous ones.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
