const mongoose = require("mongoose");

const ScholarshipSchema = mongoose.Schema({
  scholarshipId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  applicants: {
    type: [
      {
        publicKey: {
          type: String,
          required: true,
        },
        examRecords: {
          type: [
            {
              examId: {
                type: String,
                required: true,
              },
              score: {
                type: Number,
                required: false,
              },
              complete: {
                type: Boolean,
                required: true,
                default: false,
              },
            },
          ],
        },
        totalMark: {
          type: Number,
          required: false,
        },
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model("Scholarship", ScholarshipSchema);