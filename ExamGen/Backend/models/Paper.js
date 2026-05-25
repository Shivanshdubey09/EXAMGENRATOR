const mongoose = require("mongoose");

/* =========================================
   Question Sub Schema
========================================= */
const questionSchema = new mongoose.Schema({
  section: {
    type: String,           // Section A / B / C
    default: "A",
  },
  question: String,
  questionText: String,

  options: [String],

  answerText: String,      // For answer key generation

  marks: {
    type: Number,
    default: 1,
  },
});

/* =========================================
   Paper Schema
========================================= */
const paperSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    /* ===== Academic Info ===== */
    schoolName: {
      type: String,
      default: "Your School Name",
    },

    board: {
      type: String,
      default: "CBSE", // CBSE / ICSE / STATE
    },

    className: String,

    examType: String, // Midterm / Final / Unit Test

    duration: {
      type: String,
      default: "3 Hours",
    },

    /* ===== Paper Info ===== */
    title: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    totalMarks: {
      type: Number,
      default: 0,
    },

    marksPerQuestion: {
      type: Number,
      default: 1,
    },

    /* ===== Questions ===== */
    questions: [questionSchema],

  },
  { timestamps: true }
);

module.exports = mongoose.model("Paper", paperSchema);