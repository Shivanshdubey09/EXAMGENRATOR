// // import React, { useEffect } from 'react';
// // import { Link, useNavigate } from 'react-router-dom';

// // const LandingPage = () => {
// //   const navigate = useNavigate();
// //   const teacher = localStorage.getItem('teacher');

// //   // 🔁 Auto-redirect logged-in users
// //   useEffect(() => {
// //     if (teacher) {
// //       navigate('/dashboard');
// //     }
// //   }, [teacher, navigate]);

// //   return (
// //     <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">

// //       {/* ===== NAVBAR ===== */}
// //       <nav className="flex justify-between items-center px-8 py-5 border-b bg-white">
// //         <div className="flex items-center gap-2">
// //           <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
// //             E
// //           </div>
// //           <div>
// //             <span className="text-xl font-bold">ExamGen Pro</span>
// //             <p className="text-xs text-gray-500 -mt-1">Smart Exam Generator</p>
// //           </div>
// //         </div>

// //         {!teacher ? (
// //           /* 🔧 FIXED BUTTON ALIGNMENT */
// //           <div className="flex items-center gap-3">
// //             <Link
// //               to="/login"
// //               className="px-4 py-2 rounded-lg
// //                          text-indigo-600 font-medium
// //                          hover:bg-indigo-50 transition"
// //             >
// //               Login
// //             </Link>

// //             <Link
// //               to="/register"
// //               className="px-4 py-2 rounded-lg
// //                          bg-indigo-600 text-white font-semibold
// //                          hover:bg-indigo-700 transition"
// //             >
// //               Register
// //             </Link>
// //           </div>
// //         ) : (
// //           <button
// //             onClick={() => navigate('/dashboard')}
// //             className="px-4 py-2 rounded-lg
// //                        bg-indigo-600 text-white font-semibold
// //                        hover:bg-indigo-700 transition"
// //           >
// //             Go to Dashboard
// //           </button>
// //         )}
// //       </nav>

// //       {/* ===== HERO SECTION ===== */}
// //       <section className="text-center px-6 py-20 max-w-4xl mx-auto animate-fade-up">
// //         <span className="inline-block mb-4 px-4 py-1 text-sm rounded-full bg-indigo-50 text-indigo-600 font-medium">
// //           Trusted by 500+ Educators
// //         </span>

// //         <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
// //           Generate Randomized
// //           <span className="block text-indigo-600 mt-2">
// //             Exam Papers in Minutes
// //           </span>
// //         </h1>

// //         <p className="mt-6 text-gray-600 text-lg">
// //           Create fair and diverse assessments with our intelligent exam paper
// //           generator. Manage question banks, upload questions, and generate
// //           customized papers effortlessly.
// //         </p>

// //         <div className="mt-8 flex justify-center gap-4">
// //           <Link
// //             to="/login"
// //             className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
// //           >
// //             Start Creating Exams →
// //           </Link>

// //           <button className="border px-6 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-100">
// //             View Demo
// //           </button>
// //         </div>

// //         {/* ===== STATS ===== */}
// //         <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center animate-fade-up animate-delay-2">
// //           <Stat value="10K+" label="Questions Created" />
// //           <Stat value="5K+" label="Exams Generated" />
// //           <Stat value="500+" label="Active Teachers" />
// //         </div>
// //       </section>

// //       {/* ===== FEATURES ===== */}
// //       <section className="px-6 pb-24 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
// //         <Feature
// //           title="Question Bank Management"
// //           desc="Create and organize questions by subject, topic, and difficulty."
// //           points={[
// //             'Multiple question types (MCQ, Short)',
// //             'Filter by difficulty & subject',
// //             'Subject-wise organization',
// //           ]}
// //         />
// //         <Feature
// //           title="Bulk Upload Questions"
// //           desc="Import questions from Excel or CSV files."
// //           points={[
// //             'Excel & CSV support',
// //             'Drag & drop upload',
// //             'Bulk validation',
// //           ]}
// //         />
// //         <Feature
// //           title="Smart Randomization"
// //           desc="Generate balanced exam papers automatically."
// //           points={[
// //             'Difficulty-based distribution',
// //             'Topic-wise balance',
// //             'Fair assessments',
// //           ]}
// //         />
// //       </section>

// //       {/* ===== WHY CHOOSE ===== */}
// //       <section className="bg-slate-50 py-20 text-center">
// //         <h2 className="text-3xl font-bold mb-12 animate-fade-up">
// //           Why Choose <span className="text-indigo-600">ExamGen Pro?</span>
// //         </h2>

// //         <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
// //           <WhyCard icon="⏱️" title="Save Time" desc="Generate exam papers in minutes instead of hours." />
// //           <WhyCard icon="🛡️" title="Fair Assessment" desc="Ensure fairness with randomized question sets." />
// //           <WhyCard icon="✨" title="Easy to Use" desc="Clean and intuitive interface designed for educators." />
// //         </div>
// //       </section>

// //       {/* ===== FOOTER ===== */}
// //       <footer className="bg-white border-t mt-20">
// //         <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
// //           <div>
// //             <div className="flex items-center gap-2 mb-3">
// //               <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
// //                 E
// //               </div>
// //               <span className="text-lg font-bold">ExamGen Pro</span>
// //             </div>
// //             <p className="text-sm text-gray-500">
// //               Smart exam paper generator for educators.
// //               Build fair, fast, and reliable assessments.
// //             </p>
// //           </div>

// //           <div>
// //             <h4 className="font-semibold mb-3">Product</h4>
// //             <ul className="space-y-2 text-sm text-gray-500">
// //               <li>Question Bank</li>
// //               <li>Bulk Upload</li>
// //               <li>Exam Generator</li>
// //               <li>Preview & Export</li>
// //             </ul>
// //           </div>

// //           <div>
// //             <h4 className="font-semibold mb-3">Project Info</h4>
// //             <ul className="space-y-2 text-sm text-gray-500">
// //               <li>Final Year Project</li>
// //               <li>React • Node • MongoDB</li>
// //               <li>ExamGen v1.0</li>
// //             </ul>
// //           </div>
// //         </div>

// //         <div className="text-center text-xs text-gray-400 py-4 border-t">
// //           © {new Date().getFullYear()} ExamGen Pro • Academic Project
// //         </div>
// //       </footer>

// //     </div>
// //   );
// // };

// // /* ===== SMALL COMPONENTS ===== */

// // const Feature = ({ title, desc, points }) => (
// //   <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow hover:-translate-y-1 transition animate-fade-up">
// //     <h3 className="font-bold text-lg mb-2">{title}</h3>
// //     <p className="text-gray-500 text-sm mb-4">{desc}</p>
// //     <ul className="text-sm text-gray-600 space-y-1">
// //       {points.map((p, i) => (
// //         <li key={i}>• {p}</li>
// //       ))}
// //     </ul>
// //   </div>
// // );

// // const Stat = ({ value, label }) => (
// //   <div>
// //     <h3 className="text-3xl font-bold text-indigo-600">{value}</h3>
// //     <p className="text-sm text-gray-500">{label}</p>
// //   </div>
// // );

// // const WhyCard = ({ icon, title, desc }) => (
// //   <div className="animate-fade-up">
// //     <div className="text-4xl mb-4">{icon}</div>
// //     <h3 className="font-semibold text-lg">{title}</h3>
// //     <p className="text-gray-500 mt-2">{desc}</p>
// //   </div>
// // );

// // export default LandingPage;
// import React, { useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// const LandingPage = () => {
//   const navigate = useNavigate();
//   const teacher = localStorage.getItem('teacher');

//   // 🔁 Auto-redirect logged-in users
//   useEffect(() => {
//     if (teacher) {
//       navigate('/dashboard');
//     }
//   }, [teacher, navigate]);

//   return (
//     <div className="relative min-h-screen overflow-hidden bg-[#050505] text-slate-100 font-sans">

//       {/* ===== ANIMATED BACKGROUND (DASHBOARD STYLE) ===== */}
//       <div className="absolute inset-0 -z-10">
//         <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-indigo-600/30 rounded-full blur-[160px] animate-pulse" />
//         <div className="absolute top-1/3 -right-40 w-[420px] h-[420px] bg-purple-600/30 rounded-full blur-[150px] animate-pulse delay-1000" />
//         <div className="absolute bottom-0 left-1/4 w-[360px] h-[360px] bg-emerald-500/20 rounded-full blur-[140px] animate-pulse delay-2000" />
//       </div>

//       {/* ===== NAVBAR ===== */}
//       <nav className="flex justify-between items-center px-8 py-5
//         bg-black/40 backdrop-blur-xl
//         border-b border-slate-800">

//         <div className="flex items-center gap-3">
//           <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black">
//             E
//           </div>
//           <div>
//             <span className="text-xl font-black tracking-tight">ExamGen Pro</span>
//             <p className="text-xs text-slate-400 -mt-1">Smart Exam Generator</p>
//           </div>
//         </div>

//         {!teacher ? (
//           <div className="flex items-center gap-3">
//             <Link
//               to="/login"
//               className="px-4 py-2 rounded-lg
//               text-slate-300 hover:text-white
//               hover:bg-white/10 transition"
//             >
//               Login
//             </Link>

//             <Link
//               to="/register"
//               className="px-4 py-2 rounded-lg
//               bg-indigo-600 text-white font-semibold
//               hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/30"
//             >
//               Register
//             </Link>
//           </div>
//         ) : (
//           <button
//             onClick={() => navigate('/dashboard')}
//             className="px-4 py-2 rounded-lg
//             bg-indigo-600 text-white font-semibold
//             hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/30"
//           >
//             Go to Dashboard
//           </button>
//         )}
//       </nav>

//       {/* ===== HERO SECTION ===== */}
//       <section className="text-center px-6 py-24 max-w-4xl mx-auto animate-fade-up">
//         <span className="inline-block mb-4 px-4 py-1 text-sm rounded-full
//           bg-indigo-500/10 text-indigo-400 font-semibold">
//           Trusted by 500+ Educators
//         </span>

//         <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
//           Generate Randomized
//           <span className="block text-indigo-500 mt-2">
//             Exam Papers in Minutes
//           </span>
//         </h1>

//         <p className="mt-6 text-slate-400 text-lg leading-relaxed">
//           Create fair and diverse assessments with our intelligent exam paper
//           generator. Manage question banks, upload questions, and generate
//           customized papers effortlessly.
//         </p>

//         <div className="mt-10 flex justify-center gap-4">
//           <Link
//             to="/login"
//             className="bg-indigo-600 text-white px-7 py-3 rounded-xl
//             font-bold hover:bg-indigo-500 transition shadow-xl shadow-indigo-600/30"
//           >
//             Start Creating Exams →
//           </Link>

//           <button className="border border-slate-700 px-7 py-3 rounded-xl
//             font-semibold text-slate-300 hover:bg-white/10 transition">
//             View Demo
//           </button>
//         </div>

//         {/* ===== STATS ===== */}
//         <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center animate-fade-up">
//           <Stat value="10K+" label="Questions Created" />
//           <Stat value="5K+" label="Exams Generated" />
//           <Stat value="500+" label="Active Teachers" />
//         </div>
//       </section>

//       {/* ===== FEATURES ===== */}
//       <section className="px-6 pb-24 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
//         <Feature
//           title="Question Bank Management"
//           desc="Create and organize questions by subject, topic, and difficulty."
//           points={[
//             'Multiple question types (MCQ, Short)',
//             'Filter by difficulty & subject',
//             'Subject-wise organization',
//           ]}
//         />
//         <Feature
//           title="Bulk Upload Questions"
//           desc="Import questions from Excel or CSV files."
//           points={[
//             'Excel & CSV support',
//             'Drag & drop upload',
//             'Bulk validation',
//           ]}
//         />
//         <Feature
//           title="Smart Randomization"
//           desc="Generate balanced exam papers automatically."
//           points={[
//             'Difficulty-based distribution',
//             'Topic-wise balance',
//             'Fair assessments',
//           ]}
//         />
//       </section>

//       {/* ===== WHY CHOOSE ===== */}
//       <section className="bg-black/40 backdrop-blur-xl py-24 text-center border-t border-slate-800">
//         <h2 className="text-3xl font-black mb-14 animate-fade-up">
//           Why Choose <span className="text-indigo-500">ExamGen Pro?</span>
//         </h2>

//         <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
//           <WhyCard icon="⏱️" title="Save Time" desc="Generate exam papers in minutes instead of hours." />
//           <WhyCard icon="🛡️" title="Fair Assessment" desc="Ensure fairness with randomized question sets." />
//           <WhyCard icon="✨" title="Easy to Use" desc="Clean and intuitive interface designed for educators." />
//         </div>
//       </section>

//       {/* ===== FOOTER ===== */}
//       <footer className="bg-black/40 backdrop-blur-xl border-t border-slate-800 mt-20">
//         <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">

//           <div>
//             <div className="flex items-center gap-2 mb-3">
//               <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black">
//                 E
//               </div>
//               <span className="text-lg font-black">ExamGen Pro</span>
//             </div>
//             <p className="text-sm text-slate-400">
//               Smart exam paper generator for educators.
//               Build fair, fast, and reliable assessments.
//             </p>
//           </div>

//           <div>
//             <h4 className="font-semibold mb-3">Product</h4>
//             <ul className="space-y-2 text-sm text-slate-400">
//               <li>Question Bank</li>
//               <li>Bulk Upload</li>
//               <li>Exam Generator</li>
//               <li>Preview & Export</li>
//             </ul>
//           </div>

//           <div>
//             <h4 className="font-semibold mb-3">Project Info</h4>
//             <ul className="space-y-2 text-sm text-slate-400">
//               <li>Final Year Project</li>
//               <li>React • Node • MongoDB</li>
//               <li>ExamGen v1.0</li>
//             </ul>
//           </div>
//         </div>

//         <div className="text-center text-xs text-slate-500 py-4 border-t border-slate-800">
//           © {new Date().getFullYear()} ExamGen Pro • Academic Project
//         </div>
//       </footer>

//     </div>
//   );
// };

// /* ===== SMALL COMPONENTS ===== */

// const Feature = ({ title, desc, points }) => (
//   <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6
//     backdrop-blur-xl hover:-translate-y-2 hover:border-slate-600
//     transition animate-fade-up">
//     <h3 className="font-bold text-lg mb-2">{title}</h3>
//     <p className="text-slate-400 text-sm mb-4">{desc}</p>
//     <ul className="text-sm text-slate-400 space-y-1">
//       {points.map((p, i) => (
//         <li key={i}>• {p}</li>
//       ))}
//     </ul>
//   </div>
// );

// const Stat = ({ value, label }) => (
//   <div>
//     <h3 className="text-3xl font-black text-indigo-500">{value}</h3>
//     <p className="text-sm text-slate-400">{label}</p>
//   </div>
// );

// const WhyCard = ({ icon, title, desc }) => (
//   <div className="animate-fade-up">
//     <div className="text-4xl mb-4">{icon}</div>
//     <h3 className="font-semibold text-lg">{title}</h3>
//     <p className="text-slate-400 mt-2">{desc}</p>
//   </div>
// );

// export default LandingPage;

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const teacher = localStorage.getItem('teacher');

  useEffect(() => {
    if (teacher) navigate('/dashboard');
  }, [teacher, navigate]);

  return (
    <div className="relative min-h-screen bg-[#010810] text-slate-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* --- KINETIC BACKGROUND --- */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-emerald-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse delay-1000" />
        {/* Vector Grid Mask */}
        <div className="absolute inset-0 opacity-[0.15]" 
             style={{backgroundImage: `radial-gradient(#2dd4bf 0.5px, transparent 0.5px)`, backgroundSize: '30px 30px'}}></div>
      </div>

      {/* --- HERO SECTION: ASYMMETRIC 3D LAYOUT --- */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 flex flex-col lg:flex-row items-center gap-16">
        
        {/* LEFT: CONTENT AREA */}
        <div className="w-full lg:w-3/5 space-y-8 animate-fade-in-left">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">V1.0.4 Deploying AI Models</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Architect</span> <br /> 
            of Modern Exams.
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed">
            A high-fidelity workspace for educators. Upload datasets, manage complex question banks, and generate randomized assessments with mathematical precision.
          </p>

          <div className="flex flex-wrap gap-5 pt-4">
            {!teacher ? (
              <>
                <Link to="/register" className="px-8 py-4 bg-emerald-500 text-slate-950 font-black rounded-xl hover:bg-emerald-400 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.4)] transition-all duration-300">
                  Initialize Workspace
                </Link>
                <Link to="/login" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black rounded-xl hover:bg-white/10 backdrop-blur-md transition-all">
                  Secure Login
                </Link>
              </>
            ) : (
              <button onClick={() => navigate('/dashboard')} className="px-10 py-4 bg-white text-slate-900 font-black rounded-xl hover:scale-105 transition-transform shadow-2xl">
                Access Core Dashboard →
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: THE 3D PANEL (Floating Portal) */}
        <div className="w-full lg:w-2/5 relative perspective-1000">
          <div className="relative bg-gradient-to-br from-white/10 to-transparent p-1 border border-white/20 rounded-[3rem] shadow-2xl transform rotate-y-[-15deg] rotate-x-[10deg] hover:rotate-y-[0deg] transition-all duration-1000 group">
            <div className="bg-[#020c18] rounded-[2.8rem] p-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl group-hover:bg-emerald-500/20 transition-colors" />
              
              {/* Stat Elements inside 3D card */}
              <div className="space-y-8 relative z-10">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                   <div className="text-3xl font-black text-emerald-400 tracking-tight">100%</div>
                   <div className="text-[10px] text-slate-500 uppercase font-black">Data Encryption</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                   <div className="text-3xl font-black text-cyan-400 tracking-tight">Instant</div>
                   <div className="text-[10px] text-slate-500 uppercase font-black">Generation Speed</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                   <div className="text-3xl font-black text-white tracking-tight">5,000+</div>
                   <div className="text-[10px] text-slate-500 uppercase font-black">Question Database</div>
                </div>
              </div>

              {/* Decorative Geometric Shapes */}
              <div className="mt-8 flex justify-between items-end">
                <div className="h-12 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <div className="h-24 w-1.5 bg-cyan-500 rounded-full animate-pulse delay-75" />
                <div className="h-16 w-1.5 bg-emerald-300 rounded-full animate-pulse delay-150" />
                <div className="h-20 w-1.5 bg-blue-500 rounded-full animate-pulse delay-300" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- THE BENTO-GRID FEATURES --- */}
      <section className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] hover:border-emerald-500/50 transition-all group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📊</div>
            <h3 className="text-xl font-black mb-2">Advanced Analytics</h3>
            <p className="text-slate-500 text-sm">Track how questions perform across different difficulty tiers and batches.</p>
          </div>
          <div className="p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] hover:border-emerald-500/50 transition-all">
            <div className="text-4xl mb-4">📂</div>
            <h3 className="text-xl font-black mb-2">JSON Export</h3>
            <p className="text-slate-500 text-sm">Portable data formats.</p>
          </div>
          <div className="p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] hover:border-emerald-500/50 transition-all">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-black mb-2">FairPlay</h3>
            <p className="text-slate-500 text-sm">Anti-bias algorithms.</p>
          </div>
        </div>
      </section>

      {/* --- MINIMAL FOOTER --- */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/5 text-center">
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">
          Powered by ExamGen AI • Academic Intelligence Unit 2025
        </p>
      </footer>

      {/* Custom Global CSS for Perspective and Animations */}
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .rotate-y-[-15deg] { transform: rotateY(-15deg) rotateX(10deg); }
        
        @keyframes fade-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-left { animation: fade-in-left 1s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default LandingPage;