import React, { useState, useEffect } from 'react';
import API from '../api/api';

const QuestionBank = () => {
  const [bank, setBank] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===== ADD QUESTION STATE ===== */
  const [questionText, setQuestionText] = useState('');
  const [subject, setSubject] = useState('');
  const [difficulty] = useState('Medium');   // ✅ FIXED
  const [marks] = useState(2);               // ✅ FIXED
  const [questionType, setQuestionType] = useState('MCQ');
  const [options, setOptions] = useState(['', '', '', '']);
  const [saving, setSaving] = useState(false);

  /* ===== EDIT STATE ===== */
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  /* ===== FETCH BANK ===== */
  useEffect(() => {
    fetchBank();
  }, []);

  const fetchBank = async () => {
    try {
      setLoading(true);
      const res = await API.get('/questions/bank');
      setBank(res.data);
    } catch {
      console.error('Failed to fetch bank');
    } finally {
      setLoading(false);
    }
  };

  /* ===== RESET OPTIONS BASED ON TYPE ===== */
  useEffect(() => {
    if (questionType === 'MCQ') setOptions(['', '', '', '']);
    if (questionType === 'TRUE_FALSE') setOptions(['True', 'False']);
    if (questionType === 'SHORT') setOptions([]);
  }, [questionType]);

  /* ===== SAVE QUESTION ===== */
  const handleSaveQuestion = async () => {
    if (!questionText.trim() || !subject.trim()) {
      alert('Missing fields');
      return;
    }

    try {
      setSaving(true);
      const teacher = JSON.parse(localStorage.getItem('teacher'));

      await API.post('/questions/bank', {
        questionText,
        questionType,
        options,
        difficulty,
        marks,
        subject,
        source: 'Manual',
        teacherId: teacher?._id,
      });

      setQuestionText('');
      setSubject('');
      fetchBank();
    } catch {
      alert('Save failed');
    } finally {
      setSaving(false);
    }
  };

  /* ===== DELETE QUESTION ===== */
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question?')) return;

    try {
      await API.delete(`/questions/bank/${id}`);
      setBank(prev => prev.filter(q => q._id !== id));
    } catch {
      alert('Delete failed');
    }
  };

  /* ===== SAVE EDIT ===== */
  const saveEdit = async (id) => {
    try {
      await API.put(`/questions/bank/${id}`, { questionText: editText });

      setBank(prev =>
        prev.map(q =>
          q._id === id ? { ...q, questionText: editText } : q
        )
      );

      setEditingId(null);
      setEditText('');
    } catch {
      alert('Update failed');
    }
  };

  /* ===== LOADING ===== */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col lg:flex-row font-sans">

      {/* LEFT SIDEBAR */}
      <aside className="w-full lg:w-96 lg:h-screen lg:sticky lg:top-0 bg-slate-900/30 border-r border-slate-800/50 p-6 overflow-y-auto backdrop-blur-xl">
        <h1 className="text-3xl font-black italic text-white mb-6">
          Quest<span className="text-indigo-600">.Bank</span>
        </h1>

        <textarea
          value={questionText}
          onChange={e => setQuestionText(e.target.value)}
          placeholder="Enter question text..."
          className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 mb-4"
        />

        <select
          value={questionType}
          onChange={e => setQuestionType(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 mb-4"
        >
          <option value="MCQ">MCQ</option>
          <option value="TRUE_FALSE">True / False</option>
          <option value="SHORT">Short</option>
        </select>

        <input
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder="Subject"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 mb-4"
        />

        {questionType !== 'SHORT' && options.map((opt, i) => (
          <input
            key={i}
            value={opt}
            disabled={questionType === 'TRUE_FALSE'}
            onChange={e => {
              const copy = [...options];
              copy[i] = e.target.value;
              setOptions(copy);
            }}
            placeholder={`Option ${i + 1}`}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 mb-2"
          />
        ))}

        <button
          onClick={handleSaveQuestion}
          disabled={saving}
          className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-bold"
        >
          {saving ? 'Saving...' : 'Add Question'}
        </button>
      </aside>

      {/* RIGHT CONTENT */}
      <main className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bank.map(q => (
          <div key={q._id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            {editingId === q._id ? (
              <textarea
                value={editText}
                onChange={e => setEditText(e.target.value)}
                className="w-full bg-black border border-indigo-500 rounded-lg p-3"
              />
            ) : (
              <p className="font-semibold">{q.questionText}</p>
            )}

            <p className="text-xs text-slate-500 mt-2">
              {q.subject} • {q.difficulty}
            </p>

            <div className="mt-4 flex gap-4 text-sm">
              {editingId === q._id ? (
                <button onClick={() => saveEdit(q._id)} className="text-green-400">
                  Save
                </button>
              ) : (
                <button onClick={() => {
                  setEditingId(q._id);
                  setEditText(q.questionText);
                }} className="text-indigo-400">
                  Edit
                </button>
              )}

              <button onClick={() => handleDelete(q._id)} className="text-red-400">
                Delete
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default QuestionBank;
