import { useState } from "react";
import axios from "axios";
import DMC from "../components/DMC";
import PrintAllDMC from "../components/PrintAllDMCS";
import "./components.css"
function Result() {
  const [className, setClassName] = useState("");
  const [examId, setExamId] = useState("");
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAllDMC, setShowAllDMC] = useState(false);

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

  const viewDMC = (student) => {
    setSelectedStudent(student);
  };

  const saveDMC = async (student) => {
    try {
      await axios.post("http://localhost:5000/api/results/save", {
        className,
        examId,
        student
      });

      alert("DMC saved for " + student.name);
    } catch (err) {
      console.log(err);
      alert("Error saving DMC");
    }
  };

  // 🖨 OPEN ALL DMC
  const openAllDMC = () => {
    setShowAllDMC(true);
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
         

          <table border="1" cellPadding="10">
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
                <th>Action</th>
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

                  <td>
                    
                    <button onClick={() => viewDMC(s)} style={{margin:"5px"}}>View DMC</button>
                    <button onClick={() => saveDMC(s)} style={{margin:"5px"}}>Save</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
      {/* 👁 SINGLE DMC */}
      {selectedStudent && (
        <DMC
          student={selectedStudent}
          className={className}
          examId={examId}
          close={() => setSelectedStudent(null)}
        />
      )}

      {/* 📄 ALL DMC COMPONENT */}
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