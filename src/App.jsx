import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./Contexts/AuthContext"
import Login from "./Pages/Login"
import Search from "./Pages/Search"
import Match from "./Pages/Match"
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/search" element={<Search />} />
            <Route path="/match" element={<Match />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

