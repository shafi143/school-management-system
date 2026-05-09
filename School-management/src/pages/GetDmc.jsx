import { useState } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import "../components/printall.css";

function DMC() {
  const [className, setClassName] = useState("");
  const [examId, setExamId] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadDMCs = async () => {
    if (!className || !examId) {
      alert("Please select class and exam");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/results/dmc/${className}/${examId}`
      );
      setStudents(res.data);
      setSelectedId(res.data[0]?.id ?? null);
    } catch (err) {
      console.log(err);
      alert("Error loading DMCs");
    } finally {
      setLoading(false);
    }
  };

  const selectedStudent = students.find((s) => s.id === Number(selectedId));

  const getGrade = (percentage) => {
    const p = Number(percentage);
    if (p >= 90) return "A+";
    if (p >= 80) return "A";
    if (p >= 70) return "B";
    if (p >= 60) return "C";
    if (p >= 50) return "D";
    return "F";
  };

  const downloadPDF = () => {
    if (!selectedStudent) return;

    const element = document.getElementById("print-area");

    html2pdf()
      .set({
        margin: [3, 3, 3, 3],
        filename: `DMC_${selectedStudent.name.replace(/\s+/g, "_")}_${className}.pdf`,
        html2canvas: {
          scale: 1,
          useCORS: true
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait"
        },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] }
      })
      .from(element)
      .save();
  };

  return (
    <div className="content">
      <h2>Single DMC Download</h2>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "15px" }}>
        <select
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="dropdown"
        >
          <option value="">Select Class</option>
          <option value="Play Group">Play Group</option>
          <option value="Nursery">Nursery</option>
          <option value="K.G">K.G</option>
          <option value="1st">1st</option>
          <option value="2nd">2nd</option>
          <option value="3rd">3rd</option>
          <option value="4th">4th</option>
          <option value="5th">5th</option>
          <option value="6th">6th</option>
          <option value="7th">7th</option>
          <option value="8th">8th</option>
        </select>

        <select
          value={examId}
          onChange={(e) => setExamId(e.target.value)}
          className="dropdown"
        >
          <option value="">Select Exam</option>
          <option value="1">First Term</option>
          <option value="2">Second Term</option>
          <option value="3">Final Term</option>
        </select>

        <button onClick={loadDMCs} style={{ marginTop: "0" }}>
          {loading ? "Loading..." : "Load Students"}
        </button>
      </div>

      {students.length > 0 && (
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "6px" }}>
            Select student for DMC:
          </label>
          <select
            value={selectedId || ""}
            onChange={(e) => setSelectedId(e.target.value)}
            className="dropdown"
          >
            <option value="">Select Student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.roll_no} - {s.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedStudent && (
        <>
          <div style={{ marginBottom: "15px" }}>
            <button onClick={downloadPDF} style={{ marginRight: "10px" }}>
              Download Single DMC
            </button>
            <button onClick={() => window.print()}>Print Preview</button>
          </div>

          <div id="print-area">
            <div className="dmc">
              <div className="dmc-header">
                <div className="dmc-serial-sect">
                  <p>Serial: SSHK{selectedStudent.id}</p>
                  <p>Reg#: 200425008924</p>
                </div>
              </div>

              <h1 className="school-name">
                SWAT SKY HAWK PUBLIC SCHOOL & COLLEGE KHWAZAKHELA UPPER SWAT
              </h1>

              <div className="dmc-body">
                <div className="info">
                  <p><b>Name:</b> {selectedStudent.name.toUpperCase()}</p>
                  <p><b>F.Name:</b> {selectedStudent.father_name?.toUpperCase() || "-"}</p>
                </div>

                <div>
                  <img src="/logo2.png" alt="logo" className="logo" />
                </div>

                <div className="info">
                  <p><b>Roll No:</b> {selectedStudent.roll_no}</p>
                  <p><b>Class:</b> {selectedStudent.class}</p>
                </div>
              </div>

              <h2>DETAIL MARKS CERTIFICATE</h2>
              <p>{examId === "1" ? "1ST TERM EXAMINATION" : examId === "2" ? "2ND TERM EXAMINATION" : examId === "3" ? "FINAL TERM EXAMINATION" : "EXAMINATION"} 2026</p>

              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Obtained</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedStudent.subjects.map((sub, idx) => (
                    <tr key={idx}>
                      <td>{sub.subject}</td>
                      <td>{sub.marks}</td>
                      <td>{sub.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="result">
                <div className="result-row">
                  <p><b>Percentage:</b> {selectedStudent.percentage}%</p>
                  <p><b>Grade:</b> {getGrade(selectedStudent.percentage)}</p>
                </div>
                <div className="result-row">
                  <p><b>Total Obtained:</b> {selectedStudent.total}</p>
                  <p><b>Total Marks:</b> {selectedStudent.full}</p>
                </div>
                <div className="result-row">
                  <p><b>Position:</b> {selectedStudent.position}</p>
                </div>
              </div>

              <div className="result-date">
                <p>checked by______________</p>
                <p><small>Date of prepared: {new Date().toLocaleDateString()}</small></p>
                <p><small>Date of Declaration: {new Date().toLocaleDateString()}</small></p>
                <p>NOTE: Error / Omission are subject to subsequent rectification.</p>
              </div>

              <div className="footer">
                <p>Controller of Examinations</p>
                <p>Principal: __________________</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DMC;
