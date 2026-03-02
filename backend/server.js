require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const pdf = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ===============================
   Gemini Setup
=================================*/

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY not found in .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* ===============================
   File Upload Setup
=================================*/

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

/* ===============================
   Upload Route
=================================*/

app.post("/api/upload", upload.single("material"), (req, res) => {
  res.json({ message: "File uploaded successfully" });
});

/* ===============================
   List Uploaded Files
=================================*/

app.get("/api/materials", (req, res) => {
  const files = fs.readdirSync("./uploads");
  res.json(files.map((file) => ({ filename: file })));
});

/* ===============================
   Generate Quiz Using Gemini
=================================*/

app.post("/api/generate-quiz", async (req, res) => {
  try {
    const { filename } = req.body;

    const filePath = `./uploads/${filename}`;
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    const text = data.text.substring(0, 2000);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
Generate 5 multiple choice questions from the study material below.

Return ONLY JSON array in this format:

[
{
"question": "...",
"options": ["A","B","C","D"],
"correctAnswer": "A"
}
]

Material:
${text}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const start = responseText.indexOf("[");
    const end = responseText.lastIndexOf("]");
    const cleanJSON = responseText.substring(start, end + 1);

    const questions = JSON.parse(cleanJSON);

    res.json(questions);
  } catch (error) {
    console.error("Quiz AI Error:", error);
    res.status(500).json({ message: "AI quiz generation failed" });
  }
});

/* ===============================
   Chatbot Endpoint (Gemini)
=================================*/
app.post("/api/chatbot", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(message);
    const reply = result.response.text();

    res.json({
      success: true,
      reply: reply || "I couldn't generate a response.",
    });

  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Chatbot failed",
    });
  }
});
/* ===============================
   Delete Material
=================================*/

app.delete("/api/materials/:filename", (req, res) => {
  const filePath = `./uploads/${req.params.filename}`;
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ message: "Deleted successfully" });
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

/* ===============================
   Start Server
=================================*/

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});