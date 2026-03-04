import { useNavigate } from "react-router-dom";
import { getCurrentUser, logOut } from "../firebase";

export default function Settings() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = async () => {
    await logOut();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No user logged in.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <p><strong>Name:</strong> {user.displayName || '(not set)'}</p>
        <p className="mt-2"><strong>Email:</strong> {user.email}</p>
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
