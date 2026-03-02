import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/analytics");
      setAnalytics(res.data);
      setLoading(false);
    } catch (err) {
      console.log("Error fetching analytics");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-800">Loading...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-800">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Quiz Analytics</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-600 font-semibold">Total Tests</h3>
            <p className="text-4xl font-bold text-indigo-600 mt-2">
              {analytics.totalTests}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-600 font-semibold">Average Score</h3>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {analytics.averageScore}%
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-600 font-semibold">Best Score</h3>
            <p className="text-4xl font-bold text-blue-600 mt-2">
              {analytics.bestScore}%
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-600 font-semibold">Worst Score</h3>
            <p className="text-4xl font-bold text-red-600 mt-2">
              {analytics.worstScore}%
            </p>
          </div>
        </div>

        {/* Results by File */}
        {Object.keys(analytics.resultsByFile).length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Performance by Material
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Material
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Tests Taken
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Average Score
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      All Scores
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(analytics.resultsByFile).map(
                    ([filename, stats]) => (
                      <tr key={filename} className="border-b border-gray-200">
                        <td className="p-4 text-gray-800">
                          {filename.split("-").slice(1).join("-")}
                        </td>
                        <td className="p-4 text-gray-800">{stats.count}</td>
                        <td className="p-4 text-gray-800">{stats.average}%</td>
                        <td className="p-4 text-gray-800">
                          {stats.scores.join(", ")}%
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {analytics.totalTests === 0 && (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600 text-lg">
              No quiz results yet. Take a quiz to see analytics!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
