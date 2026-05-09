import { useState, useEffect } from 'react'
import axios from 'axios'
import "./fees.css"

function Fees() {
  const [fees, setFees] = useState([])
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState("")
  const [feesSummary, setFeesSummary] = useState([])
  const [loading, setLoading] = useState(false)

  // ➕ ASSIGN FEES FORM
  const [assignFees, setAssignFees] = useState({
    student_id: "",
    amount: "",
    due_date: "",
    notes: ""
  })

  // 💰 PAYMENT FORM
  const [paymentData, setPaymentData] = useState({
    fee_id: "",
    amount: "",
    paid_date: "",
    notes: ""
  })

  const [paymentFees, setPaymentFees] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})

  // 📥 Fetch all fees records
  useEffect(() => {
    fetchFees()
    fetchStudents()
    fetchFeesSummary()
    loadPendingFees()
  }, [])

  const fetchFees = async () => {
    try {
      setLoading(true)
      const res = await axios.get("http://localhost:5000/api/fees")
      setFees(res.data)
    } catch (error) {
      console.log(error)
      alert("Error fetching fees")
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students")
      setStudents(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchFeesSummary = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/fees/summary/all")
      setFeesSummary(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  // ➕ Assign Fees to Student
  const handleAssignFees = async () => {
    if (!assignFees.student_id || !assignFees.amount || !assignFees.due_date) {
      alert("Please fill all required fields")
      return
    }

    try {
      const res = await axios.post("http://localhost:5000/api/fees", {
        student_id: assignFees.student_id,
        amount: assignFees.amount,
        due_date: assignFees.due_date,
        paid_date: null,
        status: "pending",
        payment_method: null,
        notes: assignFees.notes
      })
      alert(res.data.message)
      setAssignFees({
        student_id: "",
        amount: "",
        due_date: "",
        notes: ""
      })
      fetchFees()
      fetchFeesSummary()
    } catch (error) {
      console.log(error)
      alert("Error assigning fees")
    }
  }

  // 💰 Record Payment
  const handleRecordPayment = async () => {
    if (!paymentData.fee_id || !paymentData.paid_date || !paymentData.amount) {
      alert("Please select fee, amount, and paid date")
      return
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/fees/${paymentData.fee_id}`,
        {
          status: "paid",
          amount: paymentData.amount,
          paid_date: paymentData.paid_date,
          payment_method: "Cash",
          notes: paymentData.notes
        }
      )
      alert(res.data.message)
      setPaymentData({
        fee_id: "",
        amount: "",
        paid_date: "",
        notes: ""
      })
      fetchFees()
      fetchFeesSummary()
      loadPendingFees()
    } catch (error) {
      console.log(error)
      alert("Error recording payment")
    }
  }

  // 📥 Load Pending Fees
  const loadPendingFees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/fees")
      const pending = res.data.filter(f => f.status === "pending")
      setPaymentFees(pending)
    } catch (error) {
      console.log(error)
    }
  }

  // ✏️ Update fees record (only for admin adjustments)
  const updateFees = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/fees/${id}`,
        editData
      )
      alert(res.data.message)
      setEditingId(null)
      setEditData({})
      fetchFees()
      fetchFeesSummary()
    } catch (error) {
      console.log(error)
      alert("Error updating fees")
    }
  }

  // ❌ Delete fees record
  const deleteFees = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        const res = await axios.delete(`http://localhost:5000/api/fees/${id}`)
        alert(res.data.message)
        fetchFees()
        fetchFeesSummary()
        loadPendingFees()
      } catch (error) {
        console.log(error)
        alert("Error deleting fees")
      }
    }
  }

  // 🔍 Filter fees by student
  const filteredFees = selectedStudent
    ? fees.filter(f => f.student_id == selectedStudent)
    : fees

  const getStudentName = (id) => {
    const student = students.find(s => s.id == id)
    return student ? student.name : "Unknown"
  }

  const getStudentDetails = (id) => {
    const student = students.find(s => s.id == id)
    return student
      ? `${student.roll_no} | Class: ${student.class} | Section: ${student.section}`
      : "Unknown"
  }

  const totalAssigned = fees.reduce((sum, fee) => sum + Number(fee.amount || 0), 0)
  const totalReceived = fees.reduce(
    (sum, fee) => sum + (fee.status === "paid" ? Number(fee.amount || 0) : 0),
    0
  )
  const totalPendingAmount = fees.reduce(
    (sum, fee) => sum + (fee.status !== "paid" ? Number(fee.amount || 0) : 0),
    0
  )
  const totalRemaining = totalAssigned - totalReceived
  const receivedCount = fees.filter(fee => fee.status === "paid").length
  const remainingCount = fees.filter(fee => fee.status !== "paid").length
  const allRecordsCount = fees.length

  return (
    <div className="fees-container">
      <h2>💰 Student Fees Management</h2>
      <div className="fees-overview">
        <div className="overview-card">
          <strong>Total Fees</strong>
          <span>PKR {totalAssigned}</span>
        </div>
        <div className="overview-card">
          <strong>Received Amount</strong>
          <span>PKR {totalReceived}</span>
        </div>
        <div className="overview-card">
          <strong>Total Pending</strong>
          <span>PKR {totalPendingAmount}</span>
        </div>
        <div className="overview-card">
          <strong>Fees Received</strong>
          <span>{receivedCount}</span>
        </div>
        <div className="overview-card">
          <strong>All Fee Records</strong>
          <span>{allRecordsCount}</span>
        </div>
      </div>
      <div className="fees-balance-note">
        <strong>Balance:</strong> Total Fees - Received Amount = PKR {totalRemaining}
      </div>

      <div className="fees-sections">
        {/* ➕ SECTION 1: ASSIGN FEES */}
        <div className="fees-section">
          <div className="section-header">
            <h3>📝 Section 1: Assign Fees to Students</h3>
            <p>Add fees for students with due dates</p>
          </div>

          <div className="fees-form">
            <div className="form-group">
              <label>Student *</label>
              <select
                value={assignFees.student_id}
                onChange={(e) =>
                  setAssignFees({ ...assignFees, student_id: e.target.value })
                }
              >
                <option value="">-- Select Student --</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} (Roll: {student.roll_no} | Class: {student.class})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Amount *</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={assignFees.amount}
                  onChange={(e) =>
                    setAssignFees({ ...assignFees, amount: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Due Date *</label>
                <input
                  type="date"
                  value={assignFees.due_date}
                  onChange={(e) =>
                    setAssignFees({ ...assignFees, due_date: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                placeholder="e.g., Monthly fees, Quarterly fees"
                value={assignFees.notes}
                onChange={(e) =>
                  setAssignFees({ ...assignFees, notes: e.target.value })
                }
              />
            </div>

            <button onClick={handleAssignFees} className="btn-primary">
              ➕ Assign Fees
            </button>
          </div>
        </div>

        {/* 💰 SECTION 2: RECORD PAYMENT */}
        <div className="fees-section">
          <div className="section-header">
            <h3>💵 Section 2: Record Payment</h3>
            <p>Mark fees as paid by cash</p>
          </div>

          <div className="fees-form">
            <div className="form-group">
              <label>Select Pending Fee *</label>
              <select
                value={paymentData.fee_id}
                onChange={(e) => {
                  const selectedId = e.target.value
                  const selectedFee = paymentFees.find(fee => fee.id.toString() === selectedId)
                  setPaymentData({
                    fee_id: selectedId,
                    amount: selectedFee ? selectedFee.amount : "",
                    paid_date: paymentData.paid_date,
                    notes: paymentData.notes
                  })
                }}
              >
                <option value="">-- Select Pending Fee --</option>
                {paymentFees.map((fee) => (
                  <option key={fee.id} value={fee.id}>
                    {getStudentName(fee.student_id)} - PKR {fee.amount} (Due: {fee.due_date})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Payment Date *</label>
                <input
                  type="date"
                  value={paymentData.paid_date}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, paid_date: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Amount (PKR) *</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Enter received amount"
                  value={paymentData.amount}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, amount: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                placeholder="e.g., Payment received, Reference number"
                value={paymentData.notes}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, notes: e.target.value })
                }
              />
            </div>

            <button onClick={handleRecordPayment} className="btn-success">
              💳 Record Payment
            </button>
          </div>
        </div>
      </div>

      {/* 📊 FEES SUMMARY */}
      <div className="fees-summary">
        <h3>💰 Fees Summary</h3>
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Total Paid</th>
              <th>Total Pending</th>
              <th>Total Fees</th>
            </tr>
          </thead>
          <tbody>
            {feesSummary.length > 0 ? (
              feesSummary.map((summary) => (
                <tr key={summary.student_id}>
                  <td>{summary.student_id}</td>
                  <td className="paid">PKR {summary.total_paid || 0}</td>
                  <td className="pending">PKR {summary.total_pending || 0}</td>
                  <td className="total">PKR {summary.total_fees || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No fees data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔍 FILTER */}
      <div className="filter-section">
        <label>Filter by Student:</label>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          <option value="">-- All Students --</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
      </div>

      {/* 📋 ALL FEES LIST */}
      <div className="fees-list">
        <h3>📋 All Fees Records {selectedStudent && `- ${getStudentName(selectedStudent)}`}</h3>
        {loading ? (
          <p>Loading...</p>
        ) : fees.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Details</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Paid Date</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(selectedStudent
                ? fees.filter(f => f.student_id == selectedStudent)
                : fees
              ).map((fee) => (
                <tr key={fee.id}>
                  <td>{fee.id}</td>
                  <td>{getStudentName(fee.student_id)}</td>
                  <td>{getStudentDetails(fee.student_id)}</td>
                  <td>PKR {fee.amount}</td>
                  <td>
                    <span className={`status ${fee.status}`}>
                      {fee.status}
                    </span>
                  </td>
                  <td>{fee.due_date}</td>
                  <td>{fee.paid_date || "-"}</td>
                  <td>{fee.notes || "-"}</td>
                  <td>
                    <button
                      onClick={() => deleteFees(fee.id)}
                      className="btn-delete"
                    >
                      ❌ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No fees records found</p>
        )}
      </div>
    </div>
  )
}

export default Fees
