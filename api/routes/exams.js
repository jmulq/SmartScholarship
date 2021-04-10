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

// Add Exam
router.post("/", async (req, res) => {
  const exam = new Exam({
    examId: req.body.examId,
    name: req.body.name,
    availableMarks: req.body.availableMarks,
    examRecords: [],
  });
  try {
    const savedExam = await exam.save();
    res.json(savedExam);
  } catch (error) {
    res.json({ message: error });
  }
});

// Add ExamRecords
router.post("/:examId", async (req, res) => {
  try {
    const examRecords = req.body.examRecords.map((record) => {
      return {
        publicKey: record.publicKey,
        score: record.score,
      };
    });
    const updatedExam = await Exam.updateOne(
      { examId: req.params.examId },
      { $set: { examRecords } }
    );
    res.json(updatedExam);
  } catch (error) {
    res.json({ message: error });
  }
});

// Get ExamRecords for Exam
router.get("/:examId", async (req, res) => {
  try {
    const examRecords = await Exam.findOne(
      { examId: req.params.examId },
      "examRecords"
    );
    res.json(examRecords);
  } catch (error) {
    res.json({ message: error });
  }
});

module.exports = router;
