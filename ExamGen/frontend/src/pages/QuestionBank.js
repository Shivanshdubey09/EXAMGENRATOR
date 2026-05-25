import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import API from "../api/api";

const QuestionBankPage = () => {
  const dispatch = useDispatch();

  const [questionText, setQuestionText] = useState("");
  const [subject, setSubject] = useState("");
  const [questionType, setQuestionType] = useState("mcq");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await API.get("/questions/bank");
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= ADD QUESTION ================= */
  const handleAddQuestion = async () => {
    if (!questionText.trim()) return alert("Enter question");

    try {
      await API.post("/questions/bank", {
        questionText, // ✅ FIXED
        subject,
        questionType,
        options: questionType === "mcq" ? options : [],
      });

      resetForm();
      fetchQuestions();
    } catch (err) {
      console.error(err);
      alert("Failed to add question");
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (q) => {
    setEditingId(q._id);
    setQuestionText(q.questionText); // ✅ FIXED
    setSubject(q.subject);
    setQuestionType(q.questionType);
    setOptions(q.options || ["", "", "", ""]);
  };

  /* ================= UPDATE ================= */
  const handleUpdateQuestion = async () => {
    try {
      await API.put(`/questions/bank/${editingId}`, {
        questionText, // ✅ FIXED
        subject,
        questionType,
        options: questionType === "mcq" ? options : [],
      });

      resetForm();
      fetchQuestions();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    try {
      await API.delete(`/questions/bank/${id}`);
      fetchQuestions();
    } catch (err) {
      alert("Delete failed");
    }
  };

  /* ================= ADD TO PAPER ================= */
  const handleAddToPaper = (question) => {
    dispatch({
      type: "ADD_QUESTION_TO_PAPER",
      payload: question,
    });

    alert("Question added to generated paper.");
  };

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const resetForm = () => {
    setEditingId(null);
    setQuestionText("");
    setSubject("");
    setOptions(["", "", "", ""]);
  };

  return (
    <div className="relative min-h-screen bg-[#020617] text-white p-10 overflow-hidden">

      {/* Emerald Glow Background */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/10 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-400/10 blur-[150px] rounded-full animate-pulse delay-1000" />

      <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-3 gap-10">

        {/* ================= LEFT PANEL ================= */}
        <div className="bg-slate-900/70 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl">

          <h2 className="text-2xl font-black text-emerald-400 mb-8 tracking-tight">
            {editingId ? "Edit Question" : "Add Question"}
          </h2>

          <textarea
            placeholder="Enter question text..."
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-800/70 border border-white/10 mb-6 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
            rows={4}
          />

          <input
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-800/70 border border-white/10 mb-6 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
          />

          <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-800/70 border border-white/10 mb-6 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
          >
            <option value="mcq">MCQ</option>
            <option value="short">Short Answer</option>
          </select>

          {questionType === "mcq" &&
            options.map((opt, index) => (
              <input
                key={index}
                placeholder={`Option ${index + 1}`}
                value={opt}
                onChange={(e) =>
                  handleOptionChange(index, e.target.value)
                }
                className="w-full p-3 rounded-xl bg-slate-800/70 border border-white/10 mb-4 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            ))}

          {editingId ? (
            <button
              onClick={handleUpdateQuestion}
              className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-bold shadow-lg hover:shadow-emerald-500/30 transition-all"
            >
              Update Question
            </button>
          ) : (
            <button
              onClick={handleAddQuestion}
              className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-bold shadow-lg hover:shadow-emerald-500/30 transition-all"
            >
              Add Question
            </button>
          )}
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="md:col-span-2">

          <h2 className="text-3xl font-black text-emerald-400 mb-8 tracking-tight">
            Question Bank
          </h2>

          <div className="grid gap-8">
            {questions.map((q) => (
              <div
                key={q._id}
                className="relative group bg-slate-900/70 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-xl hover:shadow-emerald-500/20 transition-all duration-500 hover:-translate-y-2"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-green-500 opacity-70 group-hover:opacity-100 transition-all rounded-t-[2rem]" />

                <h3 className="text-lg font-bold mb-3 group-hover:text-emerald-300 transition-colors">
                  {q.questionText} {/* ✅ FIXED */}
                </h3>

                <p className="text-sm text-slate-400 mb-4">
                  {q.subject} • {q.questionType?.toUpperCase()}
                </p>

                {Array.isArray(q.options) && q.options.length > 0 && (
                  <div className="ml-4 space-y-1 text-sm text-slate-300 mb-6">
                    {q.options.map((opt, i) => (
                      <p key={i}>
                        {String.fromCharCode(65 + i)}. {opt}
                      </p>
                    ))}
                  </div>
                )}

                <div className="flex gap-6 text-sm font-semibold">
                  <button
                    onClick={() => handleEdit(q)}
                    className="text-emerald-400 hover:text-emerald-300 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(q._id)}
                    className="text-red-400 hover:text-red-500 transition"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => handleAddToPaper(q)}
                    className="text-cyan-400 hover:text-cyan-300 transition"
                  >
                    Add to Paper
                  </button>
                </div>
              </div>
            ))}

            {questions.length === 0 && (
              <div className="text-center py-20 text-slate-500">
                No questions in bank yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionBankPage;