const express = require("express");
const router = express.Router();
const Question = require("../models/Questions");

/* =========================================================
   GET ALL QUESTIONS (BANK)
========================================================= */
router.get("/bank", async (req, res) => {
  try {
    const { subject, difficulty, topic } = req.query;

    let query = {};

    if (subject && subject !== "All") query.subject = subject;
    if (difficulty && difficulty !== "All")
      query.difficulty = difficulty;
    if (topic)
      query.questionText = new RegExp(topic, "i");

    const questions = await Question.find(query).sort({
      createdAt: -1,
    });

    res.json(questions);
  } catch (err) {
    console.error("❌ Fetch Bank Error:", err);
    res
      .status(500)
      .json({ message: "Server error while fetching questions" });
  }
});

/* =========================================================
   ADD QUESTION
========================================================= */
router.post("/bank", async (req, res) => {
  try {
    const {
      questionText,
      questionType,
      options,
      subject,
      difficulty,
      marks,
      teacherId,
      source,
    } = req.body;

    if (!questionText || questionText.trim() === "") {
      return res
        .status(400)
        .json({ message: "Question text is required" });
    }

    const newQuestion = new Question({
      questionText,
      questionType: questionType || "mcq",
      options: Array.isArray(options) ? options : [],
      subject: subject || "General",
      difficulty: difficulty || "Medium",
      marks: marks || 1,
      teacherId: teacherId || null,
      source: source || "Manual",
    });

    const saved = await newQuestion.save();

    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Save Question Error:", err);
    res.status(500).json({
      message: "Failed to add question",
      error: err.message,
    });
  }
});

/* =========================================================
   UPDATE QUESTION
========================================================= */
router.put("/bank/:id", async (req, res) => {
  try {
    const updated = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Question not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("❌ Update Error:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

/* =========================================================
   DELETE QUESTION
========================================================= */
router.delete("/bank/:id", async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(
      req.params.id
    );

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Question not found" });
    }

    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;