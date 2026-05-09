const db = require("../config/db");

// 📥 GET ALL SUBJECTS (FOR CHECKBOX LIST)
exports.getAllSubjects = (req, res) => {
  db.query("SELECT * FROM subjects", (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
};

// ➕ ASSIGN MULTIPLE SUBJECTS TO CLASS
exports.assignSubjectsToClass = (req, res) => {
  const { class_name, subject_ids } = req.body;

  const values = subject_ids.map((id) => [class_name, id]);

  const sql = `
    INSERT INTO class_subjects (class_name, subject_id)
    VALUES ?
  `;

  db.query(sql, [values], (err) => {
    if (err) return res.status(500).send(err);

    res.send({ message: "Subjects assigned to class" });
  });
};

// 📥 GET CLASS SUBJECTS (ACTIVE ONLY)
exports.getSubjectsByClass = (req, res) => {
  const { className } = req.params;

  const sql = `
    SELECT s.id, s.name
    FROM class_subjects cs
    JOIN subjects s ON cs.subject_id = s.id
    WHERE cs.class_name = ?
  `;

  db.query(sql, [className], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    res.send(result);
  });
};