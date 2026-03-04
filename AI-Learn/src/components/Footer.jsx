import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
        
        {/* Logo + About */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">
            AI Learning
          </h3>
          <p className="text-sm">
            Smart AI-based quiz generation platform built with MERN stack.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">Upload</a></li>
            <li><a href="#" className="hover:text-white">Quiz</a></li>
            <li><a href="#" className="hover:text-white">Results</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          <p className="text-sm"></p>
          <p className="text-sm mt-2"></p>
        </div>
      </div>

      <div className="border-t border-gray-700 text-center py-4 text-sm">
        © 2026 AI Learning Platform. All Rights Reserved.
      </div>
    </footer>
  );
}