import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

const QuestionPapers = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const teacher =
        JSON.parse(localStorage.getItem("teacher")) ||
        JSON.parse(localStorage.getItem("user")) ||
        JSON.parse(localStorage.getItem("auth"));

      const teacherId =
        teacher?.id ||
        teacher?._id ||
        teacher?.user?._id ||
        teacher?.user?.id;

      if (!teacherId) return;

      const res = await API.get(`/papers/teacher/${teacherId}`);
      setPapers(res.data || []);
    } catch (err) {
      console.error("Fetch Papers Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this paper?")) return;

    try {
      await API.delete(`/papers/${id}`);
      setPapers((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-400">
        Loading papers...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 relative overflow-hidden">

      {/* Ambient Glow Background */}
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-emerald-500/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-green-400/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-[1500px] mx-auto px-6 lg:px-12 py-14">

        {/* Header */}
        <div className="mb-14">
          <h1 className="text-4xl font-black tracking-tight text-white">
            Question{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">
              Papers
            </span>
          </h1>

          <p className="text-slate-500 mt-3">
            Manage and review your saved academic assessments.
          </p>
        </div>

        {/* Empty State */}
        {papers.length === 0 && (
          <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-2xl bg-slate-900/40 backdrop-blur-sm">
            <p className="text-slate-500 font-semibold">
              No saved papers yet.
            </p>
            <button
              onClick={() => navigate("/generator")}
              className="mt-6 text-emerald-400 text-sm font-semibold hover:text-emerald-300 transition"
            >
              Generate Your First Paper →
            </button>
          </div>
        )}

        {/* Papers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {papers.map((paper) => (
            <div
              key={paper._id}
              className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10"
            >
              <h2 className="text-xl font-bold text-white mb-4 tracking-tight">
                {paper.title}
              </h2>

              <div className="space-y-2 text-sm text-slate-400 mb-6">
                <p>
                  <span className="text-slate-500">Subject:</span>{" "}
                  {paper.subject}
                </p>
                <p>
                  <span className="text-slate-500">Questions:</span>{" "}
                  {paper.questions?.length || 0}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => navigate(`/paper/${paper._id}`)}
                  className="flex-1 py-2 bg-gradient-to-r from-emerald-600 to-green-500 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
                >
                  View
                </button>

                <button
                  onClick={() => handleDelete(paper._id)}
                  className="flex-1 py-2 bg-red-600/80 hover:bg-red-600 rounded-xl text-sm font-semibold transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default QuestionPapers;