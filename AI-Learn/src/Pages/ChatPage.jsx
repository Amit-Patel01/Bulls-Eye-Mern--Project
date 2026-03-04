import React from 'react';
import { useNavigate } from 'react-router-dom';
import Chatbot from '../components/Chatbot';

export default function ChatPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">AI Assistant</h1>
      <p className="text-gray-700 mb-4">
        Ask the assistant anything – upload materials, ask questions, or just chat.
        The AI will respond based on the context and help you learn.
      </p>
      {/* card container similar to quiz page */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
        <div className="h-[70vh] relative">
          <Chatbot fullscreen onClose={() => navigate(-1)} />
        </div>
      </div>
    </div>
  );
}
