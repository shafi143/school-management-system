const db = require("../config/db");

// ➕ Add Student
exports.addStudent = (req, res) => {
  const {
    roll_no,
    name,
    father_name,
    class: studentClass,
    section,
    gender,
    date_of_birth,
    phone,
    address
  } = req.body;

  const sql = `
    INSERT INTO students 
    (roll_no, name, father_name, class, section, gender, date_of_birth, phone, address)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [roll_no, name, father_name, studentClass, section, gender, date_of_birth, phone, address],
    (err, result) => {
      if (err) return res.status(500).send(err);

      res.json({
        message: "Student added successfully",
        id: result.insertId
      });
    }
  );
};

// 📥 Get All Students
exports.getStudents = (req, res) => {
  db.query("SELECT * FROM students", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
};

// ❌ Delete Student
exports.deleteStudent = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM students WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).send(err);

    res.json({ message: "Student deleted" });
  });
};

// ✏️ Update Student
exports.updateStudent = (req, res) => {
  const { id } = req.params;

  const {
    roll_no,
    name,
    father_name,
    class: studentClass,
    section,
    gender,
    date_of_birth,
    phone,
    address
  } = req.body;

  const sql = `
    UPDATE students 
    SET roll_no=?, name=?, father_name=?, class=?, section=?, gender=?, date_of_birth=?, phone=?, address=?
    WHERE id=?
  `;

  db.query(
    sql,
    [
      roll_no,
      name,
      father_name,
      studentClass,
      section,
      gender,
      date_of_birth,
      phone,
      address,
      id
    ],
    (err, result) => {
      if (err) return res.status(500).send(err);

      res.send({ message: "Student updated successfully" });
    }
  );
};
exports.getStudentsByClass = (req, res) => {
  const { className } = req.params;

  db.query(
    "SELECT * FROM students WHERE class = ?",
    [className],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    }
  );
};