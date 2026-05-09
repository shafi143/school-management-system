const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentController");



// Routes
router.post("/", studentController.addStudent);
router.get("/", studentController.getStudents);
router.delete("/:id", studentController.deleteStudent);
router.put("/:id", studentController.updateStudent);
router.get("/class/:className", studentController.getStudentsByClass);

module.exports = router;