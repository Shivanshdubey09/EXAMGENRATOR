import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import PaperCard from "../components/PaperCard";

const TeacherDashboard = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  /* ================= LOAD TEACHER ================= */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("teacher");
      if (raw && raw !== "undefined") {
        setTeacher(JSON.parse(raw));
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }, []);

  /* ================= LOAD PAPERS ================= */
  useEffect(() => {
    if (!teacher?._id) return;

    setLoading(true);

    API.get(`/papers/teacher/${teacher._id}`)
      .then((res) => setPapers(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [teacher?._id]);

  /* ================= SEARCH ================= */
  const filteredPapers = useMemo(() => {
    return papers.filter(
      (p) =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subject?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [papers, searchQuery]);

  /* ================= GREETING ================= */
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  /* ================= AUTH FAIL ================= */
  if (!teacher && !loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
        <div className="bg-slate-900/60 border border-emerald-500/20 backdrop-blur-xl p-12 rounded-3xl text-center shadow-2xl max-w-sm">
          <div className="text-4xl mb-6">🔐</div>
          <h3 className="text-xl font-bold text-white mb-2">
            Session Expired
          </h3>
          <p className="text-slate-400 mb-8 text-sm">
            Please login again to continue.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/20"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 relative overflow-hidden">

      {/* Ambient Background Glow */}
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-emerald-500/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-green-400/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row max-w-[1600px] mx-auto min-h-screen">

        {/* ================= SIDEBAR ================= */}
        <aside className="lg:w-80 p-10 bg-slate-950/70 border-r border-white/5 backdrop-blur-xl flex flex-col justify-between">

          <div>
            <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center text-2xl mb-8 shadow-lg shadow-emerald-500/20">
              🎓
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight">
              {teacher?.name}
            </h2>

            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mt-2">
              {teacher?.subject || "Lead Educator"}
            </p>
          </div>

          <nav className="space-y-4 mt-16">
            <button
              onClick={() => navigate("/generator")}
              className="w-full p-4 bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-2xl font-semibold hover:shadow-xl hover:shadow-emerald-500/30 transition-all"
            >
              + New Assessment
            </button>

            <button
              onClick={() => navigate("/question-bank")}
              className="w-full p-4 text-slate-400 font-semibold hover:bg-white/5 hover:text-emerald-400 rounded-2xl transition-all"
            >
              Question Bank
            </button>
          </nav>
        </aside>

        {/* ================= MAIN ================= */}
        <main className="flex-1 px-8 lg:px-16 py-12">

          {/* HEADER */}
          <header className="mb-16">
            <h1 className="text-5xl font-black text-white tracking-tight leading-tight">
              {greeting},{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">
                {teacher?.name?.split(" ")[0]}
              </span>
            </h1>

            <p className="text-slate-500 font-medium mt-4">
              Manage, generate, and organize your academic assessments.
            </p>
          </header>

          {/* ================= RECENT PROJECTS ================= */}
          <section className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-12 backdrop-blur-sm">

            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
              <h2 className="text-3xl font-bold text-white">
                Recent Assessments
              </h2>

              <input
                type="text"
                placeholder="Search title or subject..."
                className="w-full md:w-96 bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-slate-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="py-24 text-center text-slate-500">
                Loading assessments...
              </div>
            ) : filteredPapers.length === 0 ? (
              <div className="py-28 text-center border-2 border-dashed border-white/5 rounded-2xl">
                <p className="text-slate-500 font-semibold">
                  No assessments created yet.
                </p>
                <button
                  onClick={() => navigate("/generator")}
                  className="mt-6 text-emerald-400 text-sm font-semibold hover:text-emerald-300 transition"
                >
                  Create Your First →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {filteredPapers.map((paper) => (
                  <PaperCard
                    key={paper._id}
                    paper={paper}
                    onClick={() => navigate(`/paper/${paper._id}`)}
                  />
                ))}
              </div>
            )}
          </section>

        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;