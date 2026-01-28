// // import React, { useState, useMemo, useEffect } from 'react';
// // import axios from 'axios';
// // import { useDispatch } from 'react-redux';
// // import { useNavigate } from 'react-router-dom';

// // const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// // const studentTypes = [
// //   { id: 'class10', name: 'Class 10' },
// //   { id: 'class12', name: 'Class 12' },
// //   { id: 'engineering', name: 'Engineering' },
// // ];

// // const subjectsByType = {
// //   class10: [
// //     { id: 'maths', name: 'Mathematics' },
// //     { id: 'science', name: 'Science' },
// //     { id: 'sst', name: 'Social Science' },
// //     { id: 'english', name: 'English' },
// //     { id: 'hindi', name: 'Hindi' },
// //   ],
// //   class12: [
// //     { id: 'pcm_maths', name: 'Mathematics' },
// //     { id: 'pcm_physics', name: 'Physics' },
// //     { id: 'pcm_chemistry', name: 'Chemistry' },
// //     { id: 'commerce_accounts', name: 'Accountancy' },
// //     { id: 'commerce_business', name: 'Business Studies' },
// //     { id: 'english', name: 'English' },
// //   ],
// //   engineering: [
// //     { id: 'eng_maths', name: 'Engineering Mathematics' },
// //     { id: 'ds_algo', name: 'Data Structures & Algorithms' },
// //     { id: 'os', name: 'Operating Systems' },
// //     { id: 'dbms', name: 'DBMS' },
// //     { id: 'cn', name: 'Computer Networks' },
// //     { id: 'edc', name: 'Electronics / EDC' },
// //     { id: 'signals', name: 'Signals & Systems' },
// //   ],
// // };

// // const difficulties = [
// //   { id: 'any', name: 'Any Difficulty' },
// //   { id: 'easy', name: 'Easy' },
// //   { id: 'medium', name: 'Medium' },
// //   { id: 'hard', name: 'Hard' },
// // ];

// // const questionTypes = [
// //   { id: 'mcq', name: 'Multiple Choice (MCQ)' },
// //   { id: 'true_false', name: 'True / False' },
// //   { id: 'fill_blank', name: 'Fill in the Blanks' },
// // ];

// // const GeneratorPage = () => {
// //   const [form, setForm] = useState({
// //     test: '',
// //     amount: 10,
// //     studentType: 'engineering',
// //     subject: 'eng_maths',
// //     difficulty: 'easy',
// //     questionType: 'mcq',
// //   });

// //   const [loading, setLoading] = useState(false);
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();

// //   const subjectOptions = useMemo(
// //     () => subjectsByType[form.studentType] || [],
// //     [form.studentType]
// //   );

// //   /* 🔁 Ensure valid subject when studentType changes */
// //   useEffect(() => {
// //     if (!subjectOptions.some((s) => s.id === form.subject)) {
// //       setForm((prev) => ({
// //         ...prev,
// //         subject: subjectOptions[0]?.id || '',
// //       }));
// //     }
// //   }, [subjectOptions, form.subject]);

// //   const fetchQuestions = async (e) => {
// //     e.preventDefault();

// //     if (!form.test.trim()) {
// //       return alert('Please enter a test name.');
// //     }

// //     const amountNum = Number(form.amount);
// //     if (!amountNum || amountNum < 1 || amountNum > 50) {
// //       return alert('Number of questions must be between 1 and 50.');
// //     }

// //     if (!form.subject) {
// //       return alert('Please select a subject.');
// //     }

// //     setLoading(true);
// //     try {
// //       const res = await axios.get(
// //         `${API_BASE_URL}/api/exams/generate`,
// //         {
// //           params: {
// //             amount: amountNum,
// //             studentType: form.studentType,
// //             subjectId: form.subject,
// //             difficulty: form.difficulty === 'any' ? '' : form.difficulty,
// //             questionType: form.questionType,
// //           },
// //         }
// //       );

// //       if (!Array.isArray(res.data) || res.data.length === 0) {
// //         alert('No questions generated. Try another configuration.');
// //         return;
// //       }

// //       const studentTypeInfo = studentTypes.find(
// //         (t) => t.id === form.studentType
// //       );
// //       const subjectInfo = subjectOptions.find(
// //         (s) => s.id === form.subject
// //       );

// //       dispatch({
// //         type: 'SET_DATA',
// //         payload: {
// //           questions: res.data,
// //           info: {
// //             test: form.test,
// //             amount: amountNum,
// //             studentType: form.studentType,
// //             studentTypeName: studentTypeInfo?.name || 'General',
// //             subjectId: form.subject,
// //             subjectName: subjectInfo?.name || 'Mixed',
// //             difficulty: form.difficulty,
// //             questionType: form.questionType,
// //           },
// //         },
// //       });

// //       navigate('/preview');
// //     } catch (err) {
// //       console.error(err);
// //       alert('Backend not reachable. Is server running?');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// // //   return (
// // //     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 flex justify-center items-center">
// // //       <div className="bg-slate-800/90 p-10 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-700">
// // //         <h2 className="text-white text-3xl font-bold mb-2 text-center">
// // //           Question Generator
// // //         </h2>

// // //         <form
// // //           onSubmit={fetchQuestions}
// // //           className="grid grid-cols-1 md:grid-cols-2 gap-6"
// // //         >
// // //           <input
// // //             required
// // //             placeholder="Test Name"
// // //             className="md:col-span-2 bg-slate-900 p-3 rounded-lg text-white"
// // //             value={form.test}
// // //             onChange={(e) =>
// // //               setForm({ ...form, test: e.target.value })
// // //             }
// // //           />

// // //           <select
// // //             value={form.studentType}
// // //             onChange={(e) =>
// // //               setForm({ ...form, studentType: e.target.value })
// // //             }
// // //           >
// // //             {studentTypes.map((t) => (
// // //               <option key={t.id} value={t.id}>
// // //                 {t.name}
// // //               </option>
// // //             ))}
// // //           </select>

// // //           <select
// // //             value={form.subject}
// // //             onChange={(e) =>
// // //               setForm({ ...form, subject: e.target.value })
// // //             }
// // //           >
// // //             {subjectOptions.map((s) => (
// // //               <option key={s.id} value={s.id}>
// // //                 {s.name}
// // //               </option>
// // //             ))}
// // //           </select>

// // //           <select
// // //             value={form.difficulty}
// // //             onChange={(e) =>
// // //               setForm({ ...form, difficulty: e.target.value })
// // //             }
// // //           >
// // //             {difficulties.map((d) => (
// // //               <option key={d.id} value={d.id}>
// // //                 {d.name}
// // //               </option>
// // //             ))}
// // //           </select>

// // //           <select
// // //             value={form.questionType}
// // //             onChange={(e) =>
// // //               setForm({ ...form, questionType: e.target.value })
// // //             }
// // //           >
// // //             {questionTypes.map((q) => (
// // //               <option key={q.id} value={q.id}>
// // //                 {q.name}
// // //               </option>
// // //             ))}
// // //           </select>

// // //           <input
// // //             type="number"
// // //             min={1}
// // //             max={50}
// // //             value={form.amount}
// // //             onChange={(e) =>
// // //               setForm({ ...form, amount: Number(e.target.value) })
// // //             }
// // //           />

// // //           <button
// // //             disabled={loading}
// // //             className="md:col-span-2 bg-indigo-600 py-3 rounded-lg text-white"
// // //           >
// // //             {loading ? 'Generating...' : 'Generate Questions'}
// // //           </button>
// // //         </form>
// // //       </div>
// // //     </div>
// // //   );
// // // };


// // // export default GeneratorPage;

// // return (
// //   <div
// //     className="min-h-screen flex items-center justify-center p-6
// //     bg-gray-50 dark:bg-gray-950
// //     text-gray-900 dark:text-gray-100
// //     animate-slide"
// //   >
// //     <div
// //       className="w-full max-w-2xl
// //       bg-white dark:bg-gray-900
// //       border dark:border-gray-800
// //       rounded-2xl shadow-2xl p-8"
// //     >
// //       {/* HEADER */}
// //       <h2 className="text-3xl font-bold mb-2 text-center">
// //         Question Generator
// //       </h2>
// //       <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
// //         Configure your exam and generate questions instantly
// //       </p>

// //       <form
// //         onSubmit={fetchQuestions}
// //         className="grid grid-cols-1 md:grid-cols-2 gap-6"
// //       >
// //         {/* TEST NAME */}
// //         <input
// //           required
// //           placeholder="Test Name"
// //           className="md:col-span-2 px-4 py-3 rounded-lg
// //             bg-transparent border dark:border-gray-700
// //             focus:ring-2 focus:ring-indigo-500 outline-none"
// //           value={form.test}
// //           onChange={(e) =>
// //             setForm({ ...form, test: e.target.value })
// //           }
// //         />

// //         {/* STUDENT TYPE */}
// //         <select
// //           value={form.studentType}
// //           onChange={(e) =>
// //             setForm({ ...form, studentType: e.target.value })
// //           }
// //           className="px-4 py-3 rounded-lg
// //             bg-transparent border dark:border-gray-700
// //             focus:ring-2 focus:ring-indigo-500 outline-none"
// //         >
// //           {studentTypes.map((t) => (
// //             <option key={t.id} value={t.id}>
// //               {t.name}
// //             </option>
// //           ))}
// //         </select>

// //         {/* SUBJECT */}
// //         <select
// //           value={form.subject}
// //           onChange={(e) =>
// //             setForm({ ...form, subject: e.target.value })
// //           }
// //           className="px-4 py-3 rounded-lg
// //             bg-transparent border dark:border-gray-700
// //             focus:ring-2 focus:ring-indigo-500 outline-none"
// //         >
// //           {subjectOptions.map((s) => (
// //             <option key={s.id} value={s.id}>
// //               {s.name}
// //             </option>
// //           ))}
// //         </select>

// //         {/* DIFFICULTY */}
// //         <select
// //           value={form.difficulty}
// //           onChange={(e) =>
// //             setForm({ ...form, difficulty: e.target.value })
// //           }
// //           className="px-4 py-3 rounded-lg
// //             bg-transparent border dark:border-gray-700
// //             focus:ring-2 focus:ring-indigo-500 outline-none"
// //         >
// //           {difficulties.map((d) => (
// //             <option key={d.id} value={d.id}>
// //               {d.name}
// //             </option>
// //           ))}
// //         </select>

// //         {/* QUESTION TYPE */}
// //         <select
// //           value={form.questionType}
// //           onChange={(e) =>
// //             setForm({ ...form, questionType: e.target.value })
// //           }
// //           className="px-4 py-3 rounded-lg
// //             bg-transparent border dark:border-gray-700
// //             focus:ring-2 focus:ring-indigo-500 outline-none"
// //         >
// //           {questionTypes.map((q) => (
// //             <option key={q.id} value={q.id}>
// //               {q.name}
// //             </option>
// //           ))}
// //         </select>

// //         {/* NUMBER OF QUESTIONS */}
// //         <input
// //           type="number"
// //           min={1}
// //           max={50}
// //           value={form.amount}
// //           onChange={(e) =>
// //             setForm({ ...form, amount: Number(e.target.value) })
// //           }
// //           className="px-4 py-3 rounded-lg
// //             bg-transparent border dark:border-gray-700
// //             focus:ring-2 focus:ring-indigo-500 outline-none"
// //         />

// //         {/* SUBMIT */}
// //         <button
// //           disabled={loading}
// //           className="md:col-span-2 px-6 py-3 rounded-xl
// //             bg-indigo-600 text-white font-semibold
// //             hover:bg-indigo-700 hover:scale-[1.02]
// //             disabled:opacity-60 disabled:cursor-not-allowed
// //             transition"
// //         >
// //           {loading ? 'Generating...' : 'Generate Questions'}
// //         </button>
// //       </form>
// //     </div>
// //   </div>
// // );
// // };

// // export default GeneratorPage;
// import React, { useState, useMemo, useEffect } from 'react';
// import axios from 'axios';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// const studentTypes = [
//   { id: 'class10', name: 'Class 10' },
//   { id: 'class12', name: 'Class 12' },
//   { id: 'engineering', name: 'Engineering' },
// ];

// const subjectsByType = {
//   class10: [
//     { id: 'maths', name: 'Mathematics' },
//     { id: 'science', name: 'Science' },
//     { id: 'sst', name: 'Social Science' },
//     { id: 'english', name: 'English' },
//     { id: 'hindi', name: 'Hindi' },
//   ],
//   class12: [
//     { id: 'pcm_maths', name: 'Mathematics' },
//     { id: 'pcm_physics', name: 'Physics' },
//     { id: 'pcm_chemistry', name: 'Chemistry' },
//     { id: 'commerce_accounts', name: 'Accountancy' },
//     { id: 'commerce_business', name: 'Business Studies' },
//     { id: 'english', name: 'English' },
//   ],
//   engineering: [
//     { id: 'eng_maths', name: 'Engineering Mathematics' },
//     { id: 'ds_algo', name: 'Data Structures & Algorithms' },
//     { id: 'os', name: 'Operating Systems' },
//     { id: 'dbms', name: 'DBMS' },
//     { id: 'cn', name: 'Computer Networks' },
//     { id: 'edc', name: 'Electronics / EDC' },
//     { id: 'signals', name: 'Signals & Systems' },
//   ],
// };

// const difficulties = [
//   { id: 'any', name: 'Any Difficulty' },
//   { id: 'easy', name: 'Easy' },
//   { id: 'medium', name: 'Medium' },
//   { id: 'hard', name: 'Hard' },
// ];

// const questionTypes = [
//   { id: 'mcq', name: 'Multiple Choice (MCQ)' },
//   { id: 'true_false', name: 'True / False' },
//   { id: 'fill_blank', name: 'Fill in the Blanks' },
// ];

// const GeneratorPage = () => {
//   const [form, setForm] = useState({
//     test: '',
//     amount: 10,
//     studentType: 'engineering',
//     subject: 'eng_maths',
//     difficulty: 'easy',
//     questionType: 'mcq',
//   });

//   const [loading, setLoading] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const subjectOptions = useMemo(
//     () => subjectsByType[form.studentType] || [],
//     [form.studentType]
//   );

//   useEffect(() => {
//     if (!subjectOptions.some(s => s.id === form.subject)) {
//       setForm(prev => ({
//         ...prev,
//         subject: subjectOptions[0]?.id || '',
//       }));
//     }
//   }, [subjectOptions, form.subject]);

//   const fetchQuestions = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await axios.get(`${API_BASE_URL}/api/exams/generate`, {
//         params: {
//           amount: form.amount,
//           studentType: form.studentType,
//           subjectId: form.subject,
//           difficulty: form.difficulty === 'any' ? '' : form.difficulty,
//           questionType: form.questionType,
//         },
//       });

//       dispatch({
//         type: 'SET_DATA',
//         payload: {
//           questions: res.data,
//           info: form,
//         },
//       });

//       navigate('/preview');
//     } catch {
//       alert('Backend not reachable');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen bg-[#050505] text-slate-100 p-6 md:p-10 font-sans overflow-hidden">

//       {/* ===== BACKGROUND BLOBS ===== */}
//       <div className="absolute inset-0 -z-10">
//         <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-indigo-600/30 rounded-full blur-[160px] animate-pulse" />
//         <div className="absolute top-1/3 -right-40 w-[420px] h-[420px] bg-purple-600/30 rounded-full blur-[150px] animate-pulse delay-1000" />
//       </div>

//       <div className="max-w-4xl mx-auto space-y-10">

//         {/* ===== HEADER ===== */}
//         <header className="animate-fade-up">
//           <h1 className="text-4xl font-black italic tracking-tight">
//             Generate <span className="text-indigo-500">Exam</span>
//           </h1>
//           <p className="text-slate-500 text-sm mt-1">
//             Configure your exam parameters and generate papers instantly
//           </p>
//         </header>

//         {/* ===== FORM CARD ===== */}
//         <section
//           className="bg-slate-900/50 border border-slate-800
//           rounded-3xl p-6 md:p-8 backdrop-blur-xl
//           shadow-2xl animate-fade-up"
//         >
//           <form
//             onSubmit={fetchQuestions}
//             className="grid grid-cols-1 md:grid-cols-2 gap-5"
//           >
//             <input
//               required
//               placeholder="Test Name"
//               className="md:col-span-2 bg-black/40 border border-slate-700
//               rounded-xl p-3 text-slate-100 placeholder-slate-500
//               focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition"
//               value={form.test}
//               onChange={(e) =>
//                 setForm({ ...form, test: e.target.value })
//               }
//             />

//             <Select
//               value={form.studentType}
//               onChange={(e) =>
//                 setForm({ ...form, studentType: e.target.value })
//               }
//               options={studentTypes}
//             />

//             <Select
//               value={form.subject}
//               onChange={(e) =>
//                 setForm({ ...form, subject: e.target.value })
//               }
//               options={subjectOptions}
//             />

//             <Select
//               value={form.difficulty}
//               onChange={(e) =>
//                 setForm({ ...form, difficulty: e.target.value })
//               }
//               options={difficulties}
//             />

//             <Select
//               value={form.questionType}
//               onChange={(e) =>
//                 setForm({ ...form, questionType: e.target.value })
//               }
//               options={questionTypes}
//             />

//             <input
//               type="number"
//               min={1}
//               max={50}
//               value={form.amount}
//               onChange={(e) =>
//                 setForm({ ...form, amount: Number(e.target.value) })
//               }
//               className="bg-black/40 border border-slate-700 rounded-xl p-3
//               focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition"
//             />

//             <button
//               disabled={loading}
//               className="md:col-span-2 bg-indigo-600 hover:bg-indigo-500
//               px-6 py-3 rounded-xl font-bold
//               shadow-xl shadow-indigo-600/30
//               hover:scale-[1.02] transition
//               disabled:opacity-60"
//             >
//               {loading ? 'Generating…' : 'Generate Questions →'}
//             </button>
//           </form>
//         </section>
//       </div>
//     </div>
//   );
// };

// /* ===== REUSABLE SELECT ===== */
// const Select = ({ value, onChange, options }) => (
//   <select
//     value={value}
//     onChange={onChange}
//     className="bg-black/40 border border-slate-700 rounded-xl p-3
//     text-slate-100
//     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition"
//   >
//     {options.map((o) => (
//       <option key={o.id} value={o.id} className="bg-slate-900">
//         {o.name}
//       </option>
//     ))}
//   </select>
// );

// export default GeneratorPage;
import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const studentTypes = [
  { id: 'class10', name: 'High School', sub: 'Class 10', icon: '📖' },
  { id: 'class12', name: 'Intermediate', sub: 'Class 12', icon: '🎓' },
  { id: 'engineering', name: 'Engineering', sub: 'University', icon: '⚙️' },
];

const subjectsByType = {
  class10: [
    { id: 'maths', name: 'Mathematics' }, { id: 'science', name: 'Science' },
    { id: 'sst', name: 'Social Science' }, { id: 'english', name: 'English' },
  ],
  class12: [
    { id: 'pcm_maths', name: 'Mathematics' }, { id: 'pcm_physics', name: 'Physics' },
    { id: 'pcm_chemistry', name: 'Chemistry' }, { id: 'english', name: 'English' },
  ],
  engineering: [
    { id: 'eng_maths', name: 'Engineering Mathematics' },
    { id: 'ds_algo', name: 'Data Structures' },
    { id: 'os', name: 'Operating Systems' },
    { id: 'dbms', name: 'DBMS' },
    { id: 'cn', name: 'Computer Networks' },
  ],
};

const GeneratorPage = () => {
  const [form, setForm] = useState({
    test: '',
    amount: 10,
    studentType: 'engineering',
    subject: 'eng_maths',
    difficulty: 'medium',
    questionType: 'mcq', // Options: mcq, true_false, fill_blank
  });

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subjectOptions = useMemo(
    () => subjectsByType[form.studentType] || [],
    [form.studentType]
  );

  useEffect(() => {
    if (!subjectOptions.some((s) => s.id === form.subject)) {
      setForm((prev) => ({ ...prev, subject: subjectOptions[0]?.id || '' }));
    }
  }, [subjectOptions, form.subject]);

  const fetchQuestions = async (e) => {
    e.preventDefault();
    
    // CO4: Form Validation
    if (!form.test.trim()) return alert('Please enter a test name.');

    setLoading(true);
    try {
      // CO5: HTTP GET Request via Axios
      const res = await axios.get(`${API_BASE_URL}/api/exams/generate`, {
        params: {
          amount: form.amount,
          studentType: form.studentType,
          subjectId: form.subject,
          difficulty: form.difficulty,
          questionType: form.questionType,
        },
      });

      // VI: Redux Dispatch
      dispatch({
        type: 'SET_DATA',
        payload: {
          questions: res.data,
          info: { 
            ...form, 
            subjectName: subjectOptions.find(s => s.id === form.subject)?.name 
          },
        },
      });
      navigate('/preview');
    } catch (err) {
      // CO4: Error Handling/Display
      if (err.response?.status === 429) {
        alert("⚠️ AI Quota Reached! Please try again in 1 minute or check your Gemini API billing.");
      } else {
        alert('Server Error: ' + (err.response?.data?.message || "Internal Server Error"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8 flex items-center justify-center font-sans overflow-hidden relative">
      
      {/* Visual Animations: Background Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

      <main className="relative z-10 w-full max-w-5xl bg-slate-900/40 border border-slate-800 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row transition-all duration-500 hover:border-slate-700">
        
        {/* Left Side: Dynamic Branding */}
        <div className="lg:w-1/3 bg-gradient-to-br from-indigo-600 to-blue-700 p-10 flex flex-col justify-between text-white relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent opacity-20" />
          </div>
          
          <div className="relative z-10">
            <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-xl border border-white/30">
              <span className="text-3xl font-black italic tracking-tighter">Q</span>
            </div>
            <h1 className="text-4xl font-black leading-tight uppercase tracking-tighter mb-4">
              Neural<br />Draft<span className="text-indigo-200">.</span>
            </h1>
            <p className="text-indigo-100 text-sm font-medium opacity-90 leading-relaxed">
              Generate structured academic assessments using Gemini 1.5 Flash.
            </p>
          </div>

          <div className="space-y-4 relative z-10">
             <div className="flex items-center gap-3 bg-black/20 p-3 rounded-2xl border border-white/10">
                <div className="h-2 w-2 bg-emerald-400 rounded-full animate-ping" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-50">API Status: Online</span>
             </div>
          </div>
        </div>

        {/* Right Side: Form Content */}
        <form onSubmit={fetchQuestions} className="flex-1 p-8 md:p-12 space-y-8 bg-black/20">
          
          {/* Test Identity */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Exam Title</label>
            <input
              required
              placeholder="e.g., Data Structures Mid-Term"
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white text-lg font-bold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              value={form.test}
              onChange={(e) => setForm({ ...form, test: e.target.value })}
            />
          </div>

          {/* Student Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {studentTypes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setForm({ ...form, studentType: t.id })}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 ${
                  form.studentType === t.id 
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10' 
                  : 'bg-slate-950/30 border-slate-800 text-slate-500 hover:border-slate-700'
                }`}
              >
                <div className="text-xl mb-1">{t.icon}</div>
                <div className="text-[10px] font-black uppercase tracking-tight">{t.name}</div>
              </button>
            ))}
          </div>

          {/* Question Type Selection (The Requested Dropdown Replacement) */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Question Format</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 'mcq', name: 'MCQ', icon: '🔘' },
                { id: 'true_false', name: 'True/False', icon: '⚖️' },
                { id: 'fill_blank', name: 'Fill Blanks', icon: '⌨️' }
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setForm({ ...form, questionType: type.id })}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
                    form.questionType === type.id 
                    ? 'bg-indigo-600 text-white border-indigo-500' 
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span>{type.icon}</span>
                  {type.name}
                </button>
              ))}
            </div>
          </div>

          {/* Subject & Difficulty Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Subject Area</label>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-200 outline-none focus:border-indigo-500 appearance-none transition-colors"
              >
                {subjectOptions.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Complexity</label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-200 outline-none focus:border-indigo-500 appearance-none transition-colors"
              >
                <option value="easy">Level: Easy</option>
                <option value="medium">Level: Medium</option>
                <option value="hard">Level: Hard</option>
              </select>
            </div>
          </div>

          {/* Quantity Slider */}
          <div className="pt-4 space-y-4">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Questions to Generate</label>
              <span className="text-xl font-black text-indigo-500">{form.amount}</span>
            </div>
            <input
              type="range" min="1" max="50"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            
            <button
              disabled={loading}
              className="group relative w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 py-5 rounded-2xl text-white font-black uppercase tracking-[0.2em] text-xs transition-all transform active:scale-[0.98] overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Connecting to AI...
                  </>
                ) : (
                  'Build My Exam Paper'
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default GeneratorPage;