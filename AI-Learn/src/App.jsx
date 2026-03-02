import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, logOut } from './firebase'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './components/Login'
import Signup from './components/Signup'
import ForgotPassword from './Pages/forgotpassword'
import Chatbot from './components/Chatbot'
import Home from './Pages/home'
import Upload from "./Pages/upload"
import GenerateQuiz from './Pages/quiz'
import Test from './Pages/test'
import Results from './Pages/results'
import Analytics from './Pages/analytics'
import Settings from './Pages/settings'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      await logOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <svg className="w-12 h-12 text-indigo-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-600 mt-4 font-semibold">Loading...</p>
        </div>
      </div>
    )
  }

  // Auth Routes (Login and Signup)
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  // Protected Routes (Require Authentication)
  return (
    <Layout user={user} onSignOut={handleSignOut}>
      <Chatbot />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/quiz" element={<GenerateQuiz />} />
        <Route path="/test" element={<Test />} />
        <Route path="/results" element={<Results />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App