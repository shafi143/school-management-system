const db = require("../config/db");

// ➕ Add Marks
exports.addMarks = (req, res) => {
  const { student_id, subject_id, exam_id, marks, total_marks } = req.body;

  const sanitizedMarks = marks == null ? 0 : marks;
  const sanitizedTotal = total_marks == null ? 100 : total_marks;

  const updateSql = `
    UPDATE marks
    SET marks = ?, total_marks = ?
    WHERE student_id = ? AND subject_id = ? AND exam_id = ?
  `;

  db.query(
    updateSql,
    [sanitizedMarks, sanitizedTotal, student_id, subject_id, exam_id],
    (err, result) => {
      if (err) {
        console.log("SQL ERROR:", err);
        return res.status(500).send(err);
      }

      if (result.affectedRows > 0) {
        return res.send({ message: "Marks updated successfully" });
      }

      const insertSql = `
        INSERT INTO marks 
        (student_id, subject_id, exam_id, marks, total_marks)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(
        insertSql,
        [student_id, subject_id, exam_id, sanitizedMarks, sanitizedTotal],
        (insertErr) => {
          if (insertErr) {
            console.log("SQL ERROR:", insertErr);
            return res.status(500).send(insertErr);
          }

          res.send({ message: "Marks added successfully" });
        }
      );
    }
  );
};

// 📊 Get Result (DMC)
exports.getResult = (req, res) => {
  const { student_id, exam_id } = req.params;

  const sql = `
    SELECT 
      students.name,
      students.roll_no,
      subjects.name AS subject,
      marks.marks
    FROM marks
    JOIN students ON students.id = marks.student_id
    JOIN subjects ON subjects.id = marks.subject_id
    WHERE marks.student_id = ? AND marks.exam_id = ?
  `;

  db.query(sql, [student_id, exam_id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
};
exports.getExam = (req, res) => {
  db.query("SELECT * FROM exams", (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    });
}
// controllers/marksController.js

exports.getMarksByClassAndExam = (req, res) => {
  const { className, exam_id } = req.params;

  const sql = `
    SELECT 
      s.id AS student_id,
      sub.id AS subject_id,
      MAX(m.marks) AS marks,
      MAX(m.total_marks) AS total_marks
    FROM students s
    JOIN class_subjects cs ON cs.class_name = s.class
    JOIN subjects sub ON sub.id = cs.subject_id
    LEFT JOIN marks m 
      ON m.student_id = s.id 
      AND m.subject_id = sub.id 
      AND m.exam_id = ?
    WHERE s.class = ?
    GROUP BY s.id, sub.id
  `;

  db.query(sql, [exam_id, className], (err, result) => {
    if (err) return res.status(500).send(err);

    res.send(result);
  });
};