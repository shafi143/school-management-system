const express = require("express");
const router = express.Router();
const resultController = require("../controllers/resultController");

// Class-wise result
router.get("/class/:className/:exam_id", resultController.getClassResult);
router.get("/dmc/:className/:exam_id", resultController.getDMC);
router.post("/save", resultController.saveDMC);
router.get("/all/:className/:exam_id", resultController.getAllDMC);
module.exports = router;