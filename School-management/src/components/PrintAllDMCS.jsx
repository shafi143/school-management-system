import html2pdf from "html2pdf.js";
import { useState } from "react";
import axios from "axios";
import "./printall.css";

function PrintAllDMC({ className, examId }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadDMCs = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:5000/api/results/all/${className}/${examId}`
      );

      setStudents(res.data);
    } catch (err) {
      alert("Error loading DMCs");
    } finally {
      setLoading(false);
    }
  };

  const printPDF = () => {
  const element = document.getElementById("print-area");

  html2pdf()
    .set({
      margin: [3, 3, 3, 3], // 🔥 reduce margin
      filename: `DMC_${className}.pdf`,
      html2canvas: {
        scale: 1, // 🔥 reduce size (was 2)
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
const getGrade = (percentage) => {
  const p = Number(percentage);

  if (p >= 90) return "A+";
  if (p >= 80) return "A";
  if (p >= 70) return "B";
  if (p >= 60) return "C";
  if (p >= 50) return "D";
  return "F";
};
  return (
    <div>

      <button onClick={loadDMCs} style={{margin:"5px"}}>
        {loading ? "Loading..." : "Load DMCs"}
      </button>

      <button onClick={printPDF} style={{margin:"5px"}}>Print All</button>

      {/* 📄 DMC DESIGN */}
      <div id="print-area">

        {students.map((s, i) => (
          <div className="dmc" key={i}>

            {/* HEADER */}
            <div className="dmc-header">
              <div className="dmc-serial-sect">
  <p>Serial: SSHK{s.id}</p>
  <p>Reg#: 200425008924</p>

              </div>
             
            </div>

 <h1 className="school-name">
              SWAT SKY HAWK PUBLIC SCHOOL & COLLEGE KHWAZAKHELA UPPER SWAT
            </h1>
<div className="dmc-body">
           <div className="info">
              <p><b>Name:</b> {s.name.toUpperCase()}</p>
              <p><b>F.Name:</b> {s.father_name.toUpperCase()}</p>
            </div>  
<div>

            <img src="/logo2.png" alt="logo" className="logo" />

           
</div>

            {/* STUDENT INFO */}
           
            <div className="info">
  <p>Class No: {s.roll_no}</p>
              <p><b>Class:</b> {s.class}</p>

            </div>
              

</div>
            <h2>DETAIL MARKS CERTIFICATE</h2>
            <p>1ST TERM EXAMINATION 2026</p>

            {/* TABLE */}
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Obtained</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {s.subjects.map((sub, idx) => (
                  <tr key={idx}>
                    <td>{sub.name}</td>
                    <td>{sub.marks}</td>
                    <td>{sub.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* RESULT */}
           <div className="result">

  

  <div className="result-row">
    <p><b>Percentage:</b> {s.percentage}%</p>
    <p><b>Grade:</b> {getGrade(s.percentage)}</p>
  </div>
<div className="result-row">
    <p><b>Total Obtained:</b> {s.total}</p>
    <p><b>Total Marks:</b> {s.subjects.reduce((a, b) => a + b.total, 0)}</p>
  </div>
  <div className="result-row">
    <p><b>Position:</b> {s.position}</p>
  </div>

</div>
<div className="result-date">
  <p>checked by______________</p>
  <p><small>Date of prepared: {new Date().toLocaleDateString()}</small></p>
  <p><small>Date of Declaration: {new Date().toLocaleDateString()}</small></p>
  <p>NOTE: Error / Omission are subject to subsequent rectification.					
</p>
</div>
            {/* FOOTER */}
            <div className="footer">
              <p>Controller of Examinations</p>
              <p>Principal: __________________</p>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default PrintAllDMC;