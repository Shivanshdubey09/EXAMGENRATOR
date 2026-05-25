import React from "react";

const QuestionCard = ({ question, onSelect }) => {
  return (
    <div className="relative group cursor-pointer transition-all duration-500 hover:-translate-y-1">

      {/* Emerald Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/15 to-green-400/15 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Card */}
      <div className="relative bg-slate-900/70 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-lg transition-all duration-500 hover:shadow-emerald-500/20">

        {/* Top Gradient Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-green-500 rounded-t-2xl opacity-70 group-hover:opacity-100 transition-all" />

        <div className="relative z-10">

          {/* Question Text */}
          <p className="text-white text-sm font-medium leading-relaxed mb-4">
            {question.question}
          </p>

          {/* Metadata */}
          <div className="flex flex-wrap gap-3 text-xs mb-4">

            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
              {question.subject}
            </span>

            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              {question.difficulty}
            </span>

            <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
              {question.type}
            </span>

          </div>

          {/* Action Button */}
          <button
            onClick={() => onSelect(question)}
            className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white text-xs font-bold py-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-emerald-500/30"
          >
            + Add to Paper
          </button>

        </div>
      </div>
    </div>
  );
};

export default QuestionCard;