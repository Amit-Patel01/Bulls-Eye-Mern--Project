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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans tracking-tight">
        <p className="text-slate-500 font-semibold bg-white p-6 rounded-2xl shadow-sm border border-slate-200">No user is currently logged in.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-slate-50 to-purple-50 p-6 md:p-12 font-sans tracking-tight flex justify-center items-start pt-20">
      
      <div className="max-w-md w-full bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_40px_rgba(31,38,135,0.06)] border border-white/80 p-10 animate-fade-in-up">
        
        <div className="text-center mb-8">
           <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center text-4xl shadow-inner border border-indigo-200 mb-4 overflow-hidden">
               {user.photoURL ? (
                  <img src={user.photoURL} alt="User Profile" className="w-full h-full object-cover" />
               ) : (
                  <span className="text-indigo-400 font-bold uppercase">{user.email?.charAt(0) || 'U'}</span>
               )}
           </div>
           <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700">Account Profile</h2>
        </div>

        <div className="space-y-6 bg-white/50 p-6 rounded-2xl border border-slate-100 shadow-sm mb-8">
            <div>
              <p className="text-indigo-800/60 font-bold text-[10px] uppercase tracking-wider mb-1">Display Name</p>
              <p className="text-lg font-bold text-slate-800">{user.displayName || '(Not set)'}</p>
            </div>
            
            <div className="h-px w-full bg-slate-200"></div>

            <div>
              <p className="text-indigo-800/60 font-bold text-[10px] uppercase tracking-wider mb-1">Email Address</p>
              <p className="text-lg font-bold text-slate-800">{user.email}</p>
            </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-4 rounded-xl border border-rose-200 transition-colors shadow-sm flex justify-center items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Secure Log Out
        </button>
      </div>

    </div>
  );
}
