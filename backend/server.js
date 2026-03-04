const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const axios = require('axios');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const UPLOAD_DIR = path.join(__dirname, 'uploads');
const MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10 MB
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const CACHE_MAX_ITEMS = 50;

// Ensure upload dir exists (sync at startup is fine)
if (!fsSync.existsSync(UPLOAD_DIR)) fsSync.mkdirSync(UPLOAD_DIR, { recursive: true });

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(compression());
app.use('/uploads', express.static(UPLOAD_DIR));

// Basic rate limiter for production safety
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ----------------------------
// Multer: accept PDFs only
// ----------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const fileFilter = (req, file, cb) => {
  const allowed = ['application/pdf'];
  if (!allowed.includes(file.mimetype)) return cb(new Error('Only PDF uploads are allowed'), false);
  cb(null, true);
};

const upload = multer({ storage, limits: { fileSize: MAX_UPLOAD_SIZE }, fileFilter });

// ----------------------------
// In-memory cache for parsed PDF text
// Simple LRU-like eviction based on insertion order
// ----------------------------
const cache = new Map();
function setCache(key, value) {
  if (cache.size >= CACHE_MAX_ITEMS) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
  cache.set(key, { value, ts: Date.now() });
}
function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

// ----------------------------
// Utility: wrap async route handlers
// ----------------------------
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// ----------------------------
// Ollama (AI) helper
// ----------------------------
const ollama = axios.create({ 
  baseURL: process.env.OLLAMA_URL || 'http://localhost:11434/api', 
  timeout: 120000 // 2 minutes for AI response
});

// choose model via environment variable or fallback to a known-installed model
async function askAI(prompt, opts = {}) {
  const payload = {
    model: opts.model || process.env.AI_MODEL || 'llama3:latest',
    prompt,
    stream: false,
    options: { temperature: typeof opts.temperature === 'number' ? opts.temperature : 0.0 },
  };

  try {
    const resp = await ollama.post('/generate', payload);
    if (!resp || !resp.data) throw new Error('Empty response from model');
    const text = resp.data.response ?? resp.data;
    return (typeof text === 'string') ? text : String(text);
  } catch (err) {
    const message = err.message || 'AI call failed';
    if (err.code === 'ECONNREFUSED') {
      throw new Error(`Ollama service not running on ${process.env.OLLAMA_URL || 'http://localhost:11434'}`);
    }
    if (err.code === 'ENOTFOUND') {
      throw new Error('Ollama host not reachable');
    }
    throw new Error(`AI service error: ${message}`);
  }
}

// ----------------------------
// Helpers: robust JSON extraction & validation
// ----------------------------
function extractFirstBalancedArray(text) {
  const start = text.indexOf('[');
  if (start === -1) return null;
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (ch === '[') depth++;
    else if (ch === ']') depth--;
    if (depth === 0) return text.slice(start, i + 1);
  }
  return null;
}

function validateQuiz(quiz) {
  if (!Array.isArray(quiz)) return 'Quiz must be a JSON array.';
  if (quiz.length !== 5) return 'Quiz must contain exactly 5 questions.';
  for (let i = 0; i < quiz.length; i++) {
    const q = quiz[i];
    if (!q || typeof q !== 'object') return `Question ${i + 1} must be an object.`;
    if (!q.question || typeof q.question !== 'string') return `Question ${i + 1} missing 'question' string.`;
    if (!Array.isArray(q.options) || q.options.length !== 4) return `Question ${i + 1} must have exactly 4 'options'.`;
    if (!('correctAnswer' in q)) return `Question ${i + 1} missing 'correctAnswer'.`;
    const ok = q.options.includes(q.correctAnswer);
    if (!ok) return `Question ${i + 1} 'correctAnswer' must match one of the options.`;
  }
  return null;
}

// ----------------------------
// PDF text extraction (async, cached)
// ----------------------------
async function getPdfText(filePath) {
  const cached = getCache(filePath);
  if (cached) return cached;
  const buffer = await fs.readFile(filePath);
  const data = await pdf(buffer);
  const text = (data && data.text) ? data.text : '';
  setCache(filePath, text);
  return text;
}

// ----------------------------
// Routes
// ----------------------------
const bcrypt = require('bcrypt');

const USERS_FILE = path.join(__dirname, 'users.json');
async function readUsers() {
  try { const data = await fs.readFile(USERS_FILE, 'utf8'); return JSON.parse(data); }
  catch (e) { return []; }
}
async function writeUsers(users) { await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2)); }

// Authentication endpoints
app.post('/api/auth/register', asyncHandler(async (req, res) => {
  const { email, password, displayName } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'email and password required' });
  const users = await readUsers();
  if (users.find(u => u.email === email)) return res.status(409).json({ message: 'Email already registered' });
  const hash = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), email, displayName: displayName||'', password: hash };
  users.push(user);
  await writeUsers(users);
  const safe = { id: user.id, email: user.email, displayName: user.displayName };
  res.json({ user: safe });
}));

app.post('/api/auth/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'email and password required' });
  const users = await readUsers();
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: 'invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'invalid credentials' });
  const safe = { id: user.id, email: user.email, displayName: user.displayName };
  res.json({ user: safe });
}));


app.get('/api/health', (req, res) => {
  res.json({ status: 'running', ai: { model: process.env.AI_MODEL || 'llama3:latest', url: process.env.OLLAMA_URL || 'http://localhost:11434' } });
});

app.post('/api/upload', upload.single('material'), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded or invalid file type.' });
  res.status(201).json({ message: 'File uploaded successfully', filename: req.file.filename });
}));

app.get('/api/materials', asyncHandler(async (req, res) => {
  const files = await fs.readdir(UPLOAD_DIR);
  res.json(files.map((f) => ({ filename: f })));
}));

app.delete('/api/materials/:filename', asyncHandler(async (req, res) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(UPLOAD_DIR, filename);
  try {
    await fs.unlink(filePath);
    cache.delete(filePath);
    return res.json({ message: 'Deleted successfully' });
  } catch (err) {
    if (err.code === 'ENOENT') return res.status(404).json({ message: 'File not found' });
    throw err;
  }
}));

// ----------------------------
// Generate quiz: strict JSON output and validation with retry logic
// ----------------------------
app.post('/api/generate-quiz', asyncHandler(async (req, res) => {
  const { filename } = req.body || {};
  if (!filename) return res.status(400).json({ message: 'filename is required in body' });

  const safeName = path.basename(filename);
  const filePath = path.join(UPLOAD_DIR, safeName);
  try {
    await fs.access(filePath);
  } catch (err) {
    return res.status(404).json({ message: 'File not found' });
  }

  const materialText = (await getPdfText(filePath)).substring(0, 30_000); // limit prompt size

  const prompt = `You are an academic quiz generator.\n\nSTRICT RULES:\n1) Use ONLY the MATERIAL provided below.\n2) Do NOT use any external knowledge or guess.\n3) Generate exactly 5 multiple-choice questions (MCQs).\n4) Each question must have 4 options.\n5) For each question provide one correctAnswer that exactly matches one of the options.\n6) Do NOT include explanations.\n7) RETURN ONLY A JSON ARRAY and nothing else.\n\nReturn the JSON array exactly matching this schema:\n[ { "question": "", "options": ["","","",""], "correctAnswer": "" } ]\n\nMATERIAL:\n${materialText}\n`;

  // utility: try parse & validate a text blob
  function parseAndValidate(text) {
    let cleaned = text.trim();
    try {
      const parsed = JSON.parse(cleaned);
      const err = validateQuiz(parsed);
      if (err) return { error: err, raw: cleaned };
      return { parsed };
    } catch (_) {
      const extracted = extractFirstBalancedArray(cleaned);
      if (!extracted) return { error: 'no JSON array found', raw: cleaned };
      try {
        const parsed2 = JSON.parse(extracted);
        const err2 = validateQuiz(parsed2);
        if (err2) return { error: err2, raw: cleaned };
        return { parsed: parsed2 };
      } catch (e2) {
        return { error: 'failed to parse JSON array', raw: cleaned };
      }
    }
  }

  // ask the AI; if first attempt produces invalid output try once more
  async function askOnce() {
    let aiRaw;
    try {
      aiRaw = await askAI(prompt, { temperature: 0.0 });
    } catch (err) {
      throw err;
    }
    return typeof aiRaw === 'string' ? aiRaw : JSON.stringify(aiRaw);
  }

  let aiText;
  try {
    aiText = await askOnce();
  } catch (err) {
    if (err.message && err.message.toLowerCase().includes('timeout')) {
      return res.status(504).json({ message: 'AI service timed out. Please try again later or with a smaller file.' });
    }
    throw err;
  }

  let result = parseAndValidate(aiText);
  if (result.error) {
    // log for diagnostics
    console.warn('quiz validation failed on first attempt:', result.error, '\nraw:', aiText.slice(0, 2000));
    // second try
    try {
      aiText = await askOnce();
      result = parseAndValidate(aiText);
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('timeout')) {
        return res.status(504).json({ message: 'AI service timed out. Please try again later or with a smaller file.' });
      }
      throw err;
    }
  }

  if (result.error) {
    return res.status(502).json({ message: 'AI produced invalid quiz', details: result.error, raw: result.raw?.slice(0, 2000) });
  }

  res.type('application/json').status(200).json(result.parsed);
}));

// ----------------------------
// Chatbot: respond only from material or explicitly say not available
// ----------------------------
app.post('/api/chatbot', asyncHandler(async (req, res) => {
  const { message, filename, text } = req.body || {};
  if (!message || typeof message !== 'string' || message.trim() === '') return res.status(400).json({ success: false, message: 'message is required' });

  let materialText = '';
  if (filename) {
    const safeName = path.basename(filename);
    const filePath = path.join(UPLOAD_DIR, safeName);
    try {
      await fs.access(filePath);
      materialText = await getPdfText(filePath);
    } catch (err) {
      // ignore missing file and proceed if text provided separately
      materialText = '';
    }
  }
  if (text && typeof text === 'string' && text.trim()) materialText += '\n' + text.trim();

  let prompt;
  if (materialText && materialText.trim()) {
    const truncated = materialText.substring(0, 30_000);
    prompt = `You are an AI Learning Assistant.\n\nRULES:\n- Answer ONLY using the MATERIAL provided below.\n- Do NOT use external knowledge or guess.\n- If the answer cannot be found in the MATERIAL, respond exactly with: The answer is not available in the provided material.\n- Keep the answer concise and academic.\n\nMATERIAL:\n${truncated}\n\nQUESTION:\n${message.trim()}\n`;
  } else {
    // If no material, be explicit about inability to answer to avoid hallucination
    prompt = `You are an AI assistant. Do NOT invent facts. If you can't answer, respond: The answer is not available.\nQUESTION:\n${message.trim()}`;
  }

  try {
    const aiRaw = await askAI(prompt, { temperature: 0.0 });
    const aiText = (typeof aiRaw === 'string') ? aiRaw.trim() : JSON.stringify(aiRaw);

    // If model used the exact phrase defined above, normalize it
    if (/The answer is not available in the provided material\.\?/i.test(aiText)) {
      return res.json({ success: true, reply: 'The answer is not available in the provided material.' });
    }

    // Safety: limit reply length
    const reply = aiText.length > 5000 ? aiText.slice(0, 5000) + '...' : aiText;
    res.json({ success: true, reply });
  } catch (err) {
    // gracefully handle AI service errors without crashing the endpoint
    console.error('AI call failed in /api/chatbot:', err.message || err);
    return res.status(503).json({ success: false, message: 'AI service is unavailable. ' + (err.message || '') });
  }
}));

// ----------------------------
// Quiz Results Storage (JSON file based)
// ----------------------------
const RESULTS_FILE = path.join(__dirname, 'results.json');

async function readResults() {
  try {
    const data = await fs.readFile(RESULTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

async function writeResults(results) {
  await fs.writeFile(RESULTS_FILE, JSON.stringify(results, null, 2));
}

app.post('/api/save-result', asyncHandler(async (req, res) => {
  const { filename, score, totalQuestions, answers, timestamp, userId } = req.body || {};
  if (!filename || typeof score !== 'number' || !totalQuestions) {
    return res.status(400).json({ message: 'filename, score, and totalQuestions required' });
  }
  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  const results = await readResults();
  const result = {
    id: Date.now().toString(),
    userId,
    score,
    totalQuestions,
    percentage: Math.round((score / totalQuestions) * 100),
    answers: answers || {},
    timestamp: timestamp || new Date().toISOString(),
  };

  results.push(result);
  await writeResults(results);
  res.json({ success: true, message: 'Result saved', result });
}));

app.get('/api/results', asyncHandler(async (req, res) => {
  const { userId } = req.query;
  let results = await readResults();
  if (userId) {
    results = results.filter(r => r.userId === userId);
  }
  res.json(results.map(r => ({
    ...r,
    answers: undefined // don't send answers back in list view
  })));
}));

app.get('/api/results/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const results = await readResults();
  const result = results.find(r => r.id === id);
  if (!result) return res.status(404).json({ message: 'Result not found' });
  res.json(result);
}));

app.delete('/api/results/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const results = await readResults();
  const index = results.findIndex(r => r.id === id);
  if (index === -1) return res.status(404).json({ message: 'Result not found' });
  results.splice(index, 1);
  await writeResults(results);
  res.json({ success: true, message: 'Result deleted' });
}));

app.get('/api/analytics', asyncHandler(async (req, res) => {
  const { userId } = req.query;
  let results = await readResults();
  if (userId) {
    results = results.filter(r => r.userId === userId);
  }
  if (results.length === 0) {
    return res.json({
      totalTests: 0,
      averageScore: 0,
      bestScore: 0,
      worstScore: 0,
      resultsByFile: {}
    });
  }

  const percentages = results.map(r => r.percentage);
  const avgPercentage = Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length);
  const bestScore = Math.max(...percentages);
  const worstScore = Math.min(...percentages);

  const resultsByFile = {};
  results.forEach(r => {
    if (!resultsByFile[r.filename]) {
      resultsByFile[r.filename] = { count: 0, totalScore: 0, scores: [] };
    }
    resultsByFile[r.filename].count++;
    resultsByFile[r.filename].totalScore += r.percentage;
    resultsByFile[r.filename].scores.push(r.percentage);
  });

  Object.keys(resultsByFile).forEach(file => {
    const data = resultsByFile[file];
    data.average = Math.round(data.totalScore / data.count);
    delete data.totalScore;
  });

  res.json({
    totalTests: results.length,
    averageScore: avgPercentage,
    bestScore,
    worstScore,
    resultsByFile
  });
}));

// ----------------------------
// Global error handler
// ----------------------------
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  if (res.headersSent) return next(err);
  const status = err.statusCode || err.status || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
});

// ----------------------------
// Start server
// ----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
