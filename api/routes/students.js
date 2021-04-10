const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.json({ message: error });
  }
});

router.post("/", async (req, res) => {
  const student = new Student({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    publicKey: req.body.publicKey,
  });
  try {
    const savedStudent = await student.save();
    res.json(savedStudent);
  } catch (error) {
    res.json({ message: error });
  }
});

router.get("/:studentId", async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    res.json(student);
  } catch (error) {
    res.json({ message: error });
  }
});

router.delete("/:studentId", async (req, res) => {
  try {
    const removedStudent = await Student.remove({ _id: req.params.studentId });
    res.json(removedStudent);
  } catch (error) {
    console.log(error);
    res.json({ message: error });
  }
});

router.patch("/:studentId", async (req, res) => {
  try {
    const updatedPost = await Student.updateOne(
      { _id: req.params.studentId },
      { $set: { publicKey: req.body.publicKey } }
    );
    res.json(updatedPost);
  } catch (error) {
    res.json({ message: error });
  }
});

module.exports = router;
