import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, logOut } from "../firebase";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";

export default function ProfileSettings() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  // Profile state
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [changeEmailMode, setChangeEmailMode] = useState(false);

  const showNotification = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 4000);
  };

  // Update Profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (displayName !== user?.displayName) {
        await updateProfile(user, { displayName });
      }

      if (photoURL && photoURL !== user?.photoURL) {
        await updateProfile(user, { photoURL });
      }

      showNotification("✅ Profile updated successfully!", "success");
      setChangeEmailMode(false);
    } catch (error) {
      console.error("Update Error:", error);
      showNotification("❌ Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  // Update Email
  const handleUpdateEmail = async (e) => {
    e.preventDefault();

    if (!email || email === user?.email) {
      showNotification("Please enter a new email address", "error");
      return;
    }

    setLoading(true);
    try {
      await updateEmail(user, email);
      showNotification("✅ Email updated successfully!", "success");
      setChangeEmailMode(false);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        showNotification("❌ This email is already in use", "error");
      } else if (error.code === "auth/invalid-email") {
        showNotification("❌ Invalid email address", "error");
      } else {
        showNotification("❌ Failed to update email", "error");
      }
      console.error("Email Update Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update Password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      showNotification("Please fill in all password fields", "error");
      return;
    }

    if (newPassword.length < 6) {
      showNotification("New password must be at least 6 characters", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showNotification("Passwords do not match", "error");
      return;
    }

    setLoading(true);
    try {
      await updatePassword(user, newPassword);
      showNotification("✅ Password updated successfully!", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (error.code === "auth/weak-password") {
        showNotification("❌ Password is too weak", "error");
      } else {
        showNotification("❌ Failed to update password", "error");
      }
      console.error("Password Update Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        await user.delete();
        navigate("/");
      } catch (error) {
        showNotification("❌ Failed to delete account. Please re-authenticate.", "error");
      }
    }
  };

  // Sign Out
  const handleSignOut = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      showNotification("❌ Failed to sign out", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Profile & Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account and preferences</p>
        </div>

        {/* Notification */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border-l-4 ${
              messageType === "success"
                ? "bg-green-50 border-green-600 text-green-800"
                : "bg-red-50 border-red-600 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition font-semibold ${
                    activeTab === "profile"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  👤 Profile
                </button>

                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition font-semibold ${
                    activeTab === "security"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  🔒 Security
                </button>

                <button
                  onClick={() => setActiveTab("preferences")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition font-semibold ${
                    activeTab === "preferences"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  ⚙️ Preferences
                </button>

                <button
                  onClick={() => setActiveTab("account")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition font-semibold ${
                    activeTab === "account"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  🗑️ Account
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                <button
                  onClick={handleSignOut}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Profile Information
                </h2>

                {/* Profile Picture */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-6">
                    <img
                      src={
                        photoURL ||
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400"
                      }
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-indigo-600"
                    />
                    <div>
                      <p className="text-gray-600 text-sm mb-3">
                        Enter a profile picture URL to update your avatar
                      </p>
                      <input
                        type="url"
                        value={photoURL}
                        onChange={(e) => setPhotoURL(e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  {/* Display Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 transition"
                      placeholder="Your full name"
                    />
                  </div>

                  {/* Email - Read Only or Editable */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    {!changeEmailMode ? (
                      <div className="flex gap-3">
                        <input
                          type="email"
                          value={email}
                          disabled
                          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                        />
                        <button
                          type="button"
                          onClick={() => setChangeEmailMode(true)}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                        >
                          Change Email
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleUpdateEmail} className="space-y-3">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-indigo-600 rounded-lg focus:outline-none"
                        />
                        <div className="flex gap-3">
                          <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold disabled:bg-gray-400 transition"
                          >
                            {loading ? "Updating..." : "Update Email"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setChangeEmailMode(false);
                              setEmail(user?.email || "");
                            }}
                            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* User ID */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      User ID
                    </label>
                    <input
                      type="text"
                      value={user?.uid || ""}
                      disabled
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed font-mono text-sm"
                    />
                  </div>

                  {/* Account Created */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Account Created
                    </label>
                    <input
                      type="text"
                      value={user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : ""}
                      disabled
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {loading ? "Updating..." : "Save Profile Changes"}
                  </button>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Security Settings
                </h2>

                <form onSubmit={handleUpdatePassword} className="space-y-6">
                  {/* Current Password Info */}
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                    <p className="text-blue-800 text-sm">
                      ℹ️ For security reasons, you may need to re-authenticate before changing your password.
                    </p>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min. 6 characters)"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-500"
                      >
                        {showPassword ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                    {newPassword && (
                      <p className={`text-xs mt-1 ${newPassword.length >= 6 ? "text-green-600" : "text-red-600"}`}>
                        {newPassword.length >= 6 ? "✓ Strong password" : "✗ At least 6 characters"}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 transition"
                    />
                    {confirmPassword && (
                      <p className={`text-xs mt-1 ${newPassword === confirmPassword ? "text-green-600" : "text-red-600"}`}>
                        {newPassword === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </form>

                {/* Two-Factor Authentication (Coming Soon) */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    🔐 Two-Factor Authentication
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <button
                    disabled
                    className="bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Learning Preferences
                </h2>

                <div className="space-y-6">
                  {/* Theme */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      🎨 Theme
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="theme"
                          value="light"
                          defaultChecked
                          className="w-4 h-4"
                        />
                        <span className="text-gray-700">Light Mode</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="theme"
                          value="dark"
                          className="w-4 h-4"
                        />
                        <span className="text-gray-700">Dark Mode</span>
                      </label>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      🔔 Notifications
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-5 h-5" />
                        <span className="text-gray-700">Email notifications for quiz results</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-5 h-5" />
                        <span className="text-gray-700">Weekly progress summary</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5" />
                        <span className="text-gray-700">Promotional emails</span>
                      </label>
                    </div>
                  </div>

                  {/* Difficulty Level */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      📊 Preferred Difficulty Level
                    </label>
                    <select className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600">
                      <option>Easy</option>
                      <option selected>Medium</option>
                      <option>Hard</option>
                      <option>Mixed</option>
                    </select>
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      🌐 Language
                    </label>
                    <select className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600">
                      <option selected>English</option>
                      <option>Urdu</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>

                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition">
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === "account" && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Account Management
                </h2>

                {/* Export Data */}
                <div className="mb-8 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    📥 Download Your Data
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Export all your quiz results and account information
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition">
                    Download Data
                  </button>
                </div>

                {/* Danger Zone */}
                <div className="p-6 bg-red-50 rounded-lg border-l-4 border-red-600">
                  <h3 className="text-lg font-bold text-red-800 mb-2">
                    ⚠️ Danger Zone
                  </h3>
                  <p className="text-red-700 mb-4">
                    Deleting your account is permanent and cannot be undone. All your data will be lost.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
