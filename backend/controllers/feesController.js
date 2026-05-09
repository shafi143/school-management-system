const db = require("../config/db");

// ➕ Add Fees Record
exports.addFees = (req, res) => {
  const {
    student_id,
    amount,
    due_date,
    paid_date,
    status,
    payment_method,
    notes
  } = req.body;

  const sql = `
    INSERT INTO fees 
    (student_id, amount, due_date, paid_date, status, payment_method, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [student_id, amount, due_date, paid_date, status, payment_method, notes],
    (err, result) => {
      if (err) return res.status(500).send(err);

      res.json({
        message: "Fees record added successfully",
        id: result.insertId
      });
    }
  );
};

// 📥 Get All Fees Records
exports.getAllFees = (req, res) => {
  db.query("SELECT * FROM fees", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
};

// 🔍 Get Fees by Student ID
exports.getFeesByStudent = (req, res) => {
  const { student_id } = req.params;

  db.query(
    "SELECT * FROM fees WHERE student_id = ?",
    [student_id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    }
  );
};

// ✏️ Update Fees Record
exports.updateFees = (req, res) => {
  const { id } = req.params;
  const {
    amount,
    due_date,
    paid_date,
    status,
    payment_method,
    notes
  } = req.body;

  const sql = `
    UPDATE fees 
    SET amount = ?, due_date = ?, paid_date = ?, status = ?, payment_method = ?, notes = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [amount, due_date, paid_date, status, payment_method, notes, id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Fees record updated successfully" });
    }
  );
};

// ❌ Delete Fees Record
exports.deleteFees = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM fees WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Fees record deleted" });
  });
};

// 📊 Get Fees Summary
exports.getFeesSummary = (req, res) => {
  const sql = `
    SELECT 
      student_id,
      SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as total_paid,
      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as total_pending,
      SUM(amount) as total_fees
    FROM fees
    GROUP BY student_id
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
};
