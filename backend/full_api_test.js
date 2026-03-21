const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';
const USER_ID = 'testUser123';

const logFile = path.join(__dirname, 'test_output3.txt');
fs.writeFileSync(logFile, ''); // clear file
function logToFile(...args) {
  const util = require('util');
  const line = args.map(a => typeof a === 'object' ? util.inspect(a, {depth: 2}) : a).join(' ');
  fs.appendFileSync(logFile, line + '\\n');
  origConsoleLog(...args); // keep console too
}

const origConsoleLog = console.log;
const origConsoleError = console.error;
console.log = logToFile;
console.error = (...args) => logToFile('ERROR:', ...args);

async function runTests() {
  console.log('--- STARTING BACKEND E2E TESTS ---');
  let testFileUploaded = '';

  // 1. Test File Upload
  try {
    console.log('\\n[1] Testing File Upload...');
    const formData = new FormData();
    const dummyPath = path.join(__dirname, 'dummy_test_doc.txt');
    fs.writeFileSync(dummyPath, 'This is a test document about artificial intelligence. AI is the simulation of human intelligence by machines.');
    
    formData.append('file', fs.createReadStream(dummyPath));
    formData.append('userId', USER_ID);

    const uploadRes = await axios.post(`${BASE_URL}/upload`, formData, {
      headers: formData.getHeaders(),
    });

    console.log('✅ Upload Success:', uploadRes.data.message);
    // Looking at test_upload from earlier, the backend returns { message: "File uploaded successfully!", filename: req.file.filename }
    testFileUploaded = uploadRes.data.filename || uploadRes.data.file?.filename;
    
    // Cleanup local dummy file
    fs.unlinkSync(dummyPath);
  } catch (err) {
    console.error('❌ Upload Failed:', err.response?.data || err.message);
  }

  // 2. Test Chatbot (requires filename if it was updated to use it)
  try {
    console.log('\\n[2] Testing Chatbot...');
    const chatReq = { message: 'Hello! Are you working?', userId: USER_ID };
    if (testFileUploaded) chatReq.filename = testFileUploaded;
    const chatRes = await axios.post(`${BASE_URL}/chatbot`, chatReq);
    console.log('✅ Chatbot Success:', chatRes.data.reply ? 'Received reply' : 'Empty reply');
  } catch (err) {
    console.error('❌ Chatbot Failed:', err.response?.data || err.message);
  }

  // 3. Test Fetch Materials
  try {
    console.log('\\n[3] Testing Fetch Materials...');
    const fetchRes = await axios.get(`${BASE_URL}/materials?userId=${USER_ID}`);
    console.log(`✅ Fetch Success: Retrieved ${fetchRes.data.length} materials`);
  } catch (err) {
    console.error('❌ Fetch Failed:', err.response?.data || err.message);
  }

  // 4. Test Quiz Generation
  if (testFileUploaded) {
    try {
      console.log(`\\n[4] Testing Quiz Generation with file: ${testFileUploaded}...`);
      // Warning: this could take a few seconds as it hits Gemini
      const quizRes = await axios.post(`${BASE_URL}/generate-quiz`, { filename: testFileUploaded });
      console.log(`✅ Quiz Gen Success: Generated ${quizRes.data.length} questions`);
    } catch (err) {
      console.error('❌ Quiz Gen Failed:', err.response?.data || err.message);
    }
  } else {
    console.log('\\n[4] ⏭️ Skipping Quiz Generation because upload failed.');
  }

  console.log('\\n--- TESTS COMPLETED ---');
}

runTests();
