export default function Footer() {
  return (
    <footer className="bg-white/40 backdrop-blur-xl border-t border-white/60 text-slate-500 relative z-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
        
        {/* Logo + About */}
        <div>
          <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 mb-4 tracking-tight">
            AI-Learn Hub
          </h3>
          <p className="text-sm font-medium leading-relaxed max-w-xs">
            A premium, intelligent learning environment powered by cutting-edge Gemini AI infrastructure. Transform materials into knowledge instantly.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-slate-800 font-bold mb-4 uppercase text-xs tracking-widest">Platform Links</h4>
          <ul className="space-y-3 text-sm font-medium">
            <li><a href="/" className="hover:text-indigo-600 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-400 rounded-full opacity-0 hover:opacity-100 transition-opacity"></span>Dashboard</a></li>
            <li><a href="/upload" className="hover:text-indigo-600 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-400 rounded-full opacity-0 hover:opacity-100 transition-opacity"></span>Knowledge Base</a></li>
            <li><a href="/quiz" className="hover:text-indigo-600 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-400 rounded-full opacity-0 hover:opacity-100 transition-opacity"></span>Generate Quizzes</a></li>
            <li><a href="/analytics" className="hover:text-indigo-600 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-400 rounded-full opacity-0 hover:opacity-100 transition-opacity"></span>Performance Stats</a></li>
          </ul>
        </div>

        {/* Status / Contact */}
        <div>
          <h4 className="text-slate-800 font-bold mb-4 uppercase text-xs tracking-widest">System Status</h4>
          <div className="flex items-center gap-2 text-sm font-medium">
             <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></span>
             <span className="text-emerald-600">All Systems Operational</span>
          </div>
          <p className="text-sm mt-4">Built with React & Node.js</p>
        </div>
      </div>

      <div className="border-t border-slate-200/60 bg-white/30 text-center py-6 text-xs font-semibold">
        © {new Date().getFullYear()} AI-Learn Platform. Engineered for Excellence.
      </div>
    </footer>
  );
}