import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MaterialUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [materials, setMaterials] = useState([]);
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

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file first.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("material", file);

    try {
      await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ File uploaded successfully!");
      setMessageType("success");
      setFile(null);
      fetchMaterials();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("❌ Upload failed. Try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm("Are you sure you want to delete this material?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/materials/${filename}`);
      setMaterials(materials.filter((m) => m.filename !== filename));
      setMessage("✅ Material deleted successfully!");
      setMessageType("success");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("❌ Failed to delete material.");
      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Upload Study Material</h1>

        {/* Upload Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <p className="text-gray-700 mb-6">
            Upload your PDF or text files to generate AI-powered quizzes instantly.
          </p>

          <form onSubmit={handleUpload} className="space-y-4">
            <div className="border-2 border-dashed border-indigo-400 rounded-lg p-8 text-center hover:border-indigo-600 transition cursor-pointer bg-indigo-50">
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <p className="text-indigo-600 font-semibold text-lg">
                  📄 Click to select or drag and drop
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  Supported: PDF, TXT (Max 10MB)
                </p>
                {file && (
                  <p className="text-green-600 font-semibold mt-2">
                    ✓ {file.name}
                  </p>
                )}
              </label>
            </div>

            <button
              type="submit"
              disabled={!file || loading}
              className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                !file || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Uploading..." : "Upload Material"}
            </button>
          </form>

          {message && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                messageType === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {/* Materials List */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Your Materials ({materials.length})
          </h2>

          {materials.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No materials uploaded yet.</p>
              <p className="text-gray-400">Upload your first material to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {materials.map((item, index) => (
                <div
                  key={index}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        📁 {item.filename.split("-").slice(1).join("-")}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(parseInt(item.filename.split("-")[0])).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={`http://localhost:5000/uploads/${item.filename}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-semibold text-center transition"
                    >
                      View
                    </a>

                    <button
                      onClick={() => navigate("/quiz")}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded text-sm font-semibold transition"
                    >
                      Quiz
                    </button>

                    <button
                      onClick={() => navigate("/test")}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-semibold transition"
                    >
                      Test
                    </button>

                    <button
                      onClick={() => handleDelete(item.filename)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-semibold transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-8 p-6 bg-indigo-50 rounded-lg border-l-4 border-indigo-600">
          <h3 className="font-bold text-gray-800 mb-3">Quick Links</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/quiz")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-semibold transition"
            >
              📝 Take Quiz
            </button>
            <button
              onClick={() => navigate("/test")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition"
            >
              ✓ Take Test
            </button>
            <button
              onClick={() => navigate("/results")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition"
            >
              📊 View Results
            </button>
            <button
              onClick={() => navigate("/analytics")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold transition"
            >
              📈 Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialUpload;