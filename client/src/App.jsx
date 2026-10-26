import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CostCalculator from './components/CostCalculator';
import LuxuryBackground from './components/LuxuryBackground';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import ListingsPage from './pages/ListingsPage';
import ListingDetailPage from './pages/ListingDetailPage';
import CreateListingPage from './pages/CreateListingPage';
import DashboardPage from './pages/DashboardPage';
import ModerationPage from './pages/ModerationPage';
import LoginPage from './pages/LoginPage';
import AuthCallbackPage from './pages/AuthCallbackPage';

export default function App() {
  return (
    <AuthProvider>
      <CompareProvider>
        <Router>
          <Routes>
            {/* ── Auth routes (no Navbar/Footer chrome) ── */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />

            {/* ── Main app shell (with Navbar + Footer) ── */}
            <Route
              path="/*"
              element={
                <div className="min-h-screen relative flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
                  {/* Ambient animated luxury background */}
                  <LuxuryBackground />

                  {/* Application layer */}
                  <div className="relative z-10 flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-1">
                      <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/listings" element={<ListingsPage />} />
                        <Route path="/listings/:id" element={<ListingDetailPage />} />

                        {/* Protected routes (require sign-in when Supabase is configured) */}
                        <Route
                          path="/listings/new"
                          element={
                            <ProtectedRoute>
                              <CreateListingPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/dashboard"
                          element={
                            <ProtectedRoute>
                              <DashboardPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/moderation"
                          element={
                            <ProtectedRoute>
                              <ModerationPage />
                            </ProtectedRoute>
                          }
                        />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </main>
                    <CostCalculator />
                    <Footer />
                  </div>
                </div>
              }
            />
          </Routes>
        </Router>
      </CompareProvider>
    </AuthProvider>
  );
}
