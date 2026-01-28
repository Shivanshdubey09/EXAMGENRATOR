import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import API from '../api/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const QUESTIONS_PER_PAGE = 10;

const PreviewPage = () => {
  const dispatch = useDispatch();

  const { questions = [], examInfo = {} } = useSelector((state) => state || {});

  const [localQuestions, setLocalQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [marksPerQuestion, setMarksPerQuestion] = useState(1);
  const [notes, setNotes] = useState({});
  const [loadingRegen, setLoadingRegen] = useState(false);
  const [savedToBank, setSavedToBank] = useState({}); // Tracking which questions are saved

  useEffect(() => {
    setLocalQuestions(questions || []);
    setCurrentPage(1);
  }, [questions]);

  const totalPages = Math.max(1, Math.ceil(localQuestions.length / QUESTIONS_PER_PAGE));

  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * QUESTIONS_PER_PAGE;
    return localQuestions.slice(start, start + QUESTIONS_PER_PAGE);
  }, [localQuestions, currentPage]);

  const totalMarks = useMemo(() => {
    return localQuestions.length * (Number(marksPerQuestion) || 0);
  }, [localQuestions.length, marksPerQuestion]);

  // ================= HANDLERS =================

  const handleShuffle = () => {
    const shuffled = [...localQuestions]
      .map((q) => ({ q, r: Math.random() }))
      .sort((a, b) => a.r - b.r)
      .map((x) => x.q);
    setLocalQuestions(shuffled);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleNoteChange = (index, value) => {
    setNotes((prev) => ({ ...prev, [index]: value }));
  };

  // UPDATED: Save specific AI question to the permanent Bank with Debugging
  const handleSaveToBank = async (question, index) => {
    try {
      // 1. Robust check for teacher session
      const rawData = localStorage.getItem('teacher') || localStorage.getItem('user') || localStorage.getItem('auth');
      const teacher = rawData ? JSON.parse(rawData) : null;
      
      // 2. Extract ID (handling multiple possible object structures)
      const teacherId = teacher?._id || teacher?.id || teacher?.user?._id || teacher?.user?.id;

      if (!teacherId) {
        alert("Session expired. Please log in again to save questions.");
        return;
      }

      // 3. Construct payload - Ensure fields match your Mongoose Schema exactly
      const payload = {
        questionText: question.question || question.questionText, 
        options: question.options || [],
        correctAnswer: question.answer || "",
        subject: examInfo.subject || "General",
        difficulty: examInfo.difficulty !== 'any' ? examInfo.difficulty : 'Medium',
        marks: marksPerQuestion,
        teacherId: teacherId, 
        source: 'AI-Generated'
      };

      console.log("Attempting Save to Bank with Payload:", payload);

      const response = await API.post('/questions/bank', payload);
      
      if (response.status === 201 || response.status === 200) {
        setSavedToBank(prev => ({ ...prev, [index]: true }));
      }
    } catch (err) {
      console.error("Bank Save Error Detail:", err.response?.data);
      const serverMsg = err.response?.data?.message || "Check server console for validation errors.";
      alert(`Failed to save to bank: ${serverMsg}`);
    }
  };

  const handleRegenerate = async () => {
    if (!examInfo?.subjectId) return;
    setLoadingRegen(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/exams/generate`, {
        params: {
          amount: examInfo.amount,
          studentType: examInfo.studentType,
          subjectId: examInfo.subjectId,
          difficulty: examInfo.difficulty === 'any' ? '' : examInfo.difficulty,
          questionType: examInfo.questionType,
        },
      });

      if (!Array.isArray(res.data) || res.data.length === 0) {
        alert('No questions returned from server.');
        return;
      }

      dispatch({
        type: 'SET_EXAM_DATA',
        payload: { questions: res.data, examInfo },
      });
      setLocalQuestions(res.data);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      alert('Failed to regenerate questions.');
    } finally {
      setLoadingRegen(false);
    }
  };

  const handleSavePaper = async () => {
    try {
      const savedUserData = localStorage.getItem('teacher') || localStorage.getItem('user') || localStorage.getItem('auth');
      
      if (!savedUserData) {
        alert('Error: No login session found. Please log in again.');
        return;
      }

      const teacher = JSON.parse(savedUserData);
      const teacherId = teacher.id || teacher._id || (teacher.user && (teacher.user.id || teacher.user._id));

      if (!teacherId) {
        alert('Teacher ID not found in session.');
        return;
      }

      await API.post('/papers', {
        teacherId: teacherId,
        title: examInfo.test || 'Question Paper',
        subject: examInfo.subject || '',
        totalMarks,
        questions: localQuestions,
      });

      alert('Paper saved successfully!');
    } catch (err) {
      console.error("Save Paper Error:", err);
      alert(err.response?.data?.message || 'Failed to save paper');
    }
  };

  // ================= RENDER =================

  if (!localQuestions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200">
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 text-center">
          <h2 className="text-xl font-semibold mb-2">No paper generated</h2>
          <p className="text-slate-400 text-sm">Please generate a question paper first.</p>
        </div>
      </div>
    );
  }

//   return (
//     <div className="min-h-screen bg-slate-900 p-6 flex justify-center">
//       <div className="w-full max-w-5xl bg-slate-800 rounded-2xl border border-slate-700 text-slate-100">
        
//         {/* HEADER */}
//         <header className="p-6 border-b border-slate-700 flex flex-col md:flex-row justify-between gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-indigo-400">{examInfo.test || 'Question Paper'}</h1>
//             <p className="text-slate-400 text-sm mt-1">
//               Questions: {localQuestions.length} • Total Marks:{' '}
//               <span className="text-emerald-400 font-semibold">{totalMarks}</span>
//             </p>
//           </div>
//           <div className="flex gap-2 items-center">
//             <div className="flex flex-col">
//                 <span className="text-[10px] text-slate-500 uppercase ml-1">Marks per Q</span>
//                 <input
//                 type="number"
//                 min="0"
//                 className="w-20 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm outline-none focus:border-indigo-500"
//                 value={marksPerQuestion}
//                 onChange={(e) => setMarksPerQuestion(e.target.value)}
//                 />
//             </div>
//             <button onClick={handleShuffle} className="bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded text-xs font-semibold self-end transition">
//               Shuffle
//             </button>
//             <button
//               onClick={handleRegenerate}
//               disabled={loadingRegen}
//               className="bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded text-xs font-semibold self-end disabled:opacity-50 transition"
//             >
//               {loadingRegen ? 'Loading...' : 'Regenerate'}
//             </button>
//             <button onClick={handleSavePaper} className="bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded text-xs font-semibold self-end transition">
//               Save Full Paper
//             </button>
//           </div>
//         </header>

//         {/* QUESTIONS AREA */}
//         <div className="p-6 space-y-6">
//           {paginatedQuestions.map((q, i) => {
//             const index = (currentPage - 1) * QUESTIONS_PER_PAGE + i;
//             const isSaved = savedToBank[index];

//             return (
//               <div key={index} className="bg-slate-900 border border-slate-700 rounded-xl p-5 group transition-all hover:border-slate-500">
//                 <div className="flex justify-between items-start mb-3">
//                     <p className="font-medium flex-1">
//                         <span className="text-indigo-500 mr-2">{index + 1}.</span> 
//                         {q.question || q.questionText || 'Untitled question'}
//                     </p>
                    
//                     {/* SAVE TO BANK BUTTON */}
//                     <button 
//                         onClick={() => handleSaveToBank(q, index)}
//                         disabled={isSaved}
//                         className={`ml-4 text-[10px] uppercase font-bold px-3 py-1 rounded border transition-all ${
//                             isSaved 
//                             ? 'bg-emerald-900/20 text-emerald-400 border-emerald-400 cursor-default' 
//                             : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:border-indigo-400 active:scale-95'
//                         }`}
//                     >
//                         {isSaved ? '✓ In Bank' : '⭐ Add to Bank'}
//                     </button>
//                 </div>

//                 {Array.isArray(q.options) && (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm ml-6">
//                     {q.options.map((opt, idx) => (
//                       <div key={idx} className="text-slate-400 bg-slate-800/50 p-2 rounded border border-slate-800">
//                         <span className="text-indigo-400 font-bold mr-2">{String.fromCharCode(65 + idx)}.</span> {opt}
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 <textarea
//                   className="mt-4 w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm focus:border-indigo-500 outline-none transition"
//                   placeholder="Teacher notes or instructions for this question..."
//                   value={notes[index] || ''}
//                   onChange={(e) => handleNoteChange(index, e.target.value)}
//                 />
//               </div>
//             );
//           })}
//         </div>

//         {/* PAGINATION */}
//         <footer className="p-4 border-t border-slate-700 flex justify-between items-center text-xs">
//           <span className="text-slate-500">Showing {paginatedQuestions.length} of {localQuestions.length} questions</span>
//           <div className="flex gap-4 items-center">
//             <span className="text-slate-400 font-medium">Page {currentPage} of {totalPages}</span>
//             <div className="flex gap-1">
//                 <button 
//                     onClick={() => goToPage(currentPage - 1)} 
//                     disabled={currentPage === 1}
//                     className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded disabled:opacity-30 transition"
//                 >
//                     Prev
//                 </button>
//                 <button 
//                     onClick={() => goToPage(currentPage + 1)} 
//                     disabled={currentPage === totalPages}
//                     className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded disabled:opacity-30 transition"
//                 >
//                     Next
//                 </button>
//             </div>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default PreviewPage;

return (
  <div className="min-h-screen flex justify-center p-6
    bg-gray-50 dark:bg-gray-950
    text-gray-900 dark:text-gray-100
    animate-fade"
  >
    <div className="w-full max-w-5xl
      bg-white dark:bg-gray-900
      border dark:border-gray-800
      rounded-2xl shadow-xl overflow-hidden">

      {/* ================= HEADER ================= */}
      <header className="p-6 border-b dark:border-gray-800
        flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-indigo-500">
            {examInfo.test || 'Question Paper'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Questions: {localQuestions.length} • Total Marks:{' '}
            <span className="text-emerald-500 font-semibold">{totalMarks}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase ml-1">
              Marks / Q
            </span>
            <input
              type="number"
              min="0"
              className="w-20 px-2 py-1 rounded-md
                bg-transparent border dark:border-gray-700
                focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              value={marksPerQuestion}
              onChange={(e) => setMarksPerQuestion(e.target.value)}
            />
          </div>

          <button
            onClick={handleShuffle}
            className="px-3 py-2 rounded-md text-xs font-semibold
              bg-gray-100 dark:bg-gray-800
              hover:bg-indigo-50 dark:hover:bg-gray-700 transition"
          >
            Shuffle
          </button>

          <button
            onClick={handleRegenerate}
            disabled={loadingRegen}
            className="px-3 py-2 rounded-md text-xs font-semibold
              bg-indigo-600 text-white
              hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {loadingRegen ? 'Loading…' : 'Regenerate'}
          </button>

          <button
            onClick={handleSavePaper}
            className="px-3 py-2 rounded-md text-xs font-semibold
              bg-emerald-600 text-white
              hover:bg-emerald-700 transition"
          >
            Save Full Paper
          </button>
        </div>
      </header>

      {/* ================= QUESTIONS ================= */}
      <div className="p-6 space-y-6">
        {paginatedQuestions.map((q, i) => {
          const index = (currentPage - 1) * QUESTIONS_PER_PAGE + i;
          const isSaved = savedToBank[index];

          return (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-950
                border dark:border-gray-800
                rounded-xl p-5
                hover:shadow-md transition animate-pop"
            >
              <div className="flex justify-between items-start gap-4 mb-3">
                <p className="font-medium flex-1 leading-relaxed">
                  <span className="text-indigo-500 mr-2">
                    {index + 1}.
                  </span>
                  {q.question || q.questionText || 'Untitled question'}
                </p>

                <button
                  onClick={() => handleSaveToBank(q, index)}
                  disabled={isSaved}
                  className={`text-[10px] uppercase font-bold px-3 py-1 rounded border transition
                    ${
                      isSaved
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 border-emerald-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-300 dark:border-gray-700 hover:text-indigo-500 hover:border-indigo-500'
                    }`}
                >
                  {isSaved ? '✓ In Bank' : '⭐ Add to Bank'}
                </button>
              </div>

              {Array.isArray(q.options) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm ml-6">
                  {q.options.map((opt, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-gray-900
                        border dark:border-gray-800
                        rounded p-2 text-gray-600 dark:text-gray-400"
                    >
                      <span className="text-indigo-500 font-bold mr-2">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      {opt}
                    </div>
                  ))}
                </div>
              )}

              <textarea
                className="mt-4 w-full rounded-lg p-2 text-sm
                  bg-transparent border dark:border-gray-700
                  focus:ring-2 focus:ring-indigo-500 outline-none transition"
                placeholder="Teacher notes or instructions for this question..."
                value={notes[index] || ''}
                onChange={(e) =>
                  handleNoteChange(index, e.target.value)
                }
              />
            </div>
          );
        })}
      </div>

      {/* ================= PAGINATION ================= */}
      <footer className="p-4 border-t dark:border-gray-800
        flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
        <span className="text-gray-500">
          Showing {paginatedQuestions.length} of {localQuestions.length} questions
        </span>

        <div className="flex gap-4 items-center">
          <span className="text-gray-400 font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <div className="flex gap-1">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded
                bg-gray-100 dark:bg-gray-800
                hover:bg-indigo-50 dark:hover:bg-gray-700
                disabled:opacity-30 transition"
            >
              Prev
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded
                bg-gray-100 dark:bg-gray-800
                hover:bg-indigo-50 dark:hover:bg-gray-700
                disabled:opacity-30 transition"
            >
              Next
            </button>
          </div>
        </div>
      </footer>
    </div>
  </div>
);
};export default PreviewPage;