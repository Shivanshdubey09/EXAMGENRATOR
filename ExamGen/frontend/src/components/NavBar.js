// import React, { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   // 🔐 AUTH CHECK
//   const teacher = localStorage.getItem('teacher');

//   // ❌ Hide navbar on login & register pages
//   if (
//   location.pathname === '/' ||
//   location.pathname === '/login' ||
//   location.pathname === '/register'
// ) {
//   return null;
// }

//   const toggleMenu = () => setIsOpen(!isOpen);

//   const handleLogout = () => {
//     localStorage.removeItem('teacher');
//     setIsOpen(false);
//     navigate('/login', { replace: true });
//   };

//   return (
//     <>
//       {/* ================= TOP NAVBAR ================= */}
//       <nav className="sticky top-0 z-50 flex justify-between items-center px-6 py-4
//         bg-white/80 dark:bg-gray-900/80 backdrop-blur
//         border-b border-indigo-500/40 shadow-sm transition-colors">

//         {/* LOGO */}
//         <h1
//           onClick={() => navigate('/')}
//           className="cursor-pointer text-indigo-500 font-black text-xl tracking-tight"
//         >
//           EXAM<span className="text-indigo-400">.GEN</span>
//         </h1>

//         {/* RIGHT SIDE */}
//         <div className="flex items-center gap-4">

//           {/* 🌗 DARK MODE */}
//           <button
//             onClick={() => document.documentElement.classList.toggle('dark')}
//             className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:scale-105 transition"
//             title="Toggle Theme"
//           >
//             🌗
//           </button>

//           {/* 🔓 NOT LOGGED IN */}
//           {!teacher && (
//             <>
//               <button
//                 onClick={() => navigate('/login')}
//                 className="text-indigo-600 font-medium"
//               >
//                 Login
//               </button>

//               <button
//                 onClick={() => navigate('/register')}
//                 className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
//               >
//                 Get Started Free
//               </button>
//             </>
//           )}

//           {/* 🔐 LOGGED IN */}
//           {teacher && (
//             <>
//               <button
//                 onClick={() => navigate('/dashboard')}
//                 className="text-indigo-600 font-semibold"
//               >
//                 Dashboard
//               </button>

//               {/* HAMBURGER */}
//               <button
//                 onClick={toggleMenu}
//                 className="z-50 flex flex-col justify-between h-6 w-8 bg-transparent border-none cursor-pointer"
//                 aria-label="Toggle Menu"
//               >
//                 <span
//                   className={`h-0.5 w-full bg-gray-900 dark:bg-white rounded transition-all duration-300 ${
//                     isOpen ? 'rotate-45 translate-y-2' : ''
//                   }`}
//                 />
//                 <span
//                   className={`h-0.5 w-full bg-gray-900 dark:bg-white rounded transition-all duration-300 ${
//                     isOpen ? 'opacity-0' : ''
//                   }`}
//                 />
//                 <span
//                   className={`h-0.5 w-full bg-gray-900 dark:bg-white rounded transition-all duration-300 ${
//                     isOpen ? '-rotate-45 -translate-y-2' : ''
//                   }`}
//                 />
//               </button>
//             </>
//           )}
//         </div>
//       </nav>

//       {/* ================= SIDEBAR (ONLY WHEN LOGGED IN) ================= */}
//       {teacher && (
//         <>
//           <div
//             className={`fixed top-0 left-0 h-full w-72
//             bg-white dark:bg-gray-900
//             border-r border-indigo-500/40
//             transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}
//             transition-transform duration-300 ease-in-out
//             z-[60] p-8 shadow-2xl`}
//           >
//             {/* Sidebar Header */}
//             <div className="flex justify-between items-center mb-10">
//               <span className="text-indigo-500 font-black text-lg">MENU</span>
//               <button
//                 onClick={toggleMenu}
//                 className="text-gray-700 dark:text-white text-2xl hover:text-red-500 transition"
//               >
//                 ✕
//               </button>
//             </div>

//             {/* Links */}
//             <div className="flex flex-col space-y-5">
//               {[
//                 { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
//                 { to: '/generator', label: 'Generate Paper', icon: '⚙️' },
//                 { to: '/question-bank', label: 'Question Bank', icon: '📚' },
//                 { to: '/preview', label: 'Preview', icon: '📄' },
//               ].map((item) => (
//                 <Link
//                   key={item.to}
//                   to={item.to}
//                   onClick={toggleMenu}
//                   className="flex items-center gap-3 text-lg font-semibold
//                     text-gray-700 dark:text-gray-200
//                     hover:text-indigo-500 transition"
//                 >
//                   <span className="text-xl">{item.icon}</span>
//                   {item.label}
//                 </Link>
//               ))}
//             </div>

//             {/* Logout */}
//             <div className="absolute bottom-16 left-8 right-8">
//               <button
//                 onClick={handleLogout}
//                 className="w-full px-4 py-3 text-left rounded-lg
//                   border border-red-500 text-red-500
//                   hover:bg-red-500 hover:text-white transition"
//               >
//                 🚪 Logout
//               </button>
//             </div>

//             <div className="absolute bottom-6 left-8 text-gray-400 text-xs font-mono uppercase tracking-widest">
//               Syllabus Project v1.0
//             </div>
//           </div>

//           {/* OVERLAY */}
//           {isOpen && (
//             <div
//               onClick={toggleMenu}
//               className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[55]"
//             />
//           )}
//         </>
//       )}
//     </>
//   );
// };

// export default Navbar;
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const teacher = localStorage.getItem('teacher');

  if (['/', '/login', '/register'].includes(location.pathname)) {
    return null;
  }

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem('teacher');
    setIsOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <>
      {/* ================= TOP NAVBAR ================= */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-8 py-4
        bg-white/90 backdrop-blur-md border-b border-indigo-100 shadow-sm">

        {/* LOGO SECTION */}
        <div 
          onClick={() => navigate('/dashboard')}
          className="group cursor-pointer flex items-center gap-2"
        >
          <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
            <span className="text-white font-black text-lg">Q</span>
          </div>
          <h1 className="text-slate-800 font-black text-xl tracking-tighter">
            EXAM<span className="text-indigo-600 font-extrabold">.AI</span>
          </h1>
        </div>

        {/* NAVIGATION LINKS (DESKTOP) */}
        <div className="hidden md:flex items-center gap-8">
          {teacher && (
            <>
              <Link to="/dashboard" className="text-slate-500 hover:text-indigo-600 font-bold text-sm uppercase tracking-wider transition">Home</Link>
              <Link to="/generator" className="text-slate-500 hover:text-indigo-600 font-bold text-sm uppercase tracking-wider transition">Generator</Link>
              <Link to="/question-bank" className="text-slate-500 hover:text-indigo-600 font-bold text-sm uppercase tracking-wider transition">Question Bank</Link>
            </>
          )}
        </div>

        {/* RIGHT SIDE ACTIONS */}
        <div className="flex items-center gap-6">
          {!teacher ? (
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/login')} className="text-slate-600 font-bold text-sm">Sign In</button>
              <button onClick={() => navigate('/register')} className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-indigo-200 transition">Get Started</button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* Profile Circle */}
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">Status</span>
                <span className="text-xs font-bold text-emerald-500">Teacher Online</span>
              </div>
              
              {/* HAMBURGER / MENU BUTTON */}
              <button
                onClick={toggleMenu}
                className="p-2.5 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
                aria-label="Toggle Menu"
              >
                <div className="space-y-1.5">
                  <span className={`block h-0.5 bg-indigo-600 rounded transition-all duration-300 ${isOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`} />
                  <span className={`block h-0.5 bg-indigo-600 rounded transition-all duration-300 ${isOpen ? 'opacity-0' : 'w-4'}`} />
                  <span className={`block h-0.5 bg-indigo-600 rounded transition-all duration-300 ${isOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-6'}`} />
                </div>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ================= SLIDE-OUT MENU ================= */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-white border-l border-slate-100 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-500 ease-in-out z-[100] p-10 shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.1)]`}
      >
        <div className="flex justify-between items-center mb-12">
          <span className="text-slate-400 font-black text-xs tracking-[0.3em] uppercase">Navigation</span>
          <button onClick={toggleMenu} className="text-slate-400 hover:text-red-500 text-2xl transition">✕</button>
        </div>

        <nav className="flex flex-col space-y-2">
          {[
            { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
            { to: '/generator', label: 'AI Generator', icon: '✨' },
            { to: '/question-bank', label: 'Question Bank', icon: '📁' },
            { to: '/preview', label: 'Paper Preview', icon: '📄' },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={toggleMenu}
              className="group flex items-center justify-between p-4 rounded-2xl hover:bg-indigo-50 transition-all"
            >
              <div className="flex items-center gap-4">
                <span className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-110 transition">{item.icon}</span>
                <span className="font-bold text-slate-700 group-hover:text-indigo-600">{item.label}</span>
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition text-indigo-400">→</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-10 left-10 right-10 space-y-6">
          <button
            onClick={handleLogout}
            className="w-full py-4 rounded-2xl border-2 border-slate-100 text-slate-400 font-bold hover:border-red-100 hover:text-red-500 transition-all flex items-center justify-center gap-2"
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
          className="fixed inset-0 bg-indigo-900/10 backdrop-blur-[2px] z-[90] transition-opacity animate-in fade-in"
        />
      )}
    </>
  );
};

export default Navbar;
