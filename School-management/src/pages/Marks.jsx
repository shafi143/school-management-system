import { useState, useEffect } from "react";
import axios from "axios";

function Marks() {
  const [classes] = useState([
    "Play Group", "Nursery", "K.G",
    "1st", "2nd", "3rd", "4th",
    "5th", "6th", "7th", "8th"
  ]);

  const [selectedClass, setSelectedClass] = useState("");
  const [examId, setExamId] = useState("");
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [marksData, setMarksData] = useState({});
  const [loading, setLoading] = useState(false);

  // 📥 Load Exams
  const loadExams = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/marks/exams");
      setExams(res.data);
    } catch (err) {
      console.log("Exam Load Error:", err);
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  // 📥 Load Students + Subjects
const handleClassChange = async (cls) => {
  setSelectedClass(cls);

  // 🔥 reset previous data
  setStudents([]);
  setSubjects([]);
  setMarksData({});

  try {
    const studentsRes = await axios.get(
      `http://localhost:5000/api/students/class/${cls}`
    );

    const subjectsRes = await axios.get(
      `http://localhost:5000/api/subjects/${cls}`
    );

    setStudents(studentsRes.data);
    setSubjects(subjectsRes.data);

  } catch (err) {
    console.log("Load Error:", err);
    alert("Error loading data");
  }
};


  // 📥 LOAD EXISTING MARKS (🔥 AUTO-FILL)
  const loadMarks = async () => {
    if (!selectedClass || !examId) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/marks/class/${selectedClass}/exam/${examId}`
      );

      let formatted = {};

      res.data.forEach((item) => {
        const key = `${item.student_id}-${item.subject_id}`;
        formatted[key] = item.marks != null ? item.marks : "";
      });

      setMarksData(formatted);

    } catch (err) {
      console.log("Marks Load Error:", err);
    }
  };

  // 🔄 Reload marks when class OR exam changes
  useEffect(() => {
    loadMarks();
  }, [selectedClass, examId]);

  // ✍️ Handle input
  const handleMarksChange = (studentId, subjectId, value) => {
    setMarksData((prev) => ({
      ...prev,
      [`${studentId}-${subjectId}`]: value
    }));
  };

  const filledMarksEntries = Object.entries(marksData).filter(([, value]) =>
    value !== undefined && value !== null && value.toString().trim() !== ""
  );

  const canSave = selectedClass && examId && filledMarksEntries.length > 0;

  // 💾 SAVE MARKS (UPSERT)
  const saveMarks = async () => {
    if (!selectedClass || !examId) {
      alert("Please select Class and Exam");
      return;
    }

    const entriesToSave = Object.entries(marksData).filter(([, value]) =>
      value !== undefined && value !== null && value.toString().trim() !== ""
    );

    if (entriesToSave.length === 0) {
      alert("Please enter at least one mark before saving.");
      return;
    }

    try {
      setLoading(true);

      for (let [key, value] of entriesToSave) {
        const [studentId, subjectId] = key.split("-");
        const marks = Number(value);

        await axios.post("http://localhost:5000/api/marks", {
          student_id: Number(studentId),
          subject_id: Number(subjectId),
          exam_id: Number(examId),
          marks
        });
      }

      alert("✅ Marks Saved / Updated Successfully");
      await loadMarks();
    } catch (err) {
      console.log("Save Error:", err);
      alert("Error saving marks");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="content">
      <h2>Marks Entry System</h2>

      {/* 🎓 CLASS */}
      <select
        onChange={(e) => handleClassChange(e.target.value)}
        className="dropdown"
        value={selectedClass}
      >
        <option value="">Select Class</option>
        {classes.map((cls, i) => (
          <option key={i} value={cls}>{cls}</option>
        ))}
      </select>

      {/* 📝 EXAM */}
      <select
        value={examId}
        onChange={(e) => setExamId(e.target.value)}
        className="dropdown"
      >
        <option value="">Select Exam</option>
        {exams.map((exam) => (
          <option key={exam.id} value={exam.id}>
            {exam.name}
          </option>
        ))}
      </select>

      {/* 📊 TABLE */}
      {students.length > 0 && examId && (
        <table border="1" width="100%" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Student Name</th>
              {subjects.map((sub) => (
                <th key={sub.id}>{sub.name}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>

                {subjects.map((sub) => {
                  const key = `${student.id}-${sub.id}`;

                  return (
                    <td key={sub.id}>
                      <input
                        type="number"
                        value={marksData[key] ?? ""}
                        style={{ width: "60px" }}
                        min="0"
                        max="100"
                        onChange={(e) =>
                          handleMarksChange(
                            student.id,
                            sub.id,
                            e.target.value
                          )
                        }
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 💾 SAVE */}
      {students.length > 0 && examId && (
        <button
          style={{ marginTop: "20px" }}
          onClick={saveMarks}
          disabled={loading || !canSave}
        >
          {loading ? "Saving..." : "Save / Update Marks"}
        </button>
      )}
    </div>
  );
}

export default Marks;