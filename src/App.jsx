import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import OpportunitiesList from './pages/opportunities/OpportunitiesList';
import OpportunityDetail from './pages/opportunities/OpportunityDetail';
import IndustryDemand from './pages/analytics/IndustryDemand';
import NotFound from './pages/NotFound';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import SkillGapAnalysis from './pages/student/SkillGapAnalysis';
import MyApplications from './pages/student/MyApplications';

// College Pages
import CollegeDashboard from './pages/college/CollegeDashboard';
import StudentDirectory from './pages/college/StudentDirectory';
import CurriculumGapAnalysis from './pages/college/CurriculumGapAnalysis';
import Collaborations from './pages/college/Collaborations';

// Industry Pages
import CompanyDashboard from './pages/industry/CompanyDashboard';
import PostOpportunity from './pages/industry/PostOpportunity';
import ManageOpportunities from './pages/industry/ManageOpportunities';
import CandidateFinder from './pages/industry/CandidateFinder';
import ApplicantReview from './pages/industry/ApplicantReview';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-xs text-slate-500">
        Authenticating session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    if (user?.role === 'student') return <Navigate to="/student/dashboard" replace />;
    if (user?.role === 'college') return <Navigate to="/college/dashboard" replace />;
    if (user?.role === 'company') return <Navigate to="/industry/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Shared Pages wrapped in Dashboard Layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/opportunities" element={<OpportunitiesList />} />
        <Route path="/opportunities/:id" element={<OpportunityDetail />} />
        <Route path="/analytics/industry-demand" element={<IndustryDemand />} />
        <Route path="/college/collaborations" element={<Collaborations />} />

        {/* Student Protected Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={['student', 'admin']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRoles={['student', 'admin']}>
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/skill-gap"
          element={
            <ProtectedRoute allowedRoles={['student', 'admin']}>
              <SkillGapAnalysis />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/applications"
          element={
            <ProtectedRoute allowedRoles={['student', 'admin']}>
              <MyApplications />
            </ProtectedRoute>
          }
        />

        {/* College Protected Routes */}
        <Route
          path="/college/dashboard"
          element={
            <ProtectedRoute allowedRoles={['college', 'admin']}>
              <CollegeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/college/students"
          element={
            <ProtectedRoute allowedRoles={['college', 'admin']}>
              <StudentDirectory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/college/curriculum-gap"
          element={
            <ProtectedRoute allowedRoles={['college', 'admin']}>
              <CurriculumGapAnalysis />
            </ProtectedRoute>
          }
        />

        {/* Industry / Company Protected Routes */}
        <Route
          path="/industry/dashboard"
          element={
            <ProtectedRoute allowedRoles={['company', 'admin']}>
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/industry/post-opportunity"
          element={
            <ProtectedRoute allowedRoles={['company', 'admin']}>
              <PostOpportunity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/industry/manage-opportunities"
          element={
            <ProtectedRoute allowedRoles={['company', 'admin']}>
              <ManageOpportunities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/industry/candidates"
          element={
            <ProtectedRoute allowedRoles={['company', 'admin']}>
              <CandidateFinder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/industry/opportunities/:opportunityId/applicants"
          element={
            <ProtectedRoute allowedRoles={['company', 'admin']}>
              <ApplicantReview />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
