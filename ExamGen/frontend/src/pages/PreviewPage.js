import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import API from "../api/api";

const PreviewPage = () => {
  const dispatch = useDispatch();

  const questions = useSelector((state) => state.questions);
  const examInfo = useSelector((state) => state.examInfo);

  const [localQuestions, setLocalQuestions] = useState([]);
  const [localSections, setLocalSections] = useState([]);
  const [showBank, setShowBank] = useState(false);
  const [bankQuestions, setBankQuestions] = useState([]);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(null);

  const restoredRef = useRef(false); // ✅ prevents infinite restore loop

  /* ================= RESTORE PAPER IF PAGE RELOADS ================= */
  useEffect(() => {
    if (restoredRef.current) return;

    if (questions?.length) {
      setLocalQuestions(questions);
      setLocalSections(examInfo?.sections || []);
      restoredRef.current = true;
    } else {
      const saved = localStorage.getItem("generatedPaper");

      if (saved) {
        const parsed = JSON.parse(saved);

        // ❌ DO NOT DISPATCH HERE (this was causing infinite loop)

        setLocalQuestions(parsed.questions || []);
        setLocalSections(parsed.examInfo?.sections || []);
        restoredRef.current = true;
      }
    }
  }, [questions, examInfo]);

  const sections = localSections || [];

  /* ================= AUTO SAVE TO LOCAL STORAGE ================= */
  useEffect(() => {
    if (!localQuestions.length) return;

    localStorage.setItem(
      "generatedPaper",
      JSON.stringify({
        questions: localQuestions,
        examInfo: { ...examInfo, sections },
      })
    );
  }, [localQuestions, sections]);

  /* ================= TOTAL MARKS ================= */
  const totalMarks = useMemo(() => {
    return sections.reduce(
      (sum, sec) => sum + sec.count * sec.marks,
      0
    );
  }, [sections]);

  /* ================= GROUP QUESTIONS ================= */
  const groupedQuestions = useMemo(() => {
    let pointer = 0;

    return sections.map((sec) => {
      const qs = localQuestions.slice(pointer, pointer + sec.count);
      pointer += sec.count;
      return { ...sec, questions: qs };
    });
  }, [localQuestions, sections]);

  /* ================= SAVE TO QUESTION BANK ================= */
  const saveToBank = async (question) => {
    try {
      const payload = {
        questionText: question.question,
        options: question.options || [],
        subject: examInfo.subjectName,
        difficulty: examInfo.difficulty,
        questionType: question.questionType || "mcq",
        marks: question.marks || 1,
      };

      await API.post("/questions/bank", payload);
      alert("Saved to Question Bank ✅");
    } catch (err) {
      console.error("SAVE ERROR:", err);
      alert("Failed to save to bank");
    }
  };

  /* ================= LOAD QUESTION BANK ================= */
  const loadBankQuestions = async (sectionIndex) => {
    try {
      const res = await API.get("/questions/bank");

      setBankQuestions(res.data || []);
      setSelectedSectionIndex(sectionIndex);
      setShowBank(true);
    } catch (err) {
      console.error("LOAD BANK ERROR:", err);
      alert("Failed to load question bank");
    }
  };

  /* ================= INSERT FROM BANK ================= */
  const insertQuestionFromBank = (question) => {
    if (selectedSectionIndex === null) return;

    const updatedQuestions = [...localQuestions];
    const updatedSections = [...sections];

    let pointer = 0;
    for (let i = 0; i < selectedSectionIndex; i++) {
      pointer += updatedSections[i].count;
    }

    updatedQuestions.splice(pointer, 0, {
      question: question.questionText,
      options: question.options,
      questionType: question.questionType,
      marks: question.marks,
    });

    updatedSections[selectedSectionIndex].count += 1;

    setLocalQuestions(updatedQuestions);
    setLocalSections(updatedSections);
    setShowBank(false);
  };

  /* ================= SHUFFLE ================= */
  const handleShuffle = () => {
    const shuffled = [...localQuestions]
      .map((q) => ({ q, r: Math.random() }))
      .sort((a, b) => a.r - b.r)
      .map((x) => x.q);

    setLocalQuestions(shuffled);
  };

  /* ================= DISCARD PAPER ================= */
  const handleDiscard = () => {
    localStorage.removeItem("generatedPaper");
    setLocalQuestions([]);
    setLocalSections([]);
    dispatch({ type: "CLEAR_DATA" });
  };

  /* ================= SAVE PAPER TO DB ================= */
  const handleSavePaper = async () => {
    try {
      const savedUserData =
        localStorage.getItem("teacher") ||
        localStorage.getItem("user") ||
        localStorage.getItem("auth");

      if (!savedUserData) {
        alert("Login required.");
        return;
      }

      const teacher = JSON.parse(savedUserData);

      await API.post("/papers", {
        teacherId: teacher._id,
        title: examInfo.test,
        subject: examInfo.subjectName,
        schoolName: examInfo.schoolName,
        board: examInfo.board,
        className: examInfo.className,
        examType: examInfo.examType,
        duration: examInfo.duration,
        totalMarks,
        sections,
        questions: localQuestions,
      });

      alert("Paper saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save paper");
    }
  };

  if (!localQuestions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        No paper generated.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white p-10">
      <div className="max-w-5xl mx-auto">

        {/* EVERYTHING BELOW IS EXACTLY YOUR ORIGINAL UI */}

        {/* HEADER */}
        <div className="text-center border-b border-white/10 pb-6 mb-10">
          <h1 className="text-2xl font-black uppercase text-emerald-400">
            {examInfo.schoolName}
          </h1>
          <p className="text-slate-400">{examInfo.board}</p>
          <h2 className="text-xl font-bold mt-3">
            {examInfo.test}
          </h2>
          <p className="text-sm mt-2 text-slate-400">
            Class: {examInfo.className} | Exam: {examInfo.examType} | Duration: {examInfo.duration}
          </p>
          <p className="font-semibold mt-3 text-emerald-400">
            Total Marks: {totalMarks}
          </p>
        </div>

        {groupedQuestions.map((section, secIndex) => {
          let globalIndex =
            sections
              .slice(0, secIndex)
              .reduce((sum, s) => sum + s.count, 0);

          return (
            <div key={secIndex} className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-emerald-300">
                  {section.name}
                </h3>

                <button
                  onClick={() => loadBankQuestions(secIndex)}
                  className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  + Add from Bank
                </button>
              </div>

              {section.questions.map((q, index) => {
                const realIndex = globalIndex + index;

                return (
                  <div
                    key={realIndex}
                    className="mb-6 bg-slate-900/60 border border-white/10 rounded-xl p-6"
                  >
                    <p className="font-semibold text-lg">
                      {realIndex + 1}. {q.question}
                    </p>

                    {q.options?.map((opt, i) => (
                      <p key={i} className="ml-6 text-slate-300">
                        {String.fromCharCode(65 + i)}. {opt}
                      </p>
                    ))}

                    <div className="flex gap-6 mt-4 text-sm">
                      <button
                        onClick={() => saveToBank(q)}
                        className="text-emerald-400 hover:text-emerald-300"
                      >
                        Save to Bank
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        <div className="flex gap-6 mt-8">
          <button
            onClick={handleShuffle}
            className="bg-slate-700 px-6 py-3 rounded-xl font-bold"
          >
            Shuffle
          </button>

          <button
            onClick={handleSavePaper}
            className="bg-emerald-600 px-6 py-3 rounded-xl font-bold"
          >
            Save Paper
          </button>

          <button
            onClick={handleDiscard}
            className="bg-red-600 px-6 py-3 rounded-xl font-bold"
          >
            Discard Paper
          </button>
        </div>

        {showBank && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-slate-900 p-6 w-3/4 max-h-[80vh] overflow-y-auto rounded-xl">
              <h2 className="text-lg font-bold mb-6 text-emerald-400">
                Select Question from Bank
              </h2>

              {bankQuestions.map((q) => (
                <div
                  key={q._id}
                  onClick={() => insertQuestionFromBank(q)}
                  className="border border-white/10 p-4 mb-4 rounded-lg cursor-pointer hover:bg-slate-800"
                >
                  {q.questionText}
                </div>
              ))}

              <button
                onClick={() => setShowBank(false)}
                className="mt-4 bg-red-600 px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PreviewPage;