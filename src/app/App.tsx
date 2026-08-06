'use client';

import React from 'react';
import { Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Home from '../templates/Home';
import Login from '../templates/Login';
import Register from '../templates/Register';
import Programs from '../templates/Programs';
import ProgramDetails from '../templates/ProgramDetails';
import ProgramContent from '../templates/ProgramContent';
import Cart from '../templates/Cart';
import Create from '../templates/Create';
import MyProgram from '../templates/MyProgram';
import MyWorkouts from '../templates/MyWorkouts';
import PurchaseHistoryPage from '../templates/PurchaseHistoryPage';
import Chat from '../templates/Chat';
import AuthCallback from '../templates/AuthCallback';
import Guide from '../templates/Guide';
import CalisthenicsRoom from '../templates/CalisthenicsRoom';
import PrivacyPolicyPage from '../templates/PrivacyPolicy';
import TermsPage from '../templates/TermsPage';
import Feedback from '../templates/Feedback';

import Dashboard from '../templates/Dashboard';
import Success from '../templates/Success';
import NotFound from '../templates/NotFound';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isChatPage = location.pathname === '/chat';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isCartPage = location.pathname === '/cart';

  return (
    <div className="flex flex-col grow">
      {!isChatPage && !isAuthPage && !isCartPage && <Navbar />}
      <main className="grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/program/:id" element={<ProgramDetails />} />
          {/* Redirect /programs/:id → /program/:id for backwards compatibility */}
          <Route path="/programs/:id" element={<NavigateToProgramDetails />} />
          <Route path="/program/:id/content" element={<ProgramContent />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/create" element={<Create />} />
          <Route path="/my-program" element={<MyProgram />} />
          <Route path="/my-workouts" element={<MyWorkouts />} />
          <Route path="/purchase-history" element={<PurchaseHistoryPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/calisthenics-room" element={<CalisthenicsRoom />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/feedback" element={<Feedback />} />

          <Route path="/success" element={<Success />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isChatPage && !isAuthPage && !isCartPage && <Footer />}
    </div>
  );
}

export default function App() {
  return <AppContent />;
}

// Redirects /programs/:id → /program/:id (backwards compatibility)
const NavigateToProgramDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/program/${id}`} replace />;
};
