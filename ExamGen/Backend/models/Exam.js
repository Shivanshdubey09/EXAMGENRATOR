const mongoose = require('mongoose');

// Question sub-schema
const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String }],
  answerIndex: { type: Number },
  answerText: { type: String },
  type: { type: String }
}, { _id: false });

// Main Exam Schema
const ExamSchema = new mongoose.Schema({
  schoolName: { type: String, required: true },
  examTitle: { type: String, required: true },
  category: String,
  difficulty: String,
  subject: String,
  teacherId: String,

  questions: [QuestionSchema]

}, { timestamps: true });

module.exports = mongoose.model('Exam', ExamSchema);