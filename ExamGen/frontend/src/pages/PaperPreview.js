import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Footer,
  PageNumber,
} from "docx";
import { saveAs } from "file-saver";
import html2pdf from "html2pdf.js";

const PaperPreview = () => {
  const { id } = useParams();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);
  const paperRef = useRef();

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const res = await API.get(`/papers/${id}`);
        setPaper(res.data);
      } catch (err) {
        console.error("Failed to fetch paper:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPaper();
  }, [id]);

  const handlePrint = () => window.print();

  const downloadPDF = () => {
    html2pdf()
      .set({
        margin: 0.5,
        filename: `${paper.title}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .from(paperRef.current)
      .save();
  };

  const downloadWord = async () => {
    if (!paper) return;
    const doc = new Document();
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${paper.title}.docx`);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-emerald-400 text-lg">
        Loading paper...
      </div>
    );

  if (!paper)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-red-400">
        Paper not found.
      </div>
    );

  return (
    <div className="relative min-h-screen bg-[#020617] text-white px-6 py-12 overflow-hidden">

      {/* 🌌 Background Glow Effects */}
      <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-emerald-600/10 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-green-400/10 blur-[150px] rounded-full animate-pulse delay-1000" />

      {/* ================= ACTION BAR ================= */}
      <div className="relative z-10 max-w-6xl mx-auto mb-10 flex flex-wrap justify-end gap-4 print:hidden">

        <button
          onClick={() => setShowAnswers(!showAnswers)}
          className="px-6 py-2 rounded-xl bg-white/5 border border-emerald-500/30 text-emerald-400 font-semibold hover:bg-emerald-500 hover:text-black transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30"
        >
          {showAnswers ? "Hide Answers" : "Show Answers"}
        </button>

        <button
          onClick={handlePrint}
          className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all duration-300"
        >
          Print
        </button>

        <button
          onClick={downloadPDF}
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 text-black font-bold hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300"
        >
          Download PDF
        </button>

        <button
          onClick={downloadWord}
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 text-black font-bold hover:scale-105 hover:shadow-xl hover:shadow-green-400/40 transition-all duration-300"
        >
          Download Word
        </button>
      </div>

      {/* ================= PAPER CARD ================= */}
      <div
        ref={paperRef}
        className="relative z-10 max-w-6xl mx-auto bg-white text-black rounded-[2.5rem] px-20 py-16 shadow-[0_40px_80px_-20px_rgba(16,185,129,0.4)] border border-emerald-400/20"
      >

        {/* ✨ Top Accent Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-green-500 rounded-t-[2.5rem]" />

        {/* ================= HEADER ================= */}
        <div className="text-center border-b border-gray-300 pb-8 mb-12">

          <h1 className="text-3xl font-black uppercase tracking-wide text-gray-900">
            {paper.schoolName}
          </h1>

          <p className="text-gray-600 mt-2">{paper.board}</p>

          <h2 className="text-2xl font-bold mt-6 text-gray-800">
            {paper.title}
          </h2>

          <p className="text-sm mt-4 text-gray-600">
            Class: {paper.className} &nbsp; | &nbsp;
            Exam: {paper.examType} &nbsp; | &nbsp;
            Duration: {paper.duration}
          </p>

          <p className="font-semibold mt-4 text-gray-800">
            Total Marks: {paper.totalMarks}
          </p>
        </div>

        {/* ================= QUESTIONS ================= */}
        {paper.sections?.length ? (
          paper.sections.map((section, secIndex) => {
            let startIndex = paper.sections
              .slice(0, secIndex)
              .reduce((sum, s) => sum + s.count, 0);

            return (
              <div key={secIndex} className="mb-14">

                {/* Section Header */}
                <div className="bg-emerald-50 border-l-4 border-emerald-500 px-6 py-4 rounded-xl mb-8 shadow-sm">
                  <h3 className="font-bold text-lg text-emerald-700 tracking-wide">
                    {section.name} ({section.count} × {section.marks} ={" "}
                    {section.count * section.marks} marks)
                  </h3>
                </div>

                {paper.questions
                  .slice(startIndex, startIndex + section.count)
                  .map((q, index) => (
                    <div key={index} className="mb-10">

                      <p className="font-semibold text-gray-800 mb-4 leading-relaxed">
                        {startIndex + index + 1}.{" "}
                        {q.question || q.questionText}
                      </p>

                      {Array.isArray(q.options) && (
                        <div className="ml-8 space-y-3 text-sm">
                          {q.options.map((opt, i) => (
                            <p key={i} className="hover:text-emerald-600 transition-colors">
                              <span className="font-bold mr-2">
                                {String.fromCharCode(65 + i)}.
                              </span>
                              {opt}
                            </p>
                          ))}
                        </div>
                      )}

                      {showAnswers && q.answerText && (
                        <div className="mt-4 ml-8 px-4 py-2 bg-emerald-100 border-l-4 border-emerald-500 rounded text-emerald-800 font-medium">
                          Answer: {q.answerText}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            );
          })
        ) : (
          paper.questions?.map((q, index) => (
            <div key={index} className="mb-10">

              <p className="font-semibold text-gray-800 mb-4">
                {index + 1}. {q.question || q.questionText}
              </p>

              {Array.isArray(q.options) && (
                <div className="ml-8 space-y-3 text-sm">
                  {q.options.map((opt, i) => (
                    <p key={i}>
                      <span className="font-bold mr-2">
                        {String.fromCharCode(65 + i)}.
                      </span>
                      {opt}
                    </p>
                  ))}
                </div>
              )}

              {showAnswers && q.answerText && (
                <div className="mt-4 ml-8 px-4 py-2 bg-emerald-100 border-l-4 border-emerald-500 rounded text-emerald-800 font-medium">
                  Answer: {q.answerText}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PaperPreview;