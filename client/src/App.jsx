import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CostCalculator from './components/CostCalculator';
import LuxuryBackground from './components/LuxuryBackground';
import LandingPage from './pages/LandingPage';
import ListingsPage from './pages/ListingsPage';
import ListingDetailPage from './pages/ListingDetailPage';
import CreateListingPage from './pages/CreateListingPage';
import DashboardPage from './pages/DashboardPage';
import ModerationPage from './pages/ModerationPage';

export default function App() {
  return (
    <AuthProvider>
      <CompareProvider>
        <Router>
          <div className="min-h-screen relative flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
            {/* Ambient Animated Luxury Background */}
            <LuxuryBackground />

            {/* Application Layer */}
            <div className="relative z-10 flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/listings" element={<ListingsPage />} />
                  <Route path="/listings/new" element={<CreateListingPage />} />
                  <Route path="/listings/:id" element={<ListingDetailPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/moderation" element={<ModerationPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <CostCalculator />
              <Footer />
            </div>
          </div>
        </Router>
      </CompareProvider>
    </AuthProvider>
  );
}
