import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { StressTraumaAssessment } from './pages/StressTraumaAssessment'
import { RegisterGrievance } from './pages/RegisterGrievance'
import { RegisterRescue } from './pages/RegisterRescue'
import { TrackStatus } from './pages/TrackStatus'
import { HelpFaqs } from './pages/HelpFaqs'
import { AdminLogin } from './pages/AdminLogin'
import { AdminDashboard } from './pages/AdminDashboard'
import { CitizenLogin } from './pages/CitizenLogin'

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Citizen Portal Layout Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="register-grievance" element={<RegisterGrievance />} />
          <Route path="register-rescue" element={<RegisterRescue />} />
          <Route path="stress-trauma-assessment" element={<StressTraumaAssessment />} />
          <Route path="assessment" element={<Navigate to="/stress-trauma-assessment" replace />} />
          <Route path="track-status" element={<TrackStatus />} />
          <Route path="help-faqs" element={<HelpFaqs />} />
        </Route>

        {/* Administration Officer Portal Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/saathi-console" element={<Navigate to="/admin/dashboard?tab=saathi" replace />} />

        {/* Citizen Login Route */}
        <Route path="/citizen/login" element={<CitizenLogin />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
