import React from "react";

const PaperCard = ({ paper, onRegenerate, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="relative group cursor-pointer
      bg-slate-900/60 backdrop-blur-xl
      border border-emerald-500/10
      rounded-3xl p-6
      transition-all duration-300
      hover:-translate-y-1
      hover:border-emerald-400/40
      hover:shadow-[0_20px_60px_-15px_rgba(16,185,129,0.35)]"
    >
      {/* Emerald Glow Background */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10">

        {/* Title */}
        <h3 className="text-xl font-black text-white tracking-tight mb-2 group-hover:text-emerald-400 transition">
          {paper.title || "Untitled Paper"}
        </h3>

        {/* Subject */}
        <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">
          {paper.subject || "General Subject"}
        </p>

        {/* Stats */}
        <div className="flex justify-between text-slate-400 text-xs font-semibold">
          <span>
            Questions: {paper.questions?.length || 0}
          </span>
          <span>
            Marks: {paper.totalMarks || 0}
          </span>
        </div>

        {/* Date */}
        <p className="text-slate-500 text-[11px] mt-4">
          Created:{" "}
          {paper.createdAt
            ? new Date(paper.createdAt).toLocaleDateString()
            : "N/A"}
        </p>

        {/* Regenerate Button */}
        {onRegenerate && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRegenerate(paper);
            }}
            className="mt-6 w-full py-2.5 rounded-xl
            bg-gradient-to-r from-emerald-600 to-green-500
            text-white text-xs font-bold uppercase tracking-widest
            hover:shadow-lg hover:shadow-emerald-500/30
            transition-all"
          >
            Regenerate
          </button>
        )}
      </div>
    </div>
  );
};

export default PaperCard;