const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

async function testUpload() {
  try {
    const form = new FormData();
    form.append('userId', '123');
    
    // We append a PDF file to test
    const pdfPath = path.join(__dirname, '../Doc.pdf');
    form.append('file', fs.createReadStream(pdfPath)); 
    
    const response = await axios.post('http://localhost:5000/api/upload', form, {
      headers: {
        ...form.getHeaders()
      }
    });
    
    console.log("Success:", response.data);
  } catch (error) {
    if (error.response) {
      console.log("Error Response:", error.response.status, error.response.data);
    } else {
      console.log("Error:", error.message);
    }
  }
}

testUpload();
