import { useState, useRef } from "react";
import axios from "axios";
import PrintAllDMC from "../components/PrintAllDMCS";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./components.css"
function Result() {
  const [className, setClassName] = useState("");
  const [examId, setExamId] = useState("");
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showAllDMC, setShowAllDMC] = useState(false);
  const tableRef = useRef(null);

  // 📊 LOAD RESULT
  const getResult = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/results/class/${className}/${examId}`
      );

      setStudents(res.data);
console.log("Class:", className);
console.log("Exam:", examId);
      if (res.data.length > 0) {
        setSubjects(Object.keys(res.data[0].subjects));
      }
    } catch (err) {
      console.log(err);
      alert("Error loading result");
    }
  };

  // 🖨 OPEN ALL DMC
  const openAllDMC = () => {
    setShowAllDMC(true);
  };

  // 📥 EXPORT TO PDF
  const exportToPDF = async () => {
    if (!tableRef.current) return;
    
    try {
      const canvas = await html2canvas(tableRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const position = margin;

      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
      pdf.save(`Class_${className}_Result_${examId}.pdf`);
      alert('PDF exported successfully!');
    } catch (err) {
      console.log(err);
      alert('Error exporting PDF');
    }
  };

  // 🖨 PRINT RESULT
  const printResult = async () => {
    if (!tableRef.current) return;
    
    try {
      const canvas = await html2canvas(tableRef.current);
      const imgData = canvas.toDataURL('image/png');
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Class ${className} Result</title>
            <style>
              body { margin: 10px; }
              h2 { text-align: center; }
              img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>
            <h2>Class ${className} - Result</h2>
            <img src="${imgData}" />
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    } catch (err) {
      console.log(err);
      alert('Error printing result');
    }
  };

  return (
    <div className="content">
      <h2>Class Result</h2>

      {/* CLASS */}
   <select onChange={(e) => setClassName(e.target.value)} className="dropdown">
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

<select onChange={(e) => setExamId(e.target.value)} className="dropdown">
  <option value="">Select Exam</option>
  <option value="1">First Term</option>
  <option value="2">Second Term</option>
  <option value="3">Final Term</option>
</select>
      <button onClick={getResult} style={{margin:"5px"}}>Show Result</button>

      {/* 📊 TABLE */}
      {students.length > 0 && (
        <>
         

          <table ref={tableRef} border="1" cellPadding="10">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>

                {subjects.map((sub, i) => (
                  <th key={i}>{sub}</th>
                ))}

                <th>Total Obtained</th>
                <th>Total Marks</th>
                <th>Percentage</th>
                <th>Position</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s, i) => (
                <tr key={i}>
                  <td>{s.roll_no}</td>
                  <td>{s.name}</td>

                  {subjects.map((sub, j) => (
                    <td key={j}>{s.subjects[sub] || "-"}</td>
                  ))}

                  <td>{s.total}</td>
                  <td>{s.full}</td>
                  <td>{s.percentage}%</td>
                  <td>{s.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{marginTop:"10px"}}>
            <button onClick={exportToPDF} style={{margin:"5px", background:"orange", color:"white"}}>📥 Export to PDF</button>
            <button onClick={printResult} style={{margin:"5px", background:"purple", color:"white"}}>🖨 Print Result</button>
          </div>
        </>
      )}
{students.length > 0 && (
   <button
            onClick={openAllDMC}
            style={{ margin: "10px 0", background: "green", color: "white" }}
          >
            Print All DMCs
          </button>
  )}

      {/*  ALL DMC COMPONENT */}
      {showAllDMC && (
        <PrintAllDMC
          className={className}
          examId={examId}
          onClose={() => setShowAllDMC(false)}
        />
      )}
    </div>
  );
}

export default Result;