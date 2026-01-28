const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

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

  return map[studentType]?.[subjectId] || 'general school and engineering subjects';
}

function describeQuestionType(questionType) {
  switch (questionType) {
    case 'mcq':
      return `Type: MCQ. Rules: 4 options (A,B,C,D), exactly one correct.`;
    case 'true_false':
      return `Type: True/False. Rules: Clear statement, answer is "true" or "false".`;
    case 'fill_blank':
      return `Type: Fill in the blanks. Rules: Use "____" for the blank.`;
    default:
      return `Type: MCQ. Rules: 4 options, one correct.`;
  }
}

function buildPrompt({ amount, studentType, subjectName, difficulty, questionType }) {
  const studentLabel = studentType.includes('class') ? studentType.replace('class', 'Class ') : 'Engineering students';
  const qtDescription = describeQuestionType(questionType);

  return `
You are an expert exam paper setter. Generate ${amount} questions for ${studentLabel}.
Subject: ${subjectName}.
Difficulty: ${difficulty}.
${qtDescription}

Return STRICT JSON:
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "answerIndex": number,
      "answerText": "string"
    }
  ]
}`;
}

router.get('/generate', async (req, res) => {
  try {
    const { amount = 10, studentType = 'engineering', subjectId, difficulty = 'medium', questionType = 'mcq' } = req.query;

    // 1. Setup Model with JSON Response Schema
   const model = genAI.getGenerativeModel({
 // model: 'gemini-1.5-flash-latest', // Most reliable for free tier
   model: 'gemini-2.0-flash-lite',
    model: 'gemini-2.5-flash-lite',
  generationConfig: { responseMimeType: "application/json" }
});

    const subjectName = resolveSubjectName(studentType, subjectId);
    const prompt = buildPrompt({ amount: Number(amount), studentType, subjectName, difficulty, questionType });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Gemini API Raw Response:', text)

    // 2. Parse JSON safely
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error('JSON Parse Error:', text);
      return res.status(500).json({ error: 'AI generated invalid JSON format' });
    }

    // 3. Normalize output to ensure consistency
    const questions = (parsed.questions || []).map((q) => ({
      question: q.question || "Missing question text",
      options: Array.isArray(q.options) ? q.options : null,
      answerIndex: typeof q.answerIndex === 'number' ? q.answerIndex : null,
      answerText: q.answerText || null,
      type: questionType,
    }));

    res.status(200).json(questions);
  } catch (error) {
    console.error('Gemini Route Error:', error);
    res.status(500).json({ error: 'Failed to generate questions',
      details: error.message
     });
  }
});

router.post('/save', async (req, res) => {
  try {
    const newExam = new Exam(req.body);
    await newExam.save();
    res.status(201).json({ message: 'Saved successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;