import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Test() {
  const [materials, setMaterials] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
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

  const handleGenerateTest = async () => {
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
      setCurrentQuestion(0);
    } catch (err) {
      console.log("Error generating test");
      alert("Failed to generate test. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: option,
    });
  };

  const handleSubmit = async () => {
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setSubmitted(true);

    // Save result to backend
    try {
      await axios.post("http://localhost:5000/api/save-result", {
        filename: selectedFile,
        score: correctCount,
        totalQuestions: questions.length,
        answers: selectedAnswers,
        timestamp: new Date().toISOString(),
      });

      // Redirect to results after saving
      setTimeout(() => navigate("/results"), 2000);
    } catch (err) {
      console.log("Error saving result");
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRetry = () => {
    setSelectedFile("");
    setQuestions([]);
    setSelectedAnswers({});
    setScore(null);
    setSubmitted(false);
    setCurrentQuestion(0);
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Quiz Test</h1>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <p className="text-gray-700 mb-6">
              Select a study material to start your test. You will be given
              multiple-choice questions based on the material.
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
                <p className="mt-3 text-red-600">
                  No materials available. Please upload a material first.
                </p>
              )}
            </div>

            <button
              onClick={handleGenerateTest}
              disabled={!selectedFile || loading}
              className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                !selectedFile || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Generating Test..." : "Start Test"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Test Complete!</h2>

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
              View Detailed Results
            </button>

            <button
              onClick={handleRetry}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-semibold"
            >
              Take Another Test
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

  const currentQ = questions[currentQuestion];
  const isAnswered = selectedAnswers[currentQuestion] !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quiz Test</h1>
            <p className="text-gray-600 text-sm">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-32">
            <div className="bg-gray-200 rounded-full h-3">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
              ></div>
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
            </p>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {currentQ.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                className={`w-full p-4 text-left rounded-lg border-2 transition font-semibold ${
                  selectedAnswers[currentQuestion] === option
                    ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                    : "border-gray-300 bg-white text-gray-700 hover:border-indigo-400"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedAnswers[currentQuestion] === option
                        ? "border-indigo-600 bg-indigo-600"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedAnswers[currentQuestion] === option && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  {option}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-between">
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestion === 0}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              currentQuestion === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-600 hover:bg-gray-700 text-white"
            }`}
          >
            Previous
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(selectedAnswers).length < questions.length}
              className={`px-8 py-2 rounded-lg font-semibold text-white transition ${
                Object.keys(selectedAnswers).length < questions.length
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              Submit Test
            </button>
          ) : (
            <button
              onClick={goToNextQuestion}
              className="px-6 py-2 rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition"
            >
              Next
            </button>
          )}
        </div>

        {/* Question Answer Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Questions Summary</h3>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg font-semibold transition ${
                  currentQuestion === index
                    ? "bg-indigo-600 text-white ring-2 ring-indigo-400"
                    : selectedAnswers[index]
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
