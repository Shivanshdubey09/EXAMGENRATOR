import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";

const TeacherLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      const res = await API.post("/teachers/login", { email, password });
      localStorage.setItem("teacher", JSON.stringify(res.data));
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center relative overflow-hidden text-white">

      {/* ========= Animated Emerald Glow Background ========= */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/20 blur-[140px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-green-400/10 blur-[140px] rounded-full animate-pulse delay-1000" />

      {/* Subtle Grid Texture */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(#10b981 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* ========= Login Card ========= */}
      <div className="relative z-10 w-full max-w-md px-8">

        {/* Logo / Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-xl mb-6 shadow-lg shadow-emerald-500/20 transition-all duration-500 hover:-translate-y-2 hover:rotate-6 hover:shadow-emerald-400/40 hover:scale-110 cursor-pointer">
            🎓
          </div>

          <h1 className="text-3xl font-black tracking-tight">
            Exam<span className="text-emerald-400">AI</span>
          </h1>

          <p className="text-slate-400 text-sm mt-2">
            Secure academic workspace access
          </p>
        </div>

        {/* Glass Card */}
        <form
          onSubmit={handleLogin}
          className="bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-[2rem] p-10 shadow-[0_40px_120px_rgba(0,0,0,0.6)] hover:border-emerald-500/40 transition-all duration-500"
        >
          <div className="space-y-6">

            {/* Email */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="example@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
              />
            </div>

            {/* Password with Toggle */}
            <div className="relative">
              <label className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field pr-16"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[42px] text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-emerald-500" />
                Remember me
              </label>
              <span className="hover:text-emerald-400 cursor-pointer transition">
                Forgot?
              </span>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 text-[#020617] font-black tracking-wide shadow-lg shadow-emerald-500/30 hover:shadow-emerald-400/50 hover:scale-[1.02] active:scale-95 transition-all duration-300"
            >
              Authenticate →
            </button>

            <div className="text-center pt-6 text-sm text-slate-500">
              Don’t have access?{" "}
              <Link
                to="/register"
                className="text-emerald-400 font-semibold hover:text-emerald-300 transition"
              >
                Register Workspace
              </Link>
            </div>
          </div>
        </form>

        {/* Bottom Hint */}
        <p className="text-center text-[10px] text-slate-600 uppercase tracking-[0.3em] mt-10">
          Academic Intelligence Portal v1.0
        </p>
      </div>

      <style>{`
        .input-field {
          width: 100%;
          padding: 14px 16px;
          border-radius: 14px;
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
      `}</style>
    </div>
  );
};

export default TeacherLogin;