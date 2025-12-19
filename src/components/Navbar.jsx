import { NavLink } from "react-router-dom";

export default function Navbar() {
const franchiseToken = localStorage.getItem("token");
const studentToken = localStorage.getItem("student_token");

const isFranchiseLoggedIn = !!franchiseToken;
// const isStudentLoggedIn = !!studentToken;

const isStudentLoggedIn = !!localStorage.getItem("student_token");


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
                <li><NavLink className="dropdown-item" to="/long-term-courses">Long Term Courses (1 Year)</NavLink></li>
                <li><NavLink className="dropdown-item" to="/short-term-courses">Short Term Courses (6 Months)</NavLink></li>
                <li><NavLink className="dropdown-item" to="/certificate-courses">Certificate Courses (3 Months)</NavLink></li>
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
                <li><NavLink className="dropdown-item" to="/franchise-registration">Franchise Registration</NavLink></li>
                {/* <li><NavLink className="dropdown-item" to="/franchise-details">Franchise Details</NavLink></li> */}
                <li><NavLink className="dropdown-item" to="/franchise-verification">Franchise Verification</NavLink></li>
                <li><NavLink className="dropdown-item" to="/study-centers">Franchise List</NavLink></li>

                {!isFranchiseLoggedIn && (
  <li>
    <NavLink className="dropdown-item" to="/franchise-login">
      Franchise Login
    </NavLink>
  </li>
)}

{isFranchiseLoggedIn && (
  <>
    <li>
      <NavLink className="dropdown-item" to="/franchise/profile">
        Profile
      </NavLink>
    </li>
    <li>
      <button
        className="dropdown-item text-danger"
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("currentUser");
          window.location.href = "/franchise-login";
        }}
      >
        Logout
      </button>
    </li>
  </>
)}

              </ul>
            </li>

            {/* Student Dropdown */}
<li className="nav-item dropdown">
  <a
    className="nav-link dropdown-toggle"
    href="#"
    role="button"
    data-bs-toggle="dropdown"
  >
    Student
  </a>

  <ul className="dropdown-menu">
    {/* PUBLIC */}
    <li>
      <a className="dropdown-item" href="/student/enrollment-verification">
        Enrollment Verification
      </a>
    </li>
    <li>
      <a className="dropdown-item" href="/student/result-verification">
        Result Verification
      </a>
    </li>
    <li>
      <a className="dropdown-item" href="/student/certificate-verification">
        Certificate Verification
      </a>
    </li>

    {isStudentLoggedIn && (
      <>
        <li><hr className="dropdown-divider" /></li>

        {/* PROTECTED */}
        <li>
          <a className="dropdown-item" href="/student/profile">
            Student Profile
          </a>
        </li>
        <li>
          <a className="dropdown-item" href="/student/results">
            My Results
          </a>
        </li>
        <li>
          <a className="dropdown-item" href="/student/admit-card">
            Admit Card
          </a>
        </li>

        <li><hr className="dropdown-divider" /></li>

        <li>
          <button
            className="dropdown-item text-danger"
            onClick={() => {
              localStorage.removeItem("student_token");
              window.location.href = "/student-login";
            }}
          >
            Logout
          </button>
        </li>
      </>
    )}
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
