const express = require("express");
const router = express.Router();
const Exam = require("../models/Exam");

// Get Exams
router.get("/", async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (error) {
    res.json({ message: error });
  }
});

module.exports = router;
