const db = require("../config/db");

exports.getClassResult = (req, res) => {
  const { className, exam_id } = req.params;

  const sql = `
    SELECT 
      s.id,
      s.name,
      s.father_name,
      s.roll_no,
      sub.name AS subject,
      MAX(m.marks) AS marks,
      MAX(m.total_marks) AS total_marks
    FROM students s
    JOIN marks m ON s.id = m.student_id
    JOIN subjects sub ON sub.id = m.subject_id
    WHERE s.class = ? AND m.exam_id = ?
    GROUP BY s.id, s.name, s.father_name, s.roll_no, sub.id, sub.name
  `;

  const isClass8 = className === "8" || className === "8th" || className === "Class 8";

  db.query(sql, [className, exam_id], (err, results) => {
    if (err) return res.status(500).send(err);

    let map = {};

    // 🔁 Group by student
    results.forEach((row) => {
      if (!map[row.id]) {
        map[row.id] = {
          id: row.id,
          name: row.name,
          father_name: row.father_name,
          roll_no: row.roll_no,
          subjects: {},
          subjectTotals: {},
          total: 0,
          full: 0,
        };
      }

      let subjectTotal = row.total_marks;
      if (isClass8) {
        const fiftySubjects = ["Quran Study", "Pakistan Study", "Islamiyat"];

        if (fiftySubjects.includes(row.subject)) {
          subjectTotal = 50;
        } else {
          subjectTotal = 75;
        }
      }

      map[row.id].subjects[row.subject] = row.marks;
      map[row.id].subjectTotals[row.subject] = subjectTotal;
      map[row.id].total += row.marks;
      map[row.id].full += subjectTotal;
    });

    let students = Object.values(map);

    // 🏆 Sort by total
    students.sort((a, b) => b.total - a.total);

    // 🎯 Add position + percentage
    students.forEach((s, index) => {
      s.position = index + 1;
      s.percentage = ((s.total / s.full) * 100).toFixed(2);
    });

    res.send(students);
  });
};

exports.getDMC = (req, res) => {
  const { className, exam_id } = req.params;

  const sql = `
    SELECT 
      s.id,
      s.name,
      s.father_name,
      s.roll_no,
      s.class,
      sub.name AS subject,
      MAX(m.marks) AS marks,
      MAX(m.total_marks) AS total_marks
    FROM students s
    JOIN marks m ON s.id = m.student_id
    JOIN subjects sub ON sub.id = m.subject_id
    WHERE s.class = ? AND m.exam_id = ?
    GROUP BY s.id, s.name, s.father_name, s.roll_no, s.class, sub.id, sub.name
    ORDER BY s.id
  `;

  db.query(sql, [className, exam_id], (err, results) => {
    if (err) return res.status(500).send(err);

    let studentsMap = {};

    const isClass8 =
      className === "8" ||
      className === "8th" ||
      className === "Class 8";

    results.forEach((row) => {
      if (!studentsMap[row.id]) {
        studentsMap[row.id] = {
          id: row.id,
          name: row.name,
          father_name: row.father_name,
          roll_no: row.roll_no,
          class: row.class,
          subjects: [],
          total: 0,
          full: 0,
        };
      }

      // SUBJECT TOTAL LOGIC (IMPORTANT FIX)
      let subjectTotal = row.total_marks;

      if (isClass8) {
        const fiftySubjects = [
          "Quran Study",
          "Pakistan Study",
          "Islamiyat",
        ];

        if (fiftySubjects.includes(row.subject)) {
          subjectTotal = 50;
        } else {
          subjectTotal = 75;
        }
      }

      // PUSH SUBJECT
      studentsMap[row.id].subjects.push({
        subject: row.subject,
        marks: row.marks,
        total: subjectTotal,
      });

      // TOTAL OBTAINED
      studentsMap[row.id].total += row.marks;

      // FULL MARKS (FIXED)
      studentsMap[row.id].full += subjectTotal;
    });

    let students = Object.values(studentsMap);

    // POSITION SORT
    students.sort((a, b) => b.total - a.total);

    let position = 1;
    let lastMarks = null;

    students = students.map((s, index) => {
      if (lastMarks !== null && s.total < lastMarks) {
        position = index + 1;
      }
      lastMarks = s.total;

      return {
        ...s,
        percentage: ((s.total / s.full) * 100).toFixed(2),
        position,
      };
    });

    res.send(students);
  });
};
exports.saveDMC = (req, res) => {
  const { className, examId, data } = req.body;

  const sql = `
    INSERT INTO dmc_records (class_name, exam_id, data)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [className, examId, JSON.stringify(data)], (err) => {
    if (err) return res.status(500).send(err);

    res.send({ message: "DMC saved" });
  });
};
exports.getAllDMC = (req, res) => {
  const { className, exam_id } = req.params;

  const sql = `
    SELECT 
      s.id,
      s.name,
      s.father_name,
      s.roll_no,
      s.class,
      sub.name AS subject,
      MAX(m.marks) AS marks,
      MAX(m.total_marks) AS total_marks
    FROM students s
    JOIN marks m ON s.id = m.student_id
    JOIN subjects sub ON sub.id = m.subject_id
    WHERE s.class = ? AND m.exam_id = ?
    GROUP BY s.id, s.name, s.father_name, s.roll_no, s.class, sub.id, sub.name
    ORDER BY s.id
  `;

  db.query(sql, [className, exam_id], (err, results) => {

    if (err) {
      return res.status(500).send(err);
    }

    let students = {};

    results.forEach((row) => {

      if (!students[row.id]) {

        students[row.id] = {
          id: row.id,
          name: row.name,
          father_name: row.father_name,
          roll_no: row.roll_no,
          class: row.class,
          subjects: [],
          total: 0,
          full: 0,
        };

      }

      // SUBJECT TOTAL LOGIC
      let subjectTotal = row.total_marks;

      if (className === "8th") {

        const fiftySubjects = [
          "Quran Study",
          "Pakistan Study",
          "Islamiyat",
        ];

        if (fiftySubjects.includes(row.subject)) {
          subjectTotal = 50;
        } else {
          subjectTotal = 75;
        }

      }

      // PUSH SUBJECTS
      students[row.id].subjects.push({
        name: row.subject,
        marks: row.marks,
        total: subjectTotal,
      });

      // OBTAINED TOTAL
      students[row.id].total += row.marks;

      // FULL TOTAL
      students[row.id].full += subjectTotal;

    });

    let arr = Object.values(students);

    // SORT BY TOTAL
    arr.sort((a, b) => b.total - a.total);

    // POSITION LOGIC
    let position = 1;
    let lastMarks = null;

    arr = arr.map((s, index) => {

      if (lastMarks !== null && s.total < lastMarks) {
        position = index + 1;
      }

      lastMarks = s.total;

      return {
        ...s,
        percentage: ((s.total / s.full) * 100).toFixed(2),
        position,
      };

    });

    res.send(arr);

  });
};
