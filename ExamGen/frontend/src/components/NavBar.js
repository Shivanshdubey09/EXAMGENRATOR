import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const teacher = localStorage.getItem("teacher");

  if (["/", "/login", "/register"].includes(location.pathname)) {
    return null;
  }

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("teacher");
    setIsOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* ================= TOP NAVBAR ================= */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-8 py-4
        bg-white/80 backdrop-blur-xl border-b border-emerald-100 shadow-sm">

        {/* LOGO */}
        <div
          onClick={() => navigate("/dashboard")}
          className="group cursor-pointer flex items-center gap-3"
        >
          <div className="bg-gradient-to-tr from-emerald-600 to-green-500 p-2.5 rounded-xl shadow-lg shadow-emerald-500/30 group-hover:rotate-12 transition-transform duration-300">
            <span className="text-white font-black text-lg">Q</span>
          </div>

          <h1 className="text-slate-800 font-black text-xl tracking-tighter">
            EXAM
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-500">
              .AI
            </span>
          </h1>
        </div>

        {/* ================= DESKTOP LINKS ================= */}
        <div className="hidden md:flex items-center gap-8">
          {teacher && (
            <>
              <Link
                to="/dashboard"
                className="text-slate-500 hover:text-emerald-600 font-bold text-sm uppercase tracking-wider transition"
              >
                Home
              </Link>

              <Link
                to="/generator"
                className="text-slate-500 hover:text-emerald-600 font-bold text-sm uppercase tracking-wider transition"
              >
                Generator
              </Link>

              <Link
                to="/question-bank"
                className="text-slate-500 hover:text-emerald-600 font-bold text-sm uppercase tracking-wider transition"
              >
                Question Bank
              </Link>

              <Link
                to="/question-papers"
                className="text-slate-500 hover:text-emerald-600 font-bold text-sm uppercase tracking-wider transition"
              >
                Question Papers
              </Link>
            </>
          )}
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center gap-6">
          {!teacher ? (
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/login")}
                className="text-slate-600 font-bold text-sm"
              >
                Sign In
              </button>

              <button
                onClick={() => navigate("/register")}
                className="bg-emerald-600 text-white px-5 py-2.5 rounded-full font-bold text-sm
                hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
              >
                Get Started
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">
                  Status
                </span>
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                  <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                  Teacher Online
                </span>
              </div>

              {/* MENU BUTTON */}
              <button
                onClick={toggleMenu}
                className="p-2.5 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
              >
                <div className="space-y-1.5">
                  <span
                    className={`block h-0.5 bg-emerald-600 rounded transition-all duration-300 ${
                      isOpen
                        ? "w-6 rotate-45 translate-y-2"
                        : "w-6"
                    }`}
                  />
                  <span
                    className={`block h-0.5 bg-emerald-600 rounded transition-all duration-300 ${
                      isOpen ? "opacity-0" : "w-4"
                    }`}
                  />
                  <span
                    className={`block h-0.5 bg-emerald-600 rounded transition-all duration-300 ${
                      isOpen
                        ? "w-6 -rotate-45 -translate-y-2"
                        : "w-6"
                    }`}
                  />
                </div>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ================= SLIDE-OUT MENU ================= */}
      <aside
        className={`fixed top-0 right-0 h-full w-80
        bg-white/90 backdrop-blur-2xl border-l border-emerald-100
        transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-500 ease-in-out
        z-[100] p-10 shadow-[-20px_0_60px_-15px_rgba(16,185,129,0.2)]`}
      >
        <div className="flex justify-between items-center mb-12">
          <span className="text-slate-400 font-black text-xs tracking-[0.3em] uppercase">
            Navigation
          </span>

          <button
            onClick={toggleMenu}
            className="text-slate-400 hover:text-red-500 text-2xl"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col space-y-2">
          {[
            { to: "/dashboard", label: "Dashboard", icon: "🏠" },
            { to: "/generator", label: "AI Generator", icon: "✨" },
            { to: "/question-bank", label: "Question Bank", icon: "📁" },
            { to: "/question-papers", label: "Question Papers", icon: "📄" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={toggleMenu}
              className="group flex items-center justify-between p-4 rounded-2xl
              hover:bg-emerald-50 transition-all"
            >
              <div className="flex items-center gap-4">
                <span className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-110 transition">
                  {item.icon}
                </span>
                <span className="font-bold text-slate-700 group-hover:text-emerald-600">
                  {item.label}
                </span>
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition text-emerald-400">
                →
              </span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-10 left-10 right-10 space-y-6">
          <button
            onClick={handleLogout}
            className="w-full py-4 rounded-2xl border-2 border-slate-100
            text-slate-400 font-bold hover:border-red-200 hover:text-red-500 transition-all"
          >
            Sign Out
          </button>

          <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            Academic Suite v1.0
          </p>
        </div>
      </aside>

      {/* OVERLAY */}
      {isOpen && (
        <div
          onClick={toggleMenu}
          className="fixed inset-0 bg-emerald-900/10 backdrop-blur-[2px] z-[90]"
        />
      )}
    </>
  );
};

export default Navbar;