import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../firebase";

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const user = getCurrentUser();
      const url = user ? `http://localhost:5000/api/results?userId=${encodeURIComponent(user.uid)}` : "http://localhost:5000/api/results";
      const res = await axios.get(url);
      setResults(res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      setLoading(false);
    } catch (err) {
      console.log("Error fetching results", err);
      setLoading(false);
    }
  };

  const handleDeleteResult = async (id) => {
    if (!window.confirm("Are you sure you want to delete this result?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/results/${id}`);
      setResults(results.filter((r) => r.id !== id));
      setSelectedResult(null);
    } catch (err) {
      console.log("Error deleting result");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-800">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Quiz Results</h1>
          <button
            onClick={() => navigate("/quiz")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
          >
            Take Another Quiz
          </button>
        </div>

        {results.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600 text-lg mb-4">
              No quiz results yet. Take a quiz to see your results!
            </p>
            <button
              onClick={() => navigate("/quiz")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
            >
              Start Quiz
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Results List */}
            <div className="lg:col-span-1 overflow-y-auto max-h-96 bg-white rounded-lg shadow-md">
              <div className="p-4 border-b-2 border-gray-300">
                <h2 className="text-xl font-bold text-gray-800">
                  All Results ({results.length})
                </h2>
              </div>

              {results.map((result) => (
                <div
                  key={result.id}
                  onClick={() => setSelectedResult(result)}
                  className={`p-4 border-b border-gray-200 cursor-pointer transition ${
                    selectedResult?.id === result.id
                      ? "bg-indigo-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <p className="font-semibold text-gray-800">
                    {result.filename.split("-").slice(1).join("-")}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(result.timestamp).toLocaleDateString()} at{" "}
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </p>
                  <p className="text-lg font-bold text-indigo-600 mt-1">
                    {result.percentage}%
                  </p>
                </div>
              ))}
            </div>

            {/* Result Details */}
            <div className="lg:col-span-2">
              {selectedResult ? (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {selectedResult.filename.split("-").slice(1).join("-")}
                      </h2>
                      <p className="text-gray-600">
                        {new Date(selectedResult.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleDeleteResult(selectedResult.id)
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>

                  {/* Score Card */}
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg mb-6">
                    <p className="text-gray-600 text-sm">Final Score</p>
                    <p className="text-5xl font-bold text-indigo-600 mt-2">
                      {selectedResult.score}/{selectedResult.totalQuestions}
                    </p>
                    <p className="text-xl text-gray-700 mt-2">
                      {selectedResult.percentage}%
                    </p>
                  </div>

                  {/* Results Summary */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-green-600 font-semibold">Correct</p>
                      <p className="text-2xl font-bold text-green-700">
                        {selectedResult.score}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600 font-semibold">Total</p>
                      <p className="text-2xl font-bold text-gray-700">
                        {selectedResult.totalQuestions}
                      </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-red-600 font-semibold">Wrong</p>
                      <p className="text-2xl font-bold text-red-700">
                        {selectedResult.totalQuestions - selectedResult.score}
                      </p>
                    </div>
                  </div>

                  {/* Answers */}
                  {selectedResult.answers && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-4">
                        Answers Given
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(selectedResult.answers).map(
                          ([qIndex, answer]) => (
                            <div
                              key={qIndex}
                              className="bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-600"
                            >
                              <p className="text-sm text-gray-600">
                                Question {parseInt(qIndex) + 1}
                              </p>
                              <p className="font-semibold text-gray-800">
                                {answer}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-md text-center h-96 flex items-center justify-center">
                  <p className="text-gray-600 text-lg">
                    Select a result to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
