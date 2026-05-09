import { useState } from 'react'
import axios from 'axios'
import './studentbyclass.css'

function Students() {
  const [students, setStudents] = useState([])
  const [selectedClass, setSelectedClass] = useState("")
  const [editStudent, setEditStudent] = useState(null)

  const classes = [
    "Play Group", "Nursery", "K.G",
    "1st", "2nd", "3rd", "4th", "5th",
    "6th", "7th", "8th"
  ]

  // 📥 FETCH
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
    }
  }

  // ❌ DELETE
  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm("Do you want to delete this student?")

    if (!confirmDelete) return

    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`)
      fetchByClass(selectedClass)
    } catch (err) {
      console.log(err)
    }
  }

  // ✏️ OPEN EDIT
  const openEdit = (student) => {
    setEditStudent({ ...student }) // IMPORTANT COPY
  }

  // 💾 UPDATE
  const updateStudent = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/students/${editStudent.id}`,
        {
          roll_no: editStudent.roll_no,
          name: editStudent.name,
          father_name: editStudent.father_name,
          class: editStudent.class,
          section: editStudent.section,
          gender: editStudent.gender,
          date_of_birth: editStudent.date_of_birth,
          phone: editStudent.phone,
          address: editStudent.address
        }
      )

      setEditStudent(null)
      fetchByClass(selectedClass)
    } catch (err) {
      console.log(err)
      alert("Update failed")
    }
  }

  return (
    <div className="content">
      <h2>Students by Class</h2>

      {/* CLASS SELECT */}
      <div className="form-section">
        <select
          value={selectedClass}
          onChange={(e) => fetchByClass(e.target.value)}
          className="dropdown"
        >
          <option value="">Select Class</option>
          {classes.map((cls, i) => (
            <option key={i} value={cls}>{cls}</option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <table width="100%" border="1">
        <thead>
          <tr>
            <th>Roll</th>
            <th>Name</th>
            <th>Father</th>
            <th>Class</th>
            <th>Section</th>
            <th>Gender</th>
            <th>Actions</th>
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

              <td>
                <button onClick={() => openEdit(s)} className='edit-btn'>Edit</button>
                <button onClick={() => deleteStudent(s.id)} className='delete-btn' >Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* EDIT MODAL */}
      {editStudent && (
        <div className="edit-box">
          <h3>Edit Student</h3>

          <input
            value={editStudent.roll_no}
            onChange={(e) =>
              setEditStudent({ ...editStudent, roll_no: e.target.value })
            }
          />

          <input
            value={editStudent.name}
            onChange={(e) =>
              setEditStudent({ ...editStudent, name: e.target.value })
            }
          />

          <input
            value={editStudent.father_name}
            onChange={(e) =>
              setEditStudent({ ...editStudent, father_name: e.target.value })
            }
          />

          <select
            value={editStudent.class}
            onChange={(e) =>
              setEditStudent({ ...editStudent, class: e.target.value })
            }
          >
            {classes.map((cls, i) => (
              <option key={i} value={cls}>{cls}</option>
            ))}
          </select>

          <select
            value={editStudent.section}
            onChange={(e) =>
              setEditStudent({ ...editStudent, section: e.target.value })
            }
          >
            <option value="Boys">Boys</option>
            <option value="Girls">Girls</option>
          </select>

          <select
            value={editStudent.gender}
            onChange={(e) =>
              setEditStudent({ ...editStudent, gender: e.target.value })
            }
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <input
            type="date"
            value={editStudent.date_of_birth}
            onChange={(e) =>
              setEditStudent({ ...editStudent, date_of_birth: e.target.value })
            }
          />

          <input
            value={editStudent.phone}
            onChange={(e) =>
              setEditStudent({ ...editStudent, phone: e.target.value })
            }
          />

          <textarea
            value={editStudent.address}
            onChange={(e) =>
              setEditStudent({ ...editStudent, address: e.target.value })
            }
          />

          <button onClick={updateStudent} >Update</button>
          <button onClick={() => setEditStudent(null)}>Cancel</button>
        </div>
      )}
    </div>
  )
}

export default Students