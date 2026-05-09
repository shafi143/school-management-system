import { useState } from 'react'
import axios from 'axios'
import './components.css'

function Students() {
  const [students, setStudents] = useState([])
  const [selectedClass, setSelectedClass] = useState("")

  const classes = [
    "Play Group",
    "Nursery",
    "K.G",
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "8th"
  ]

  // 📥 Fetch students by class
  const fetchByClass = async (className) => {
    setSelectedClass(className)

    if (!className) {
      setStudents([])
      return
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/students/class/${className}`
      )
      setStudents(res.data)
    } catch (error) {
      console.log(error)
      alert("Error fetching students")
    }
  }

  return (
    <div className="content">
      <h2>Students by Class</h2>

      {/* CLASS SELECT */}
      <div className="form-section">
        <h3>Select Class</h3>

        <select
          value={selectedClass}
          onChange={(e) => fetchByClass(e.target.value)}
          className="dropdown"
        >
          <option value="">-- Select Class --</option>
          {classes.map((cls, index) => (
            <option key={index} value={cls}>
              {cls}
            </option>
          ))}
        </select>
      </div>

      {/* STUDENT LIST */}
      <div className="list-section">
        <h3>Student List</h3>

        {students.length === 0 ? (
          <p>No students found</p>
        ) : (
          <table width="100%" border="1">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Father Name</th>
                <th>Class</th>
                <th>Section</th>
                <th>Gender</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td>{s.roll_no}</td>
                  <td>{s.name}</td>
                  <td>{s.father_name}</td>
                  <td>{s.class}</td>
                  <td>{s.section}</td>
                  <td>{s.gender}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Students