import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        {/* Logo */}
        <NavLink className="navbar-brand fw-bold" to="/">
          <img src="/logo.jpeg" alt="SGCSC Logo" height="50" />
        </NavLink>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">

            {/* Home */}
            <li className="nav-item">
              <NavLink to="/" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                Home
              </NavLink>
            </li>

            {/* About Company */}
            <li className="nav-item">
              <NavLink to="/about" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                About Company
              </NavLink>
            </li>

            {/* Our Courses Dropdown */}
            <li className="nav-item dropdown">
              <span 
                className="nav-link dropdown-toggle" 
                id="coursesDropdown" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
                style={{ cursor: "pointer" }}
              >
                Our Courses
              </span>
              <ul className="dropdown-menu" aria-labelledby="coursesDropdown">
                <li><NavLink className="dropdown-item" to="/courses/long-term">Long Term Courses (1 Year)</NavLink></li>
                <li><NavLink className="dropdown-item" to="/courses/short-term">Short Term Courses (6 Months)</NavLink></li>
                <li><NavLink className="dropdown-item" to="/courses/basic">Certificate Courses (3 Months)</NavLink></li>
              </ul>
            </li>

            {/* Franchise Dropdown */}
            <li className="nav-item dropdown">
              <span 
                className="nav-link dropdown-toggle" 
                id="franchiseDropdown" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
                style={{ cursor: "pointer" }}
              >
                Franchise
              </span>
              <ul className="dropdown-menu" aria-labelledby="franchiseDropdown">
                <li><NavLink className="dropdown-item" to="/franchise-registration">Franchise Registration Online</NavLink></li>
                <li><NavLink className="dropdown-item" to="/franchise-details">Franchise Details</NavLink></li>
                <li><NavLink className="dropdown-item" to="/franchise-verification">Franchise Verification</NavLink></li>
                <li><NavLink className="dropdown-item" to="/study-center-list">Study Center List</NavLink></li>
                <li><NavLink className="dropdown-item" to="/center-login">Center Login</NavLink></li>
              </ul>
            </li>

            {/* Student Dropdown */}
            <li className="nav-item dropdown">
              <span 
                className="nav-link dropdown-toggle" 
                id="studentDropdown" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
                style={{ cursor: "pointer" }}
              >
                Student
              </span>
              <ul className="dropdown-menu" aria-labelledby="studentDropdown">
                <li><NavLink className="dropdown-item" to="/enrollment-verification">Enrollment Verification</NavLink></li>
                <li><NavLink className="dropdown-item" to="/result-verification">Result Verification</NavLink></li>
                <li><NavLink className="dropdown-item" to="/certificate-verification">Certificate Verification</NavLink></li>
                <li><NavLink className="dropdown-item" to="/admit-card">Admit Card</NavLink></li>
                <li><NavLink className="dropdown-item" to="/student-login">Student Login</NavLink></li>
              </ul>
            </li>

            {/* Gallery */}
            <li className="nav-item">
              <NavLink to="/gallery" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                Gallery
              </NavLink>
            </li>

            {/* Contact */}
            <li className="nav-item">
              <NavLink to="/contact" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                Contact
              </NavLink>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}
