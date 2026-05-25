const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const axios = require("axios");

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  console.error("❌ OPENROUTER_API_KEY is missing in .env file");
}

/* =========================================
   Subject Resolver
========================================= */
function resolveSubjectName(studentType, subjectId) {
  const map = {
    class10: {
      maths: 'Class 10 Mathematics',
      science: 'Class 10 Science',
      sst: 'Class 10 Social Science',
      english: 'Class 10 English',
      hindi: 'Class 10 Hindi',
    },
    class12: {
      pcm_maths: 'Class 12 Mathematics',
      pcm_physics: 'Class 12 Physics',
      pcm_chemistry: 'Class 12 Chemistry',
      commerce_accounts: 'Class 12 Accountancy',
      commerce_business: 'Class 12 Business Studies',
      english: 'Class 12 English',
    },
    engineering: {
      eng_maths: 'Engineering Mathematics',
      ds_algo: 'Data Structures and Algorithms',
      os: 'Operating Systems',
      dbms: 'Database Management Systems',
      cn: 'Computer Networks',
      edc: 'Electronics and EDC',
      signals: 'Signals and Systems',
    },
  };

  return map[studentType]?.[subjectId] || 'General Academic Subject';
}

/* =========================================
   Question Type Description
========================================= */
function describeQuestionType(questionType) {
  switch (questionType) {
    case 'mcq':
      return `Type: MCQ. 4 options (A,B,C,D). Exactly one correct answer.`;
    case 'true_false':
      return `Type: True/False. Answer must be "true" or "false".`;
    case 'fill_blank':
      return `Type: Fill in the blanks. Use "____" for blank.`;
    default:
      return `Type: MCQ. 4 options. One correct answer.`;
  }
}

/* =========================================
   Prompt Builder
========================================= */
function buildPrompt({ amount, studentType, subjectName, difficulty, questionType }) {
  const studentLabel = studentType.includes('class')
    ? studentType.replace('class', 'Class ')
    : 'Engineering students';

  const qtDescription = describeQuestionType(questionType);

  return `
You are an expert exam paper setter.

Generate ${amount} questions for ${studentLabel}.
Subject: ${subjectName}.
Difficulty: ${difficulty}.
${qtDescription}

Return STRICT JSON ONLY in this format:

{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "answerIndex": number,
      "answerText": "string"
    }
  ]
}
`;
}

/* =========================================
   🔥 Generate + Auto Save Route
========================================= */
router.get('/generate', async (req, res) => {
  try {
    const {
      amount = 10,
      studentType = 'engineering',
      subjectId,
      difficulty = 'medium',
      questionType = 'mcq',
      examTitle = "Untitled Paper",
      schoolName = "My School",
      teacherId = "default"
    } = req.query;

    const subjectName = resolveSubjectName(studentType, subjectId);

    const prompt = buildPrompt({
      amount: Number(amount),
      studentType,
      subjectName,
      difficulty,
      questionType
    });

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    let text =
      response.data.choices?.[0]?.message?.content || "";

    // Remove markdown fences
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;

try {
  // Extract JSON object safely
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in AI response");

  let cleanJson = jsonMatch[0];

  // Fix common AI mistakes
  cleanJson = cleanJson
    .replace(/,\s*]/g, "]")   // remove trailing commas
    .replace(/,\s*}/g, "}");  // remove trailing commas

  parsed = JSON.parse(cleanJson);

} catch (err) {
  console.error("❌ JSON Parse Error After Cleanup:", err.message);
  console.log("RAW AI OUTPUT:", text);

  return res.status(500).json({
    error: "AI returned malformed JSON",
  });
}

    const questions = (parsed.questions || []).map((q) => ({
      question: q.question || "Missing question text",
      options: Array.isArray(q.options) ? q.options : [],
      answerIndex: typeof q.answerIndex === "number" ? q.answerIndex : null,
      answerText: q.answerText || null,
      type: questionType,
    }));

    /* =========================================
       🔥 AUTO SAVE TO MONGODB
    ========================================= */

    const newExam = new Exam({
      schoolName,
      examTitle,
      category: subjectName,
      difficulty,
      subject: subjectId,
      teacherId,
      questions
    });

    const savedExam = await newExam.save();

    res.status(200).json({
      message: "Exam generated and saved successfully",
      examId: savedExam._id,
      questions
    });

  } catch (error) {
    console.error("❌ OpenRouter Route Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to generate and save questions",
      details: error.response?.data || error.message
    });
  }
});

/* =========================================
   Manual Save Route (Optional)
========================================= */
router.post('/save', async (req, res) => {
  try {
    const newExam = new Exam(req.body);
    await newExam.save();
    res.status(201).json({ message: 'Saved successfully' });
  } catch (error) {
    console.error("❌ Save Error:", error);
    res.status(400).json({ error: error.message });
  }
});

/* =========================================
   Get All Exams
========================================= */
router.get('/', async (req, res) => {
  try {
    const exams = await Exam.find().sort({ createdAt: -1 });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================================
   Get Single Exam
========================================= */
router.get('/:id', async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ error: "Exam not found" });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;