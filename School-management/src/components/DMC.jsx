import html2pdf from "html2pdf.js";
import "./printall.css";

function DMC({ student, className, examId, close }) {
  if (!student) return null;

  const subjects = Object.entries(student.subjects || {});
  const subjectTotals = student.subjectTotals || {};
  const defaultSubjectTotal = subjects.length
    ? Math.round((student.full || subjects.length * 100) / subjects.length)
    : 100;

  const examLabel =
    examId === "1"
      ? "1ST TERM EXAMINATION"
      : examId === "2"
      ? "2ND TERM EXAMINATION"
      : examId === "3"
      ? "FINAL TERM EXAMINATION"
      : "EXAMINATION";

  const downloadPDF = () => {
    const element = document.getElementById("print-area");
    if (!element) return;

    html2pdf()
      .set({
        margin: [3, 3, 3, 3],
        filename: `DMC_${student.name.replace(/\s+/g, "_")}_${className}.pdf`,
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
    <div id="print-area" className="print-area">
      <div className="dmc">
        <div className="dmc-header">
          <div className="dmc-serial-sect">
            <p>Serial: SSHK{student.id}</p>
            <p>Reg#: 200425008924</p>
          </div>
        </div>

        <h1 className="school-name">
          SWAT SKY HAWK PUBLIC SCHOOL & COLLEGE KHWAZAKHELA UPPER SWAT
        </h1>

        <div className="dmc-body">
          <div className="info">
            <p><b>Name:</b> {student.name.toUpperCase()}</p>
            <p><b>F.Name:</b> {student.father_name?.toUpperCase() || "-"}</p>
          </div>

          <div>
            <img src="/logo2.png" alt="logo" className="logo" />
          </div>

          <div className="info">
            <p><b>Roll No:</b> {student.roll_no}</p>
            <p><b>Class:</b> {className}</p>
          </div>
        </div>

        <h2>DETAIL MARKS CERTIFICATE</h2>
        <p>{examLabel} 2026</p>

        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Obtained</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {subjects.map(([sub, mark], idx) => (
              <tr key={idx}>
                <td>{sub}</td>
                <td>{mark}</td>
                <td>{subjectTotals[sub] ?? defaultSubjectTotal}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="result">
          <div className="result-row">
            <p><b>Percentage:</b> {student.percentage}%</p>
            <p><b>Grade:</b> {student.position ? student.position : "-"}</p>
          </div>
          <div className="result-row">
            <p><b>Total Obtained:</b> {student.total}</p>
            <p><b>Total Marks:</b> {student.full || Object.values(subjectTotals).reduce((sum, t) => sum + t, 0) || defaultSubjectTotal * subjects.length}</p>
          </div>
          <div className="result-row">
            <p><b>Position:</b> {student.position}</p>
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

        <div className="dmc-actions">
          <button onClick={downloadPDF} style={{margin:"5px"}}>Download DMC</button>
          <button onClick={() => window.print()} style={{margin:"5px"}}>Print</button>
          <button onClick={close} style={{margin:"5px"}}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default DMC;