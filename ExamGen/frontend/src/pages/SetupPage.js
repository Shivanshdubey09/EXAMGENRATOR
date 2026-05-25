import React, { useState, useMemo, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const studentTypes = [
  { id: "class10", name: "High School" },
  { id: "class12", name: "Intermediate" },
  { id: "engineering", name: "Engineering" },
];

const subjectsByType = {
  class10: [
    { id: "maths", name: "Mathematics" },
    { id: "science", name: "Science" },
    { id: "sst", name: "Social Science" },
    { id: "english", name: "English" },
  ],
  class12: [
    { id: "pcm_maths", name: "Mathematics" },
    { id: "pcm_physics", name: "Physics" },
    { id: "pcm_chemistry", name: "Chemistry" },
    { id: "english", name: "English" },
  ],
  engineering: [
    { id: "eng_maths", name: "Engineering Mathematics" },
    { id: "ds_algo", name: "Data Structures" },
    { id: "os", name: "Operating Systems" },
    { id: "dbms", name: "DBMS" },
    { id: "cn", name: "Computer Networks" },
  ],
};

const GeneratorPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const previewRef = useRef();

  const [form, setForm] = useState({
    schoolName: "",
    board: "CBSE",
    className: "",
    examType: "Mid Term",
    duration: "3 Hours",
    test: "",
    studentType: "engineering",
    subject: "eng_maths",
    difficulty: "medium",
  });

  const [sections, setSections] = useState([
    { name: "Section A", count: 5, marks: 2 },
    { name: "Section B", count: 5, marks: 4 },
  ]);

  const [instructions, setInstructions] = useState(
    "1. Attempt all questions.\n2. Write clearly.\n3. All questions are compulsory."
  );

  const [showWatermark, setShowWatermark] = useState(true);
  const [watermarkText, setWatermarkText] = useState("EXAM.AI");
  const [loading, setLoading] = useState(false);

  /* ================= UPLOAD STATES ================= */
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [customPrompt, setCustomPrompt] = useState("");

  const subjectOptions = useMemo(
    () => subjectsByType[form.studentType] || [],
    [form.studentType]
  );

  const subjectName =
    subjectOptions.find((s) => s.id === form.subject)?.name || "";

  useEffect(() => {
    if (!subjectOptions.find((s) => s.id === form.subject)) {
      setForm((prev) => ({
        ...prev,
        subject: subjectOptions[0]?.id || "",
      }));
    }
  }, [subjectOptions]);

  const totalQuestions = useMemo(() => {
    return sections.reduce((sum, s) => sum + Number(s.count || 0), 0);
  }, [sections]);

  const totalMarks = useMemo(() => {
    return sections.reduce(
      (sum, s) => sum + Number(s.count || 0) * Number(s.marks || 0),
      0
    );
  }, [sections]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSectionChange = (index, field, value) => {
    const updated = [...sections];
    updated[index][field] = value;
    setSections(updated);
  };

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      {
        name: `Section ${String.fromCharCode(65 + prev.length)}`,
        count: 5,
        marks: 5,
      },
    ]);
  };
  
  const removeSection = (indexToRemove) => {
  if (sections.length === 1) return; // prevent deleting last section

  const updated = sections.filter((_, i) => i !== indexToRemove);
  setSections(updated);
};

  /* ================= NORMAL GENERATION ================= */
  const fetchQuestions = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.get("/exams/generate", {
        params: {
          amount: totalQuestions,
          studentType: form.studentType,
          subjectId: form.subject,
          difficulty: form.difficulty,
          prompt: customPrompt,
        },
      });

      const questions = Array.isArray(res.data)
        ? res.data
        : res.data?.questions || [];

      const payload = {
        questions,
        examInfo: {
          ...form,
          subjectName,
          totalMarks,
          sections,
          instructions,
          watermarkText,
          showWatermark,
        },
      };

      dispatch({ type: "SET_DATA", payload });
      localStorage.setItem("generatedPaper", JSON.stringify(payload));
      navigate("/preview");
    } catch (err) {
      alert("Generation failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= GENERATE FROM UPLOAD ================= */
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const generateFromFile = async () => {
    if (!selectedFile && !selectedImage) {
      alert("Upload a file or image first.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      if (selectedFile) formData.append("file", selectedFile);
      if (selectedImage) formData.append("image", selectedImage);
      formData.append("prompt", customPrompt);
      formData.append("amount", totalQuestions);
      formData.append("difficulty", form.difficulty);

      const res = await API.post("/exams/generate-from-file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const questions = res.data.questions || [];

      const payload = {
        questions,
        examInfo: {
          ...form,
          subjectName,
          totalMarks,
          sections,
          instructions,
          watermarkText,
          showWatermark,
        },
      };

      dispatch({ type: "SET_DATA", payload });
      localStorage.setItem("generatedPaper", JSON.stringify(payload));
      navigate("/preview");
    } catch (err) {
      console.error(err);
      alert("AI generation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#071226] to-[#020617] text-white p-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
        <form onSubmit={fetchQuestions} className="space-y-8">

          <h1 className="text-3xl font-black text-emerald-400">
            Automated Academic Paper Generator
          </h1>

          

    

          {/* SCHOOL INFO */}
          <div className="config-card grid md:grid-cols-2 gap-6">
            <input
              placeholder="School Name"
              value={form.schoolName}
              onChange={(e) =>
                handleChange("schoolName", e.target.value)
              }
              className="input"
            />

            <select
              value={form.board}
              onChange={(e) =>
                handleChange("board", e.target.value)
              }
              className="input"
            >
              <option>CBSE</option>
              <option>ICSE</option>
              <option>State Board</option>
              <option>University</option>
            </select>

            <input
              placeholder="Class Name"
              value={form.className}
              onChange={(e) =>
                handleChange("className", e.target.value)
              }
              className="input"
            />

            <input
              placeholder="Duration"
              value={form.duration}
              onChange={(e) =>
                handleChange("duration", e.target.value)
              }
              className="input"
            />
          </div>

          {/* EXAM SETTINGS */}
          <div className="config-card grid md:grid-cols-2 gap-6">
            <input
              placeholder="Exam Title"
              value={form.test}
              onChange={(e) =>
                handleChange("test", e.target.value)
              }
              className="input"
            />

            <select
              value={form.studentType}
              onChange={(e) =>
                handleChange("studentType", e.target.value)
              }
              className="input"
            >
              {studentTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <select
              value={form.subject}
              onChange={(e) =>
                handleChange("subject", e.target.value)
              }
              className="input"
            >
              {subjectOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              value={form.difficulty}
              onChange={(e) =>
                handleChange("difficulty", e.target.value)
              }
              className="input"
            >
              <option value="easy">Easy Level</option>
              <option value="medium">Medium Level</option>
              <option value="hard">Hard Level</option>
            </select>
          </div>

         <div className="config-card space-y-5">
  <h2 className="config-heading">Section Builder</h2>

  {sections.map((section, index) => (
    <div
      key={index}
      className="relative space-y-3 border border-white/5 p-4 rounded-xl bg-[#0b1220]"
    >
      
      {/* DELETE BUTTON */}
      <button
        type="button"
        onClick={() => removeSection(index)}
        className="absolute top-3 right-3 text-red-400 hover:text-red-300 text-lg font-bold"
      >
        −
      </button>

      {/* Section Name */}
      <div>
        <label className="text-sm text-slate-400 mb-1 block">
          Section Name
        </label>
        <input
          value={section.name}
          onChange={(e) =>
            handleSectionChange(index, "name", e.target.value)
          }
          className="input"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        
        {/* Number of Questions */}
        <div>
          <label className="text-sm text-slate-400 mb-1 block">
            Number of Questions
          </label>
          <input
            type="number"
            min="0"
            value={section.count}
            onChange={(e) =>
              handleSectionChange(index, "count", Number(e.target.value))
            }
            className="input"
          />
        </div>

        {/* Marks Per Question */}
        <div>
          <label className="text-sm text-slate-400 mb-1 block">
            Marks Per Question
          </label>
          <input
            type="number"
            min="0"
            value={section.marks}
            onChange={(e) =>
              handleSectionChange(index, "marks", Number(e.target.value))
            }
            className="input"
          />
        </div>

      </div>
    </div>
  ))}

  <button
    type="button"
    onClick={addSection}
    className="btn-primary"
  >
    + Add Section
  </button>
</div>
          {/* ===== SINGLE PREMIUM ADD BUTTON SECTION ===== */}
          {/* ===== GPT STYLE AI REFERENCE SECTION ===== */}
<div className="config-card relative">
  <h2 className="config-heading">AI Reference (Optional)</h2>

  {/* Hidden Inputs */}
  <input
    type="file"
    accept=".pdf,.doc,.docx"
    id="fileUpload"
    style={{ display: "none" }}
    onChange={(e) => {
      setSelectedFile(e.target.files[0]);
      setSelectedImage(null);
      setShowUploadOptions(false);
    }}
  />

  <input
    type="file"
    accept="image/*"
    id="imageUpload"
    style={{ display: "none" }}
    onChange={(e) => {
      setSelectedImage(e.target.files[0]);
      setSelectedFile(null);
      setShowUploadOptions(false);
    }}
  />

  {/* Add Button */}
  <button
    type="button"
    onClick={() => setShowUploadOptions(!showUploadOptions)}
    className="btn-primary w-full flex justify-center items-center gap-2"
  >
    + Add Attachment
  </button>

  {/* Dropdown Options */}
  {showUploadOptions && (
    <div className="absolute left-0 right-0 mt-2 bg-[#0f172a] border border-[#1e293b] rounded-xl shadow-xl z-50">
      <button
        type="button"
        onClick={() => document.getElementById("fileUpload").click()}
        className="w-full text-left px-4 py-3 hover:bg-[#1e293b] rounded-t-xl"
      >
        📄 Upload File (PDF / DOC)
      </button>

      <button
        type="button"
        onClick={() => document.getElementById("imageUpload").click()}
        className="w-full text-left px-4 py-3 hover:bg-[#1e293b] rounded-b-xl"
      >
        🖼 Upload Image
      </button>
    </div>
  )}

  {/* Show Selected File */}
  {(selectedFile || selectedImage) && (
    <p className="mt-3 text-sm text-emerald-400">
      Attached: {selectedFile?.name || selectedImage?.name}
    </p>
  )}

  {/* Prompt */}
  <textarea
    rows={3}
    placeholder="Specify topic / chapter / focus (optional)"
    value={customPrompt}
    onChange={(e) => setCustomPrompt(e.target.value)}
    className="input mt-4"
  />

  {/* Generate Button Only If Something Attached */}
  {(selectedFile || selectedImage) && (
    <button
      type="button"
      onClick={generateFromFile}
      className="btn-primary mt-4 w-full"
    >
      {loading ? "Generating from Upload..." : "Generate from Upload"}
    </button>
  )}
</div>

          {/* INSTRUCTIONS */}
          <div className="config-card">
            <h2 className="config-heading">Instruction Block</h2>
            <textarea
              rows={4}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="input"
            />
          </div>

          {/* WATERMARK */}
          <div className="config-card space-y-4">
            <h2 className="config-heading">Watermark Settings</h2>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={showWatermark}
                onChange={() => setShowWatermark(!showWatermark)}
              />
              <span>Enable Watermark</span>
            </div>

            {showWatermark && (
              <input
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="input"
                placeholder="Watermark Text"
              />
            )}
          </div>

          {/* TOTALS */}
          <div className="config-card">
            <p>Total Questions: {totalQuestions}</p>
            <p className="text-lg font-bold text-emerald-400">
              Total Marks: {totalMarks}
            </p>
          </div>

          <button
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Generating..." : "Generate Academic Paper"}
          </button>
        </form>

        {/* RIGHT LIVE PREVIEW */}
        <div
          ref={previewRef}
          className="relative bg-white text-black p-10 rounded-2xl shadow-2xl h-[650px] overflow-y-auto"
        >
          {showWatermark && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <h1 className="text-6xl font-black text-gray-200 rotate-[-30deg] opacity-20">
                {watermarkText}
              </h1>
            </div>
          )}

          <div className="relative z-10 text-center border-b pb-6 mb-8">
            <h2 className="font-bold uppercase text-lg">
              {form.schoolName || "SCHOOL NAME"}
            </h2>
            <p className="text-sm text-gray-600">{form.board}</p>
            <h3 className="mt-3 font-semibold text-lg">
              {form.test || "Exam Title"}
            </h3>
            <p className="mt-4 text-sm">
              Class: {form.className || "Class"} | Duration: {form.duration}
            </p>
            <p className="mt-3 font-semibold">
              Total Questions: {totalQuestions} | Total Marks: {totalMarks}
            </p>
          </div>

          <h4 className="font-bold text-base mb-4">
            Marks Distribution
          </h4>

          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Section</th>
                <th className="p-2 text-center">Questions</th>
                <th className="p-2 text-center">Marks Each</th>
                <th className="p-2 text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((sec, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{sec.name}</td>
                  <td className="p-2 text-center">{sec.count}</td>
                  <td className="p-2 text-center">{sec.marks}</td>
                  <td className="p-2 text-center font-semibold">
                    {sec.count * sec.marks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-8">
            <h4 className="font-bold mb-2">Instructions:</h4>
            <pre className="whitespace-pre-wrap text-sm">
              {instructions}
            </pre>
          </div>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          background: #0f172a;
          border: 1px solid #1e293b;
          outline: none;
          transition: all 0.3s ease;
        }
        .input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 2px rgba(16,185,129,0.2);
        }
        .config-card {
          background: rgba(15, 23, 42, 0.6);
          padding: 20px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .config-heading {
          font-weight: 700;
          color: #10b981;
          margin-bottom: 10px;
        }
        .btn-primary {
          background: #10b981;
          padding: 12px 18px;
          border-radius: 12px;
          font-weight: 600;
          transition: 0.3s;
        }
        .btn-primary:hover {
          background: #059669;
        }
      `}</style>
    </div>
  );
};

export default GeneratorPage;
