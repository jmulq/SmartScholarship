const express = require("express");
const router = express.Router();
const Scholarship = require("../models/Scholarship");

// Get Scholarships
router.get("/", async (req, res) => {
  try {
    const scholarships = await Scholarship.find();
    res.json(scholarships);
  } catch (error) {
    res.json({ message: error });
  }
});

// Add Scholarship
router.post("/", async (req, res) => {
  const scholarship = new Scholarship({
    scholarshipId: req.body.scholarshipId,
    name: req.body.name,
  });
  try {
    const savedScholarship = await scholarship.save();
    res.json(savedScholarship);
  } catch (error) {
    res.json({ message: error });
  }
});

// TODO add logic if have time
// Add ExamRecords
// router.post("/:examId", async (req, res) => {
//   try {
//     const examRecords = req.body.examRecords.map((record) => {
//       return {
//         publicKey: record.publicKey,
//         score: record.score,
//       };
//     });
//     const updatedExam = await Exam.updateOne(
//       { examId: req.params.examId },
//       { $set: { examRecords } }
//     );
//     res.json(updatedExam);
//   } catch (error) {
//     res.json({ message: error });
//   }
// });

// Get scholarship
router.get("/:scholarshipId", async (req, res) => {
  try {
    const scholarship = await Scholarship.findOne({
      scholarshipId: req.params.scholarshipId,
    });
    res.json(scholarship);
  } catch (error) {
    res.json({ message: error });
  }
});

module.exports = router;
