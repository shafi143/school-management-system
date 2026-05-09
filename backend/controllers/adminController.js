const db = require("../config/db");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "school_admin_secret";

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  db.query("SELECT * FROM admin WHERE email = ?", [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (!results.length) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const admin = results[0];
    if (admin.password !== password) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ message: "Login successful", token, email: admin.email });
  });
};
