const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");

// Import routes
const studentsRoute = require("./routes/students");
const scholarshipsRoute = require("./routes/scholarships");

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/students", studentsRoute);
app.use("/scholarships", scholarshipsRoute);

// Connect to DB
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected to db")
);

app.listen(3000);
