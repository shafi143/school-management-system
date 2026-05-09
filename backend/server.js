const express = require("express");
const cors = require("cors");

const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const marksRoutes = require("./routes/marksRoutes");
const resultRoutes = require("./routes/resultRoutes");
const feesRoutes = require("./routes/feesRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

// ✅ IMPORTANT FIX
app.use(cors());

app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use(authMiddleware);

app.use("/api/students", studentRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/fees", feesRoutes);


app.get("/", (req, res) => {
  res.send("Server Running");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});