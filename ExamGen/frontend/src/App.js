import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

import Navbar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';

/* PAGES */
import LandingPage from './pages/LandingPage';
import TeacherRegister from './pages/TeacherRegister';
import TeacherLogin from './pages/TeacherLogin';
import TeacherDashboard from './pages/TeacherDashboard';
import GeneratorPage from './pages/SetupPage';
import PreviewPage from './pages/PreviewPage';
import QuestionBank from './pages/QuestionBank';
import QuestionPapers from './pages/QuestionPapers';
import PaperPreview from './pages/PaperPreview'; // ✅ NEW IMPORT

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">

          <Navbar />

          <div className="animate-fade">
            <Routes>

              {/* PUBLIC */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<TeacherLogin />} />
              <Route path="/register" element={<TeacherRegister />} />

              {/* PROTECTED */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <TeacherDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/generator"
                element={
                  <ProtectedRoute>
                    <GeneratorPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/preview"
                element={
                  <ProtectedRoute>
                    <PreviewPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/question-bank"
                element={
                  <ProtectedRoute>
                    <QuestionBank />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/question-papers"
                element={
                  <ProtectedRoute>
                    <QuestionPapers />
                  </ProtectedRoute>
                }
              />

              {/* ✅ CRITICAL FIX */}
              <Route
                path="/paper/:id"
                element={
                  <ProtectedRoute>
                    <PaperPreview />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<LandingPage />} />

            </Routes>
          </div>
        </div>
      </Router>
    </Provider>
  );
}

export default App;