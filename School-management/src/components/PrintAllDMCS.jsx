import { useState} from "react";
import axios from "axios";
import "./printall.css";

function PrintAllDMC({ className, examId }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [maxSubjects, setMaxSubjects] = useState(0);

  // 📥 Load DMCs
  const loadDMCs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/results/all/${className}/${examId}`
      );
       res.data.forEach((student, idx) => {
      console.log(`Student ${idx + 1}: ${student.name}`);
      student.subjects?.forEach(sub => {
        console.log(`  - ${sub.name}: Obtained=${sub.marks}, Total=${sub.total}`);
      });
    });
      setStudents(res.data || []);
      
      // Calculate max subjects
      let max = 0;
      res.data.forEach(student => {
        const subjectCount = (student.subjects || []).length;
        if (subjectCount > max) max = subjectCount;
      });
      setMaxSubjects(max);
      
      // Auto-enable compact mode if 7 or more subjects
      if (max >= 7) {
        setCompactMode(true);
      }
      
      console.log("DMC DATA loaded:", res.data?.length || 0, "students");
      console.log("Max subjects:", max);
    } catch (err) {
      console.log(err);
      alert("Error loading DMCs");
    } finally {
      setLoading(false);
    }
  };

  // 🏆 Grade System
  const getGrade = (percentage) => {
    const p = Number(percentage);
    if (p >= 90) return "A+";
    if (p >= 80) return "A";
    if (p >= 70) return "B";
    if (p >= 60) return "C";
    if (p >= 50) return "D";
    return "F";
  };

  // Get position class for badge styling
  const getPositionClass = (position) => {
    const pos = String(position).toLowerCase();
    if (pos === "1st" || pos === "1") return "position-1";
    if (pos === "2nd" || pos === "2") return "position-2";
    if (pos === "3rd" || pos === "3") return "position-3";
    return "";
  };

  // Calculate total marks helper
  const getTotalMarks = (subjects) => {
    return (subjects || []).reduce((sum, sub) => sum + (Number(sub.total) || 0), 0);
  };

  // Calculate total obtained helper
  const getTotalObtained = (subjects) => {
    return (subjects || []).reduce((sum, sub) => sum + (Number(sub.marks) || 0), 0);
  };

  // 📄 Print using window.print()
  const printPDF = () => {
    if (!students.length) {
      alert("Please load DMCs first");
      return;
    }

    setPrintLoading(true);

    const printContent = generatePrintHTML();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    printWindow.onload = () => {
      printWindow.print();
      setPrintLoading(false);
    };
  };

  // Generate HTML for printing
  const generatePrintHTML = () => {
    // Use special class for 7+ subjects
    const dmcClass = compactMode || maxSubjects >= 7 ? "dmc dmc-9subjects" : "dmc";
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>DMC_${className}</title>
        <meta charset="UTF-8">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: Arial, Helvetica, sans-serif;
            background: white;
            margin: 0;
            padding: 0;
          }
          
          .dmc {
            width: 190mm;
            min-height: 270mm;
            margin: 0 auto;
            padding: 12px;
            border: 2px solid black;
            box-sizing: border-box;
            background: white;
            text-align: center;
            page-break-after: always;
            page-break-inside: avoid;
            color: black;
            position: relative;
          }
          
          /* Compact for 7+ subjects - Optimized */
          .dmc-9subjects {
            padding: 10px 12px 5px 12px;
          }
          
          .dmc-9subjects .school-name {
            font-size: 20px;
            margin: 5px 0;
          }
          
          .dmc-9subjects .dmc-body {
            margin: 20px 0;
          }
          
          .dmc-9subjects .info p {
            margin: 3px 0;
            font-size: 12px;
          }
          
          .dmc-9subjects table th,
          .dmc-9subjects table td {
            padding: 6px 8px;
            font-size: 12px;
          }
          
          .dmc-9subjects .summary-cards {
            margin: 8px 0 5px 0;
            gap: 10px;
          }
          
          .dmc-9subjects .summary-card {
            padding: 6px 4px;
          }
          
          .dmc-9subjects .summary-card-value {
            font-size: 14px;
          }
          
          .dmc-9subjects .result-row {
            margin: 5px 0;
            padding: 5px 10px;
          }
          
          .dmc-9subjects .result-date {
            margin-top: 5px;
            margin-bottom: 0;
            padding-bottom: 0;
            font-size: 10px;
          }
          
          .dmc-9subjects .result-date p {
            margin: 2px 0;
          }
          
          .dmc-9subjects .footer {
            margin-top: 8px;
            margin-bottom: 0;
            padding-bottom: 0;
            font-size: 11px;
          }
          
          .school-name {
            color: red;
            font-weight: bold;
            font-size: 24px;
            letter-spacing: -1px;
            margin: 10px 0;
            font-family: cursive;
            text-align: center;
          }
          
          .logo {
            width: 120px;
            height: auto;
          }
          
          .dmc-header {
            width: 100%;
          }
          
          .dmc-serial-sect {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
          }
          
          .dmc-body {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 20px 0;
            gap: 15px;
          }
          
          .dmc h2 {
            text-align: center;
            color: black;
            margin: 10px 0 5px 0;
            font-size: 18px;
          }
          
          .info {
            flex: 1;
            color: black;
            text-align: center;
          }
          
          .info p {
            margin: 4px 0;
            font-size: 13px;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            margin-bottom: 5px;
            page-break-inside: avoid;
          }
          
          table th,
          table td {
            border: 1px solid black;
            padding: 8px 6px;
            text-align: center;
            font-size: 13px;
          }
          
          table td:first-child {
            text-align: left;
            font-weight: 500;
          }
          
          .table-total-row {
            background-color: #f5f5f5;
            font-weight: bold;
          }
          
          .table-total-row td {
            font-weight: bold;
            background-color: #f0f0f0;
            padding: 6px 6px;
          }
          
          .summary-cards {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            margin: 10px 0 8px 0;
          }
          
          .summary-card {
            flex: 1;
            padding: 8px 5px;
            background: #f0f0f0;
            border-radius: 6px;
            text-align: center;
            border: 1px solid #ddd;
          }
          
          .summary-card-label {
            font-size: 11px;
            color: #666;
            margin-bottom: 4px;
          }
          
          .summary-card-value {
            font-size: 16px;
            font-weight: bold;
            color: #000;
          }
          
          .result {
            margin-top: 5px;
            margin-bottom: 5px;
            page-break-inside: avoid;
          }
          
          .result-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 8px 0;
            padding: 6px 12px;
            background-color: #f9f9f9;
            border-radius: 5px;
          }
          
          .result-label {
            font-weight: bold;
            font-size: 14px;
            color: #333;
          }
          
          .position-badge {
            display: inline-block;
            padding: 4px 15px;
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            color: #000;
            font-weight: bold;
            font-size: 14px;
            border-radius: 20px;
            border: 1px solid #daa520;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          }
          
          .position-1 {
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            color: #b8860b;
          }
          
          .position-2 {
            background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
            color: #555;
          }
          
          .position-3 {
            background: linear-gradient(135deg, #cd7f32, #e8a870);
            color: #5c3a1e;
          }
          
          .result-date {
            margin-top: 8px;
            margin-bottom: 0;
            font-size: 11px;
            page-break-inside: avoid;
          }
          
          .result-date p {
            margin: 3px 0;
          }
          
          .footer {
            margin-top: 10px;
            margin-bottom: 0;
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            background: white;
            color: black;
            page-break-inside: avoid;
            font-size: 12px;
          }
          
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            
            .dmc {
              page-break-after: always;
              page-break-inside: avoid;
              margin: 0;
              padding: 10mm 10mm 5mm 10mm;
              border: 2px solid black;
            }
            
            .dmc:last-child {
              page-break-after: auto;
            }
            
            .school-name {
              font-size: 18px;
              margin: 5px 0;
            }
            
            .logo {
              width: 100px;
            }
            
            .info p {
              font-size: 11px;
              margin: 2px 0;
            }
            
            .dmc h2 {
              font-size: 16px;
              margin: 5px 0;
            }
            
            table th,
            table td {
              padding: 5px 4px;
              font-size: 11px;
            }
            
            .summary-card {
              padding: 4px;
            }
            
            .summary-card-label {
              font-size: 9px;
            }
            
            .summary-card-value {
              font-size: 12px;
            }
            
            .result-row {
              margin: 4px 0;
              padding: 4px 8px;
            }
            
            .result-label {
              font-size: 11px;
            }
            
            .position-badge {
              padding: 2px 10px;
              font-size: 11px;
            }
            
            .result-date {
              margin-top: 5px;
              font-size: 9px;
            }
            
            .result-date p {
              margin: 2px 0;
            }
            
            .footer {
              margin-top: 6px;
              font-size: 10px;
            }
            
            .dmc-header,
            .dmc-body,
            table,
            .result,
            .result-date,
            .footer {
              page-break-inside: avoid;
            }
            
            table tr {
              page-break-inside: avoid;
            }
          }
          
          @page {
            size: A4;
            margin: 8mm 10mm 5mm 10mm;
          }
        </style>
      </head>
      <body>
        ${students.map((s, index) => {
          const totalObtained = getTotalObtained(s.subjects);
          const totalMarks = getTotalMarks(s.subjects);
          const percentage = s.percentage || (totalMarks > 0 ? ((totalObtained / totalMarks) * 100).toFixed(2) : 0);
          const position = s.position || "N/A";
          const positionClass = getPositionClass(position);
          
          return `
          <div class="${dmcClass}" key="${s.id || index}">
            
            <!-- HEADER -->
            <div class="dmc-header">
              <div class="dmc-serial-sect">
                <p>Serial: SSHK${s.id || index + 1}</p>
                <p>Reg#: 200425008924</p>
              </div>
            </div>

            <!-- SCHOOL NAME -->
            <h1 class="school-name">
              SWAT SKY HAWK PUBLIC SCHOOL & COLLEGE KHWAZAKHELA UPPER SWAT
            </h1>

            <!-- BODY -->
            <div class="dmc-body">
              <div class="info">
                <p>Name:<b> ${(s.name || "N/A").toUpperCase()}</b></p>
                <p>F.Name: <b>${(s.father_name || "N/A").toUpperCase()}</b></p>
              </div>

              <img src="${window.location.origin}/logo2.png" alt="logo" class="logo" onerror="this.style.display='none'" />

              <div class="info">
                <p>Roll No:<b> ${s.roll_no || "N/A"}</b></p>
                <p>Class:<b> ${s.class || className}</b></p>
              </div>
            </div>

            <h2>DETAIL MARKS CERTIFICATE</h2>
            <p style="text-align:center; font-size:12px; margin-bottom:5px;">1ST TERM EXAMINATION 2026</p>

            <!-- TABLE with Total Row -->
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Obtained Marks</th>
                  <th>Total Marks</th>
                </tr>
              </thead>
              <tbody>
                ${(s.subjects || []).map(sub => `
                  <tr>
                    <td>${sub.name || "N/A"}</td>
                    <td>${sub.marks || 0}</td>
                    <td>${sub.total || 0}</td>
                  </tr>
                `).join('')}
                <tr class="table-total-row">
                  <td style="text-align:right; font-weight:bold;"><b>TOTAL</b></td>
                  <td style="font-weight:bold;">${totalObtained}</td>
                  <td style="font-weight:bold;">${totalMarks}</td>
                </tr>
              </tbody>
            </table>

            <!-- SUMMARY CARDS -->
            <div class="summary-cards">
              <div class="summary-card">
                <div class="summary-card-label">Total Obtained</div>
                <div class="summary-card-value">${totalObtained}</div>
              </div>
              <div class="summary-card">
                <div class="summary-card-label">Total Marks</div>
                <div class="summary-card-value">${totalMarks}</div>
              </div>
              <div class="summary-card">
                <div class="summary-card-label">Percentage</div>
                <div class="summary-card-value">${percentage}%</div>
              </div>
              <div class="summary-card">
                <div class="summary-card-label">Grade</div>
                <div class="summary-card-value">${getGrade(percentage)}</div>
              </div>
            </div>

            <!-- RESULT with Position Badge -->
            <div class="result">
              <div class="result-row">
                <span class="result-label">🎓 Position:</span>
                <span class="position-badge ${positionClass}">
                  ${position === "1st" ? "🥇 " : position === "2nd" ? "🥈 " : position === "3rd" ? "🥉 " : "🏅 "}${position}
                </span>
              </div>
            </div>

            <!-- FOOTER -->
            <div class="result-date">
              <p>Checked by: ______________</p>
              <p><small>Date: ${new Date().toLocaleDateString()}</small></p>
              <p><small>NOTE: Error / Omission are subject to subsequent rectification.</small></p>
            </div>

            <div class="footer">
              <p>Controller of Examinations</p>
              <p>Principal: __________________</p>
            </div>

          </div>
          `;
        }).join('')}
      </body>
      </html>
    `;
  };

  return (
    <div>
      {/* BUTTONS */}
      <button onClick={loadDMCs} style={{ margin: "5px", padding: "8px 16px" }}>
        {loading ? "Loading..." : "Load DMCs"}
      </button>

      <button 
        onClick={printPDF} 
        style={{ margin: "5px", padding: "8px 16px" }}
        disabled={!students.length || printLoading}
      >
        {printLoading ? "Preparing..." : `Print All (${students.length} DMCs)`}
      </button>

      {maxSubjects >= 7 && (
        <button 
          onClick={() => setCompactMode(!compactMode)} 
          style={{ margin: "5px", padding: "8px 16px", backgroundColor: compactMode ? "#4CAF50" : "#ff9800", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          {compactMode ? "✓ Compact Mode ON" : "⚠️ Compact Mode OFF"}
        </button>
      )}

      {/* Preview Area */}
      <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
        <h3>Loaded DMCs ({students.length}) {compactMode && "(Compact Mode Active)"}</h3>
        {students.length === 0 ? (
          <p style={{ color: "#999" }}>No DMCs loaded. Click "Load DMCs" first.</p>
        ) : (
          <div style={{ maxHeight: "300px", overflow: "auto" }}>
            {students.map((s, idx) => {
              const subCount = (s.subjects || []).length;
              return (
                <div key={idx} style={{ padding: "5px", borderBottom: "1px solid #eee" }}>
                  {idx + 1}. {s.name} - Roll No: {s.roll_no} - {subCount} subjects - Position: {s.position || "N/A"}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default PrintAllDMC;