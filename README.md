# 🎯 Bulls-Eye MERN Project (6th Semester)

## ⚠️ Important Notice
**Do Not Copy:** This is a 6th-semester academic project. Please do not copy or plagiarize this repository for your own academic submissions.

**Feedback & Suggestions:** If you find any bugs, mistakes, or have suggestions for improvements, feel free to open an issue or reach out. Constructive feedback is always welcome!
<p align="center">
  <img src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjZvMWMxamttbmRrNGp2emIweDIyd2tsa3NwdG1ia2t2a2Vqcm5iZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ixYItT9PXRl9f2RqjJ/giphy.gif" width="420" />
</p>
## 🚀 Overview
Bulls-Eye is a modern MERN (MongoDB, Express.js, React.js, Node.js) web application integrated with AI functionalities. 

## 🛠️ Technology Stack
### Frontend (AI-Learn)
- **React 19** with **Vite**
- **Tailwind CSS & PostCSS** for sleek UI
- **Firebase** integration
- **React Router** for navigation

### Backend
- **Node.js & Express** 
- **MongoDB** with **Mongoose**
- **Google Generative AI (Gemini)** for smart features
- **Multer** for file uploads
- **Bcrypt, Helmet.js & Express Rate Limit** for security

## ⚙️ Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB connection string
- Google Gemini API Key

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd bullsmearn
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory (do NOT commit this file):
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GOOGLE_API_KEY=your_google_gemini_api_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../AI-Learn
npm install
```
Start the frontend development server:
```bash
npm run dev
```

## 🔐 Security Information
To prevent sensitive data leaks, the `.gitignore` explicitly blocks `.env` files and `node_modules` from being pushed to public repositories. Ensure your `.env` contains your actual keys and is **never** uploaded!

## 🤝 Contributing
Suggestions and code improvements are welcome. Please open an issue to discuss any changes.
