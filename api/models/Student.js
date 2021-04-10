const mongoose = require("mongoose");

const StudentSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  publicKey: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Students", StudentSchema);
