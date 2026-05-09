import './App.css'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Dashboard from './pages/Dashboard'
import AddStudent from './pages/AddStudent'
import Teachers from './pages/Teachers'
import StudentByClass from './pages/StudentByClass'
import Reports from './pages/Reports'
import Subject from './pages/AddSubject'
import Marks from './pages/Marks'
import Result from './pages/Result'
import Fees from './pages/Fees'
import Login from './pages/Login'
import axios from 'axios'
function App() {

  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [auth, setAuth] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      setAuth(true)
    }
    setAuthChecked(true)
  }, [])

  useEffect(() => {
    if (auth) {
      fetchStudents()
    }
  }, [auth])
  
  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students")
      setStudents(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    setAuth(false)
    delete axios.defaults.headers.common.Authorization
  }

  const ProtectedRoute = ({ children }) => {
    if (!authChecked) return null
    return auth ? children : <Navigate to="/login" replace />
  }

  if (!authChecked) return null

  return (
    <BrowserRouter>

      <div className="app">

        {/* HEADER */}
        <header className="header">
          <h1>SWAT SKY HAWK PUBLIC SCHOOL & COLLEGE</h1>
          <p>Management System</p>
        </header>

        <div className="layout">

          {/* SIDEBAR */}
          <nav className="sidebar">
            {auth ? (
              <>
                <Link to="/">Dashboard</Link>
                <Link to="/add-student">Add Student</Link>
                <Link to="/teachers">Teachers</Link>
                <Link to="/student-by-class">Students</Link>
                <Link to="/subjects">Subjects</Link>
                <Link to="/marks">Marks</Link>
                <Link to="/fees">Fees</Link>
                <Link to="/reports">Reports</Link>
                <Link to="/results">Results</Link>
                <button className="logout-button" onClick={handleLogout} style={{ marginTop: "16px" }}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login">Admin Login</Link>
            )}
          </nav>

          {/* MAIN */}
          <main className="main">

            <Routes>
              <Route
              path="/login"
              element={
                auth ? <Navigate to="/" replace /> : <Login setAuth={setAuth} />
              }
            />
            <Route path="/" element={<ProtectedRoute><Dashboard students={students} classes={classes} /></ProtectedRoute>} />
            <Route path="/add-student" element={<ProtectedRoute><AddStudent /></ProtectedRoute>} />
              <Route path="/student-by-class" element={<ProtectedRoute><StudentByClass /></ProtectedRoute>} />
              <Route path="/teachers" element={<ProtectedRoute><Teachers /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/subjects" element={<ProtectedRoute><Subject /></ProtectedRoute>} />
              <Route path="/marks" element={<ProtectedRoute><Marks /></ProtectedRoute>} />
              <Route path="/fees" element={<ProtectedRoute><Fees /></ProtectedRoute>} />
              <Route path="/results" element={<ProtectedRoute><Result /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to={auth ? "/" : "/login"} />} />
            </Routes>

          </main>

        </div>

        {/* FOOTER */}
        <footer className="footer">
          <p>&copy; 2026 Sky Hawk Public School & College</p>
        </footer>

      </div>

    </BrowserRouter>
  )
}

export default App