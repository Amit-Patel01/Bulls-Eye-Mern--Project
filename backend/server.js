require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

/* ================= BASIC SETUP ================= */
app.use(cors());
app.use(express.json());

/* ================= MONGODB ================= */
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/materialDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ Mongo Error:", err));

/* ================= SCHEMA ================= */
const materialSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  fileSize: Number,
  uploadedAt: { type: Date, default: Date.now },
});

const Material = mongoose.model("Material", materialSchema);

const resultSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  filename: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  percentage: { type: Number },
  answers: { type: Object },
  timestamp: { type: Date, default: Date.now }
});

const Result = mongoose.model("Result", resultSchema);

/* ================= UPLOAD FOLDER ================= */
const UPLOAD_DIR = path.join(__dirname, 'uploads');

if (!fsSync.existsSync(UPLOAD_DIR)) {
  fsSync.mkdirSync(UPLOAD_DIR);
}

/* ================= STATIC ================= */
app.use('/uploads', express.static(UPLOAD_DIR));

/* ================= MULTER ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMime = ['application/pdf', 'text/plain'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedMime.includes(file.mimetype) && ext !== '.pdf' && ext !== '.txt') {
    return cb(new Error("Only PDF or TXT allowed"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

/* ================= ROUTES ================= */

// 🔥 Upload
app.post('/api/upload', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    console.log("FILE:", req.file);
    console.log("BODY:", req.body);

    if (!req.file) {
      return res.status(400).json({ error: "File missing" });
    }

    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }

    const newMaterial = new Material({
      userId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileSize: req.file.size,
    });

    await newMaterial.save();

    res.json({
      message: "✅ Upload successful",
      data: newMaterial
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// 📥 Get Materials
app.get('/api/materials', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }

    const materials = await Material.find({ userId }).sort({ uploadedAt: -1 });

    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ❌ Delete
app.delete('/api/materials/:filename', async (req, res) => {
  try {
    const { filename } = req.params;

    await Material.deleteOne({ filename });

    const filePath = path.join(UPLOAD_DIR, filename);
    try {
      await fs.unlink(filePath);
    } catch {}

    res.json({ message: "Deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ================= RESULTS & ANALYTICS ================= */

// 📝 Save Result
app.post('/api/save-result', async (req, res) => {
  try {
    const { userId, filename, score, totalQuestions, answers, timestamp } = req.body;
    
    if (!userId || !filename) {
       return res.status(400).json({ error: "userId and filename required" });
    }

    const percentage = Math.round((score / totalQuestions) * 100);

    const newResult = new Result({
      userId,
      filename,
      score,
      totalQuestions,
      percentage,
      answers,
      timestamp: timestamp || new Date()
    });

    await newResult.save();
    res.json({ message: "Result saved successfully", data: newResult });
  } catch (error) {
    console.error("SAVE RESULT ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// 📈 Get Results
app.get('/api/results', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
       return res.status(400).json({ error: "userId required" });
    }
    
    const results = await Result.find({ userId }).sort({ timestamp: -1 });
    // Map _id to id to match frontend expectations
    const mappedResults = results.map(r => ({
       id: r._id,
       userId: r.userId,
       filename: r.filename,
       score: r.score,
       totalQuestions: r.totalQuestions,
       percentage: r.percentage,
       answers: r.answers,
       timestamp: r.timestamp
    }));
    res.json(mappedResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🗑 Delete Result
app.delete('/api/results/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Result.findByIdAndDelete(id);
    res.json({ message: "Result deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📊 Get Analytics
app.get('/api/analytics', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
       return res.status(400).json({ error: "userId required" });
    }

    const results = await Result.find({ userId });
    
    if (!results || results.length === 0) {
      return res.json({
        totalTests: 0,
        averageScore: 0,
        bestScore: 0,
        worstScore: 0,
        resultsByFile: {}
      });
    }

    let totalScore = 0;
    let bestScore = 0;
    let worstScore = 100;
    const resultsByFile = {};

    results.forEach(r => {
      const pct = r.percentage || 0;
      totalScore += pct;
      if (pct > bestScore) bestScore = pct;
      if (pct < worstScore) worstScore = pct;

      if (!resultsByFile[r.filename]) {
        resultsByFile[r.filename] = { count: 0, sum: 0, scores: [] };
      }
      resultsByFile[r.filename].count += 1;
      resultsByFile[r.filename].sum += pct;
      resultsByFile[r.filename].scores.push(pct);
    });

    Object.keys(resultsByFile).forEach(filename => {
      const fileStats = resultsByFile[filename];
      fileStats.average = Math.round(fileStats.sum / fileStats.count);
      delete fileStats.sum; // cleanup internal calc
    });

    const averageScore = Math.round(totalScore / results.length);

    res.json({
      totalTests: results.length,
      averageScore,
      bestScore,
      worstScore,
      resultsByFile
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ================= AI ROUTES ================= */
async function extractTextFromPDF(filename) {
  const filePath = path.join(UPLOAD_DIR, filename);
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

// 🧠 Generate Quiz
app.post('/api/generate-quiz', async (req, res) => {
  try {
    const { filename } = req.body;
    if (!filename) return res.status(400).json({ message: "filename required" });

    const text = await extractTextFromPDF(filename);
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Based on the following text, generate a 5-question multiple choice quiz. 
    Return ONLY a valid JSON array of objects. Each object must have exactly these keys: "question" (string), "options" (array of exactly 4 strings), and "correctAnswer" (string, must exactly match one of the options).
    Do not use markdown blocks or backticks, just return the raw JSON array string.
    
    Text: ${text.substring(0, 30000)}`;

    const result = await model.generateContent(prompt);
    let quizJsonStr = result.response.text();
    quizJsonStr = quizJsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const quiz = JSON.parse(quizJsonStr);
    res.json(quiz);
  } catch (error) {
    console.error("AI QUIZ ERROR:", error);
    res.status(500).json({ message: "Failed to generate quiz", details: error.message });
  }
});

// 🤖 Chatbot
app.post('/api/chatbot', async (req, res) => {
  try {
    const { message, filename } = req.body;
    if (!message) return res.status(400).json({ error: "message required" });

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let prompt = "";
    
    if (filename) {
      const text = await extractTextFromPDF(filename);
      prompt = `You are a helpful AI tutor assisting a student with their study material.
      Here is the content of their study material:
      ---
      ${text.substring(0, 30000)}
      ---
      The student asks: "${message}"
      Please provide a helpful, concise answer based largely on the provided text.`;
    } else {
      prompt = `You are a helpful and highly intelligent AI tutor assisting a student.
      The student asks: "${message}"
      Please provide a helpful, concise, and accurate answer based on your general knowledge.`;
    }

    const result = await model.generateContent(prompt);
    res.json({ reply: result.response.text() });
  } catch (error) {
    console.error("CHATBOT ERROR:", error);
    res.status(500).json({ error: "Chatbot failed" });
  }
});

// 📊 Analyze PDF
app.post('/api/analyze-pdf', async (req, res) => {
  try {
    const { filename } = req.body;
    if (!filename) return res.status(400).json({ error: "filename required" });

    const text = await extractTextFromPDF(filename);
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Analyze the following text. Return ONLY a valid JSON object with the following keys:
    - "summary" (string: brief summary)
    - "keyTopics" (array of strings)
    - "learningObjectives" (array of strings)
    - "difficultyLevel" (string: Beginner, Intermediate, or Advanced)
    
    Do not use markdown blocks or backticks, just return the raw JSON object string.
    Text: ${text.substring(0, 30000)}`;

    const result = await model.generateContent(prompt);
    let analysisJsonStr = result.response.text();
    analysisJsonStr = analysisJsonStr.replace(/```json/g, '').replace(/```/g, '').trim();

    const analysis = JSON.parse(analysisJsonStr);
    res.json({ success: true, analysis });
  } catch (error) {
    console.error("ANALYZE ERROR:", error);
    res.status(500).json({ success: false, error: "Failed to analyze PDF" });
  }
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});