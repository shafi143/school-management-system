// routes/examRoutes.js
const db = require("../config/db");
router.get("/", (req, res) => {
  db.query("SELECT * FROM exams", (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
});

module.exports = router;