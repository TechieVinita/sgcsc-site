// src/App.jsx
import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

// DEV: local test logo you uploaded (will be converted to a URL by your tooling)
// Use this only in development; replace with a CDN/real URL in production.
export const DEV_LOGO_URL = '/mnt/data/58e83842-f724-41ef-b678-0d3ad1e30ed8.png';

// Lazy-loaded pages for smaller initial bundle
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Courses = lazy(() => import('./pages/Courses'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const CenterLogin = lazy(() => import('./pages/CenterLogin'));
const FranchiseVerification = lazy(() => import('./pages/FranchiseVerification'));
const FranchiseList = lazy(() => import('./pages/FranchiseList'));
const CertificateVerification = lazy(() => import('./pages/CertificateVerification'));
const ResultVerification = lazy(() => import('./pages/ResultVerification'));
const FranchiseRegistration = lazy(() => import('./pages/FranchiseRegistration'));
const StudyCenterList = lazy(() => import('./pages/StudyCenterList'));
const EnrollmentVerification = lazy(() => import('./pages/EnrollmentVerification'));
const AdmitCard = lazy(() => import('./pages/AdmitCard'));
const StudentLogin = lazy(() => import('./pages/StudentLogin'));
const StudentSignup = lazy(() => import('./pages/StudentSignup'));
const FranchiseLogin = lazy(() => import('./pages/FranchiseLogin'));
const LongTermCourses = lazy(() => import('./pages/LongTermCourses'));
const ShortTermCourses = lazy(() => import('./pages/ShortTermCourses'));
const CertificateCourses = lazy(() => import('./pages/CertificateCourses'));

// Small UX: scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />

        <div className="flex-grow-1">
          <Suspense fallback={<div className="text-center py-5">Loading...</div>}>
            <ScrollToTop />
            <Routes>
              {/* Public pages */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />

              {/* Courses */}
              <Route path="/courses" element={<Courses />} />
              <Route path="/long-term-courses" element={<LongTermCourses />} />
              <Route path="/short-term-courses" element={<ShortTermCourses />} />
              <Route path="/certificate-courses" element={<CertificateCourses />} />

              {/* Gallery & Contact */}
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />

              {/* Franchise flows */}
              <Route path="/franchise-list" element={<FranchiseList />} />
              <Route path="/franchise-registration" element={<FranchiseRegistration />} />
              <Route path="/franchise-login" element={<FranchiseLogin />} />
              <Route path="/franchise-verification" element={<FranchiseVerification />} />

              {/* Student flows */}
              <Route path="/student-login" element={<StudentLogin />} />
              <Route path="/student-signup" element={<StudentSignup />} />

              {/* Utility / verification pages */}
              <Route path="/study-centers" element={<StudyCenterList />} />
              <Route path="/result-verification" element={<ResultVerification />} />
              <Route path="/certificate-verification" element={<CertificateVerification />} />
              <Route path="/enrollment-verification" element={<EnrollmentVerification />} />
              <Route path="/admit-card" element={<AdmitCard />} />
              <Route path="/center-login" element={<CenterLogin />} />

              {/* Legal */}
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />

              {/* 404 fallback */}
              <Route
                path="*"
                element={
                  <div className="container my-5 text-center">
                    <h2 className="mb-3">404 — Page not found</h2>
                    <p className="text-muted">The page you're looking for doesn't exist.</p>
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </div>

        <Footer />
      </div>
    </Router>
  );
}
