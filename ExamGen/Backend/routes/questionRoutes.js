// const express = require('express');
// const router = express.Router();
// // Check your models folder: if the file is 'Questions.js', use this:
// const Question = require('../models/Questions');

// /**
//  * @route   GET /api/questions/bank
//  * @desc    Fetch all questions from the bank with optional filters
//  */
// router.get('/bank', async (req, res) => {
//   try {
//     const { subject, difficulty, topic } = req.query;
//     let query = {};
    
//     if (subject && subject !== 'All') query.subject = subject;
//     if (difficulty && difficulty !== 'any') query.difficulty = difficulty;
//     if (topic) query.questionText = new RegExp(topic, 'i'); 

//     const questions = await Question.find(query).sort({ createdAt: -1 });
//     res.json(questions);
//   } catch (err) {
//     console.error("Fetch Bank Error:", err);
//     res.status(500).json({ message: "Server error while fetching questions" });
//   }
// });

// /**
//  * @route   POST /api/questions/bank
//  * @desc    Save a specific question (AI-generated or manual) to the bank
//  */
// router.post('/bank', async (req, res) => {
//   try {
//     const { questionText, options, subject, difficulty, teacherId, source } = req.body;

//     // Validation: Ensure we don't save empty questions
//     if (!questionText) {
//       return res.status(400).json({ message: "Question text is required" });
//     }

//     const newQuestion = new Question({
//       questionText,
//       options,
//       subject: subject || "General",
//       difficulty: difficulty || "Medium",
//       teacherId,
//       source: source || "Manual"
//     });

//     const saved = await newQuestion.save();
//     res.status(201).json(saved);
//   } catch (err) {
//     console.error("Save Bank Error:", err);
//     res.status(400).json({ message: err.message });
//   }
// });

// module.exports = router;






// const express = require('express');
// const router = express.Router();
// // Check your models folder: if the file is 'Questions.js', use this:
// const Question = require('../models/Questions');

// /**
//  * @route   GET /api/questions/bank
//  * @desc    Fetch all questions from the bank with optional filters
//  */
// router.get('/bank', async (req, res) => {
//   try {
//     const { subject, difficulty, topic } = req.query;
//     let query = {};
    
//     if (subject && subject !== 'All') query.subject = subject;
//     if (difficulty && difficulty !== 'any') query.difficulty = difficulty;
//     if (topic) query.questionText = new RegExp(topic, 'i'); 

//     const questions = await Question.find(query).sort({ createdAt: -1 });
//     res.json(questions);
//   } catch (err) {
//     console.error("Fetch Bank Error:", err);
//     res.status(500).json({ message: "Server error while fetching questions" });
//   }
// });

// /**
//  * @route   POST /api/questions/bank
//  * @desc    Save a specific question (AI-generated or manual) to the bank
//  */
// router.post('/bank', async (req, res) => {
//   try {
//     const { questionText, options, subject, difficulty, teacherId, source } = req.body;

//     // Validation: Ensure we don't save empty questions
//     if (!questionText) {
//       return res.status(400).json({ message: "Question text is required" });
//     }

//     const newQuestion = new Question({
//       questionText,
//       options,
//       subject: subject || "General",
//       difficulty: difficulty || "Medium",
//       teacherId,
//       source: source || "Manual"
//     });

//     const saved = await newQuestion.save();
//     res.status(201).json(saved);
//   } catch (err) {
//     console.error("Save Bank Error:", err);
//     res.status(400).json({ message: err.message });
//   }
// });

// module.exports = router;





const express = require('express');
const router = express.Router();
const Question = require('../models/Questions'); // ✅ keep as-is since your file is Questions.js

/* =========================================================
   GET ALL QUESTIONS (BANK)
   ========================================================= */
router.get('/bank', async (req, res) => {
  try {
    const { subject, difficulty, topic } = req.query;
    let query = {};

    if (subject && subject !== 'All') query.subject = subject;
    if (difficulty && difficulty !== 'All') query.difficulty = difficulty;
    if (topic) query.questionText = new RegExp(topic, 'i');

    const questions = await Question.find(query).sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    console.error('❌ Fetch Bank Error:', err);
    res.status(500).json({ message: 'Server error while fetching questions' });
  }
});

/* =========================================================
   ADD QUESTION
   ========================================================= */
router.post('/bank', async (req, res) => {
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

    if (!questionText) {
      return res.status(400).json({ message: 'Question text is required' });
    }

    const newQuestion = new Question({
      questionText,
      questionType,
      options,
      subject: subject || 'General',
      difficulty: difficulty || 'Medium',
      marks: marks || 1,
      teacherId,
      source: source || 'Manual',
    });

    const saved = await newQuestion.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Save Question Error:', err);
    res.status(400).json({ message: err.message });
  }
});

/* =========================================================
   UPDATE QUESTION (EDIT)
   ========================================================= */
router.put('/bank/:id', async (req, res) => {
  console.log('🟡 EDIT HIT:', req.params.id);

  try {
    const updated = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('❌ Update Error:', err);
    res.status(500).json({ message: 'Update failed' });
  }
});

/* =========================================================
   DELETE QUESTION
   ========================================================= */
router.delete('/bank/:id', async (req, res) => {
  console.log('🟡 DELETE HIT:', req.params.id);

  try {
    const deleted = await Question.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json({ message: 'Question deleted successfully' });
  } catch (err) {
    console.error('❌ Delete Error:', err);
    res.status(500).json({ message: 'Delete failed' });
  }
});

module.exports = router;
