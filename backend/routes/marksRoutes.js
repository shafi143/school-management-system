const express = require("express");
const router = express.Router();

const marksController = require("../controllers/marksController");

// Add Marks
router.post("/", marksController.addMarks);

router.get("/exams", marksController.getExam);
router.get("/class/:className/exam/:exam_id", marksController.getMarksByClassAndExam);

// Get Result (DMC)
router.get("/:student_id/:exam_id", marksController.getResult);
module.exports = router;