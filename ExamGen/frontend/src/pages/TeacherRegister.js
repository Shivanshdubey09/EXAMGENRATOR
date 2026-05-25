import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";

const TeacherRegister = () => {
  const [form, setForm] = useState({
    name: "",
    subject: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post("/teachers/register", form);
      alert("Registration successful! Welcome aboard.");
      navigate("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative bg-[#020617] text-white">

      {/* ===== Emerald AI Background ===== */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/20 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-green-400/10 blur-[160px] rounded-full animate-pulse delay-700" />
      </div>

      {/* ===== Glass Container ===== */}
      <div className="relative z-10 flex w-full max-w-6xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_30px_120px_rgba(0,0,0,0.7)]">

        {/* ===== LEFT PANEL ===== */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600/20 via-transparent to-green-500/10 p-16 flex-col justify-between border-r border-white/5 relative">

          {/* Top Branding */}
          <div>
            <div className="flex items-center gap-3 mb-12">
              <div className="h-12 w-12 bg-gradient-to-tr from-emerald-500 to-green-400 rounded-2xl flex items-center justify-center font-black shadow-lg shadow-emerald-500/30">
                AI
              </div>
              <span className="text-2xl font-black tracking-tight">
                Exam<span className="text-emerald-400">AI</span>
              </span>
            </div>

            <h2 className="text-5xl font-black leading-[1.15] mb-6">
              Build Your <br />
              <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent italic">
                Academic Engine
              </span>
            </h2>

            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Generate structured assessments, manage question banks,
              and elevate curriculum design using AI precision.
            </p>
          </div>

          {/* ===== Graduation Cap Section (Restored & Fixed) ===== */}
          <div className="relative flex justify-center items-center py-10">

            {/* Smooth Rings */}
            <div className="absolute w-64 h-64 border border-emerald-500/20 rounded-full animate-spin-slow" />
            <div className="absolute w-80 h-80 border-t border-emerald-400/30 rounded-full animate-spin-reverse" />

            {/* Cap Container */}
            <div className="relative bg-slate-900/80 p-12 rounded-[3rem] border border-white/10 backdrop-blur-md shadow-2xl transition-transform duration-500 hover:-translate-y-3">
              <div className="text-6xl">
                🎓
              </div>
            </div>
          </div>

          <div className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] text-center">
            Academic Suite 2026
          </div>
        </div>

        {/* ===== RIGHT PANEL ===== */}
        <div className="w-full lg:w-1/2 p-8 md:p-20 flex flex-col justify-center">

          <div className="max-w-md mx-auto w-full">
            <div className="mb-12">
              <h3 className="text-4xl font-black mb-3">
                Create Workspace
              </h3>
              <p className="text-slate-400">
                Set up your professional teaching environment.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">

              {[
                { label: "Full Name", name: "name", type: "text", placeholder: "e.g. Isaac Newton" },
                { label: "Department", name: "subject", type: "text", placeholder: "e.g. Physics" },
                { label: "Email Address", name: "email", type: "email", placeholder: "isaac@cambridge.edu" }
              ].map((input) => (
                <div key={input.name} className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                    {input.label}
                  </label>
                  <input
                    name={input.name}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
              ))}

              {/* Password with Toggle */}
              <div className="flex flex-col gap-2 relative">
                <label className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                  Create Password
                </label>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  onChange={handleChange}
                  required
                  className="input-field pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[38px] text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-400 text-[#020617] font-black shadow-lg shadow-emerald-500/30 hover:shadow-emerald-400/50 hover:scale-[1.02] active:scale-95 transition-all duration-300 mt-4"
              >
                Create Account →
              </button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-slate-500 text-sm">
                Already have a workspace?{" "}
                <Link
                  to="/login"
                  className="text-emerald-400 font-bold hover:text-emerald-300 transition underline underline-offset-4"
                >
                  Login Here
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .input-field {
          width: 100%;
          padding: 14px 16px;
          border-radius: 16px;
          background: #0f172a;
          border: 1px solid #1e293b;
          outline: none;
          color: white;
          transition: all 0.3s ease;
        }

        .input-field:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 2px rgba(16,185,129,0.2);
        }

        .animate-spin-slow {
          animation: spin 18s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin 24s linear infinite reverse;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TeacherRegister;