const express = require("express");
const router = express.Router();

const subjectController = require("../controllers/subjectController");

// Add Subject



router.get("/all", subjectController.getAllSubjects);
router.post("/assign", subjectController.assignSubjectsToClass);
router.get("/class/:className", subjectController.getSubjectsByClass);


module.exports = router;