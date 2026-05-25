const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
    },

    questionType: {
      type: String,
      default: "mcq",
    },

    options: {
      type: [String],
      default: [],
    },

    subject: {
      type: String,
      default: "General",
    },

    difficulty: {
      type: String,
      default: "Medium",
    },

    marks: {
      type: Number,
      default: 1,
    },

    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher", // ✅ FIXED (was User before)
    },

    source: {
      type: String,
      default: "Manual",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Questions", QuestionSchema);