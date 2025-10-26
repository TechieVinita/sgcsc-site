import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Disclaimer from './pages/Disclaimer';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CenterLogin from './pages/CenterLogin';
import FranchiseDetails from './pages/FranchiseDetails';
import CertificateVerification from './pages/CertificateVerification';
import ResultVerification from './pages/ResultVerification';
import FranchiseRegistration from './pages/FranchiseRegistration';
import StudyCenterList from "./pages/StudyCenterList";
import EnrollmentVerification from "./pages/EnrollmentVerification";
import AdmitCard from "./pages/AdmitCard";
import StudentLogin from "./pages/StudentLogin";
import LongTermCourses from "./pages/LongTermCourses";
import ShortTermCourses from "./pages/ShortTermCourses";
import CertificateCourses from "./pages/CertificateCourses";










import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css'; 

export default function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />

        {/* This makes the main content take the remaining vertical space */}
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/study-centers" element={<StudyCenterList />} />
            <Route path="/franchise-details" element={<FranchiseDetails />} />
            <Route path="/center-login" element={<CenterLogin />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/franchise-details" element={<FranchiseDetails />} />
            <Route path="/result-verification" element={<ResultVerification />} />
            <Route path="/franchise-registration" element={<FranchiseRegistration />} />
            <Route path="/certificate-verification" element={<CertificateVerification />} />
            <Route path="/enrollment-verification" element={<EnrollmentVerification />} />
            <Route path="/admit-card" element={<AdmitCard />} />
            <Route path="/student-login" element={<StudentLogin />} />
            <Route path="/long-term-courses" element={<LongTermCourses />} />
            <Route path="/short-term-courses" element={<ShortTermCourses />} />
            <Route path="/certificate-courses" element={<CertificateCourses />} />    



          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}
