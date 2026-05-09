const express = require("express");
const router = express.Router();

const subjectController = require("../controllers/subjectController");

// Add Subject



// 📥 Get all subjects
router.get("/all", subjectController.getAllSubjects);

// ➕ Assign subjects to class
router.post("/assign", subjectController.assignSubjectsToClass);

// 📥 Get subjects by class
router.get("/:className", subjectController.getSubjectsByClass);


module.exports = router;