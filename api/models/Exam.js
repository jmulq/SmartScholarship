const mongoose = require("mongoose");

const ExamSchema = mongoose.Schema({
  examId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  availableMarks: {
    type: Number,
    required: true,
  },
  examRecords: {
    type: [
      {
        publicKey: {
          type: String,
          required: true,
        },
        score: {
          type: String,
          required: true,
        },
      },
    ],
    required: false,
    default: [],
  },
});

module.exports = mongoose.model("Exam", ExamSchema);
