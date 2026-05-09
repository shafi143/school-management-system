import { useState, useEffect } from 'react'
import axios from 'axios'
import "./student.css"

function Students() {
  const [students, setStudents] = useState([])

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

  const [newStudent, setNewStudent] = useState({
    roll_no: "",
    name: "",
    father_name: "",
    class: "",
    section: "",
    gender: "",
    date_of_birth: "",
    phone: "",
    address: ""
  })

  // 📥 Fetch students from backend
  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students")
      setStudents(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  // ➕ Add student (API)
  const addStudent = async () => {
    const {
      roll_no,
      name,
      father_name,
      class: studentClass,
      section,
      gender,
      date_of_birth,
      phone,
      address
    } = newStudent

    if (roll_no && name && studentClass) {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/students",
          {
            roll_no,
            name,
            father_name,
            class: studentClass,
            section,
            gender,
            date_of_birth,
            phone,
            address
          }
        )

        alert(res.data.message)

        // reset form
        setNewStudent({
          roll_no: "",
          name: "",
          father_name: "",
          class: "",
          section: "",
          gender: "",
          date_of_birth: "",
          phone: "",
          address: ""
        })

        fetchStudents()
      } catch (error) {
        console.log(error)
        alert("Error adding student")
      }
    } else {
      alert("Roll No, Name and Class are required")
    }
  }

  return (
    <div className="content">
      <h2>Students Management System</h2>

      {/* FORM */}
      <div className="form-section">
        <h3>Add Student</h3>
<div>


        <input
          placeholder="Roll No"
          value={newStudent.roll_no}
          onChange={(e) =>
            setNewStudent({ ...newStudent, roll_no: e.target.value })
          }
        />

        <input
          placeholder="Name"
          value={newStudent.name}
          onChange={(e) =>
            setNewStudent({ ...newStudent, name: e.target.value })
          }
        />

        <input
          placeholder="Father Name"
          value={newStudent.father_name}
          onChange={(e) =>
            setNewStudent({ ...newStudent, father_name: e.target.value })
          }
        />

        {/* CLASS DROPDOWN */}
        <select
          value={newStudent.class}
          onChange={(e) =>
            setNewStudent({ ...newStudent, class: e.target.value })
          }
          className='dropdown'
        >
          <option value="">Select Class</option>
          {classes.map((cls, index) => (
            <option key={index} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        <select
  value={newStudent.section}
  onChange={(e) =>
    setNewStudent({ ...newStudent, section: e.target.value })
  }
  className='dropdown'
>
  <option value="">Select Section</option>
  <option value="Boys">Boys</option>
  <option value="Girls">Girls</option>
</select>

        <select
  value={newStudent.gender}
  onChange={(e) =>
    setNewStudent({ ...newStudent, gender: e.target.value })
  }
  className='dropdown'
>
  <option value="">Select Gender</option>
  <option value="Male">Male</option>
  <option value="Female">Female</option>
</select>
<label>Date of Birth:</label>
        <input
     style={{width:"50%"}}
          type="date"
          value={newStudent.date_of_birth}
          onChange={(e) =>
            setNewStudent({ ...newStudent, date_of_birth: e.target.value })
          }
        />

        <input
          placeholder="Phone"
          value={newStudent.phone}
          onChange={(e) =>
            setNewStudent({ ...newStudent, phone: e.target.value })
          }
        />

        <textarea
          placeholder="Address"
          value={newStudent.address}
          className="address"
          onChange={(e) =>
            setNewStudent({ ...newStudent, address: e.target.value })
          }
        />
</div>
        <button onClick={addStudent}>Add Student</button>
      </div>

      {/* TABLE */}
      <div className="list-section">
        <h3>Student List</h3>

        <table border="1" width="100%">
          <thead>
            <tr>
              <th>Serial no</th>
              <th>Roll No</th>
              <th>Name</th>
              <th>Father Name</th>
              <th>Class</th>
              <th>Section</th>
              <th>Gender</th>
              <th>DOB</th>
              <th>Phone</th>
              <th>Address</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>SSHK{student.id}</td>
                <td>{student.roll_no}</td>
                <td>{student.name}</td>
                <td>{student.father_name}</td>
                <td>{student.class}</td>
                <td>{student.section}</td>
                <td>{student.gender}</td>
                <td>{student.date_of_birth}</td>
                <td>{student.phone}</td>
                <td>{student.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Students