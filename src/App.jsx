import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

import LandingPage from '@/pages/LandingPage';
import MeditationPage from '@/pages/MeditationPage';
import DashboardPage from '@/pages/DashboardPage';
import MoodTrackerPage from '@/pages/MoodTrackerPage';
import InnerDialoguesLibraryPage from '@/pages/SelfTalkPage';
import AdminPage from '@/pages/AdminPage';
import AuthPage from '@/pages/AuthPage';
import NotFoundPage from '@/pages/NotFoundPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import ContactPage from '@/pages/ContactPage';
import OnboardingPage from '@/pages/OnboardingPage'; // Import the new OnboardingPage

import { useAuth } from '@/hooks/useAuth';

function App() {
  const { isAuthenticated, loading, user } = useAuth();

  // A simple check for onboarding completion. In a real app, this would be more robust.
  // For example, check a flag in user_metadata from Supabase or localStorage.
  // const isOnboardingComplete = () => localStorage.getItem(`onboardingComplete_${user?.id}`) === 'true';
  // For now, we'll assume if user is authenticated and tries to go to /auth, they should be onboarded if not already.
  // The AuthPage will handle the redirect to /start if needed.

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-background to-secondary">
        <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Routes that don't use MainLayout (like OnboardingPage if it's full screen) */}
        <Route path="/start" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />

        {/* Routes that use MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          {/* AuthPage will now decide to redirect to /start or /dashboard */}
          <Route path="/auth" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />} /> 
          
          <Route path="/meditation" element={<ProtectedRoute><MeditationPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/mood-tracker" element={<ProtectedRoute><MoodTrackerPage /></ProtectedRoute>} />
          <Route path="/self-talk" element={<ProtectedRoute><InnerDialoguesLibraryPage /></ProtectedRoute>} /> 
          <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminPage /></ProtectedRoute>} />
          
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;