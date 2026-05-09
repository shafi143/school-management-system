const express = require("express");
const router = express.Router();

const feesController = require("../controllers/feesController");

// Routes
router.post("/", feesController.addFees);
router.get("/", feesController.getAllFees);
router.get("/student/:student_id", feesController.getFeesByStudent);
router.put("/:id", feesController.updateFees);
router.delete("/:id", feesController.deleteFees);
router.get("/summary/all", feesController.getFeesSummary);

module.exports = router;
