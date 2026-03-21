# 🎯 Bulls-Eye MERN Project (6th Semester)

![Demo Animation](./demo.gif)
*(Note: Please record a short video/gif of your project and save it as `demo.gif` in this directory so it shows up here.)*

## ⚠️ Important Notice
**Do Not Copy:** This is a 6th-semester academic project. Please do not copy or plagiarize this repository for your own academic submissions.

**Feedback & Suggestions:** If you find any bugs, mistakes, or have suggestions for improvements, feel free to open an issue or reach out. Constructive feedback is always welcome!

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
