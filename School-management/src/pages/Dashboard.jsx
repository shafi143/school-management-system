import { useEffect, useState } from 'react'
import './dashboard.css'

function Dashboard({ students = [], classes = [] }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
  let start = 0
  const end = students.length

  if (end === 0) return

  const duration = 1000 // 1 second
  const incrementTime = Math.floor(duration / end)

  const timer = setInterval(() => {
    start += 1
    setCount(start)

    if (start === end) clearInterval(timer)
  }, incrementTime)

  return () => clearInterval(timer)
}, [students])
  return (
    <div className="dashboard">

      <h2>Dashboard</h2>

      {/* STATS */}
      <div className="stats">

        <div className="stat-card">
          <h3>Total Students</h3>
          <p>{count}</p>
        </div>

        <div className="stat-card">
          <h3>Total Teachers</h3>
          <p>12</p>
        </div>

        <div className="stat-card">
          <h3>Courses</h3>
          <p>45</p>
        </div>

        <div className="stat-card">
          <h3>Classes</h3>
          <p>{classes.length}</p>
        </div>

      </div>

      {/* ACTIVITIES */}
      <div className="recent-activities">
        <h3>Recent Activities</h3>
        <ul>
          <li>
            New student enrolled:{" "}
            <b>{students[students.length - 1]?.name || "None"}</b>
          </li>
          <li>Teacher meeting scheduled</li>
          <li>Exam results published</li>
        </ul>
      </div>

    </div>
  )
}

export default Dashboard