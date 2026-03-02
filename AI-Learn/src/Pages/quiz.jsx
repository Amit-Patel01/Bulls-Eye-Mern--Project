import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function GenerateQuiz() {
  const [materials, setMaterials] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/materials");
      setMaterials(res.data);
    } catch (err) {
      console.log("Error fetching materials");
    }
  };

  const handleGenerateQuiz = async () => {
    if (!selectedFile) {
      alert("Please select a study material first");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/generate-quiz",
        { filename: selectedFile }
      );

      setQuestions(res.data);
      setScore(null);
      setSelectedAnswers({});
      setSubmitted(false);
    } catch (err) {
      console.log("Error generating quiz");
      alert("Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (qIndex, option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [qIndex]: option,
    });
  };

  const handleSubmit = async () => {
    let totalScore = 0;

    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        totalScore++;
      }
    });

    setScore(totalScore);
    setSubmitted(true);

    // Save result to backend
    try {
      await axios.post("http://localhost:5000/api/save-result", {
        filename: selectedFile,
        score: totalScore,
        totalQuestions: questions.length,
        answers: selectedAnswers,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.log("Error saving result");
    }
  };

  const handleRetry = () => {
    setSelectedFile("");
    setQuestions([]);
    setSelectedAnswers({});
    setScore(null);
    setSubmitted(false);
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Generate Quiz</h1>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <p className="text-gray-700 mb-6">
              Select a study material and generate custom MCQ questions instantly using AI.
            </p>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-3">
                Select Study Material:
              </label>
              <select
                value={selectedFile}
                onChange={(e) => setSelectedFile(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="">-- Choose a material --</option>
                {materials.map((item, index) => (
                  <option key={index} value={item.filename}>
                    {item.filename.split("-").slice(1).join("-")}
                  </option>
                ))}
              </select>

              {materials.length === 0 && (
                <p className="mt-3 text-red-600 font-semibold">
                  No materials available. Please upload a material first.
                </p>
              )}
            </div>

            <button
              onClick={handleGenerateQuiz}
              disabled={!selectedFile || loading}
              className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                !selectedFile || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Generating Quiz..." : "Generate Quiz"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Complete!</h2>

          <div className="bg-gradient-to-r from-indigo-100 to-blue-100 p-6 rounded-lg mb-6">
            <p className="text-gray-600 text-sm mb-2">Your Score</p>
            <p className="text-5xl font-bold text-indigo-600">
              {score}/{questions.length}
            </p>
            <p className="text-xl text-gray-700 mt-2">
              {Math.round((score / questions.length) * 100)}%
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/results")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold"
            >
              View All Results
            </button>

            <button
              onClick={handleRetry}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-semibold"
            >
              Take Another Quiz
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full bg-white border-2 border-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-50"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {selectedFile.split("-").slice(1).join("-")} - Quiz
          </h1>
          <p className="text-gray-600">
            Questions: {questions.length} | Answered:{" "}
            {Object.keys(selectedAnswers).length} / {questions.length}
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((q, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                <span className="bg-indigo-600 text-white px-3 py-1 rounded-full mr-3">
                  {index + 1}
                </span>
                {q.question}
              </h3>

              <div className="space-y-3">
                {q.options.map((option, i) => (
                  <label
                    key={i}
                    className={`block p-4 rounded-lg border-2 cursor-pointer transition ${
                      selectedAnswers[index] === option
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-300 bg-white hover:border-indigo-400"
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        checked={selectedAnswers[index] === option}
                        onChange={() => handleOptionSelect(index, option)}
                        className="w-5 h-5 mr-3 cursor-pointer"
                      />
                      <span className="text-gray-800 font-medium">{option}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        {questions.length > 0 && (
          <div className="mt-8 flex gap-4">
            <button
              onClick={handleRetry}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Start Over
            </button>

            <button
              onClick={handleSubmit}
              disabled={Object.keys(selectedAnswers).length < questions.length}
              className={`flex-1 font-semibold py-3 rounded-lg transition ${
                Object.keys(selectedAnswers).length < questions.length
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              Submit Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}