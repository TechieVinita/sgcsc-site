import { useState, useEffect } from "react";
import API from "../api/axiosInstance";

export default function StudentEnrollmentVerification() {
  const [enrollmentNo, setEnrollmentNo] = useState("");
  const [dob, setDob] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Check if student is logged in
  const studentToken = localStorage.getItem("student_token");
  const isLoggedIn = !!studentToken;
  const [myEnrollment, setMyEnrollment] = useState(null);
  const [loadingMyEnrollment, setLoadingMyEnrollment] = useState(false);

  // Fetch logged-in student's enrollment info
  useEffect(() => {
    if (isLoggedIn) {
      fetchMyEnrollment();
    }
  }, [isLoggedIn]);

  const fetchMyEnrollment = async () => {
    setLoadingMyEnrollment(true);
    try {
      const res = await API.get("/student-profile/enrollment");
      if (res.data.success) {
        setMyEnrollment(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch enrollment:", err);
    } finally {
      setLoadingMyEnrollment(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await API.post("/public/enrollment", {
        enrollmentNo,
        dob,
      });

      setResult(res.data.data);
    } catch {
      setError("No record found.");
    } finally {
      setLoading(false);
    }
  };

  // Download enrollment info as PDF
  const downloadEnrollmentPDF = () => {
    if (!myEnrollment) return;

    const content = `
===============================================
        ENROLLMENT VERIFICATION CERTIFICATE
===============================================

Enrollment Number : ${myEnrollment.enrollmentNo}
Roll Number       : ${myEnrollment.rollNumber}

Student Details:
----------------
Name             : ${myEnrollment.name}
Father's Name   : ${myEnrollment.fatherName}
Mother's Name    : ${myEnrollment.motherName}
Date of Birth    : ${myEnrollment.dob ? new Date(myEnrollment.dob).toLocaleDateString() : '-'}

Course Details:
---------------
Course           : ${myEnrollment.course || '-'}
Center           : ${myEnrollment.centerName || '-'}
Session Start    : ${myEnrollment.sessionStart ? new Date(myEnrollment.sessionStart).toLocaleDateString() : '-'}
Session End      : ${myEnrollment.sessionEnd ? new Date(myEnrollment.sessionEnd).toLocaleDateString() : '-'}

Fee Details:
------------
Total Fee        : ₹${myEnrollment.feeAmount || 0}
Amount Paid      : ₹${myEnrollment.amountPaid || 0}
Pending Amount   : ₹${myEnrollment.pendingAmount || 0}

Status:
-------
Fees Paid        : ${myEnrollment.feesPaid ? 'Yes' : 'No'}
Certified        : ${myEnrollment.isCertified ? 'Yes' : 'No'}
Join Date        : ${myEnrollment.joinDate ? new Date(myEnrollment.joinDate).toLocaleDateString() : '-'}

===============================================
This is a computer-generated document.
Verification can be done on the website.
===============================================
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enrollment_${myEnrollment.enrollmentNo}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // If logged in, show student's own enrollment
  if (isLoggedIn) {
    return (
      <div className="container py-5">
        <h2 className="text-center mb-4">My Enrollment Details</h2>

        {loadingMyEnrollment ? (
          <div className="text-center">
            <p>Loading your enrollment details...</p>
          </div>
        ) : myEnrollment ? (
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <p><strong>Enrollment Number:</strong> {myEnrollment.enrollmentNo}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Roll Number:</strong> {myEnrollment.rollNumber}</p>
                </div>
              </div>

              <h5 className="border-bottom pb-2 mb-3">Personal Details</h5>
              <div className="row mb-3">
                <div className="col-md-6">
                  <p><strong>Name:</strong> {myEnrollment.name}</p>
                  <p><strong>Father's Name:</strong> {myEnrollment.fatherName || '-'}</p>
                  <p><strong>Mother's Name:</strong> {myEnrollment.motherName || '-'}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Date of Birth:</strong> {myEnrollment.dob ? new Date(myEnrollment.dob).toLocaleDateString() : '-'}</p>
                </div>
              </div>

              <h5 className="border-bottom pb-2 mb-3">Course Details</h5>
              
              {/* Show all enrolled courses */}
              {myEnrollment.courses && myEnrollment.courses.length > 0 ? (
                myEnrollment.courses.map((course, index) => (
                  <div key={index} className="card mb-3">
                    <div className="card-body">
                      <h6 className="card-subtitle mb-2 text-muted">Course {index + 1}</h6>
                      <div className="row">
                        <div className="col-md-6">
                          <p><strong>Course:</strong> {course.courseName || '-'}</p>
                          <p><strong>Center:</strong> {myEnrollment.centerName || '-'}</p>
                          <p><strong>Session:</strong> {course.sessionStart ? new Date(course.sessionStart).getFullYear() : '-'} - {course.sessionEnd ? new Date(course.sessionEnd).getFullYear() : '-'}</p>
                        </div>
                        <div className="col-md-6">
                          <p><strong>Fee:</strong> ₹{course.feeAmount || 0}</p>
                          <p><strong>Paid:</strong> ₹{course.amountPaid || 0}</p>
                          <p>
                            <strong>Pending:</strong>{' '}
                            <span className={`badge ${((course.feeAmount || 0) - (course.amountPaid || 0)) > 0 ? 'bg-danger' : 'bg-success'}`}>
                              ₹{(course.feeAmount || 0) - (course.amountPaid || 0)}
                            </span>
                          </p>
                          <p><strong>Paid?</strong> {course.feesPaid ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p><strong>Course:</strong> {myEnrollment.course || '-'}</p>
                    <p><strong>Center:</strong> {myEnrollment.centerName || '-'}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Session:</strong> {myEnrollment.sessionStart ? new Date(myEnrollment.sessionStart).getFullYear() : '-'} - {myEnrollment.sessionEnd ? new Date(myEnrollment.sessionEnd).getFullYear() : '-'}</p>
                    <p><strong>Join Date:</strong> {myEnrollment.joinDate ? new Date(myEnrollment.joinDate).toLocaleDateString() : '-'}</p>
                  </div>
                </div>
              )}

              <h5 className="border-bottom pb-2 mb-3">Status</h5>
              <div className="row mb-3">
                <div className="col-md-6">
                  <p>
                    <strong>Fees Paid:</strong>{" "}
                    <span className={`badge ${myEnrollment.feesPaid ? 'bg-success' : 'bg-warning'}`}>
                      {myEnrollment.feesPaid ? 'Yes' : 'No'}
                    </span>
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Certified:</strong>{" "}
                    <span className={`badge ${myEnrollment.isCertified ? 'bg-success' : 'bg-secondary'}`}>
                      {myEnrollment.isCertified ? 'Yes' : 'No'}
                    </span>
                  </p>
                </div>
              </div>

              <h5 className="border-bottom pb-2 mb-3">Fee Details</h5>
              <div className="row mb-3">
                <div className="col-md-4">
                  <p><strong>Total Fee:</strong> ₹{myEnrollment.feeAmount || 0}</p>
                </div>
                <div className="col-md-4">
                  <p><strong>Amount Paid:</strong> ₹{myEnrollment.amountPaid || 0}</p>
                </div>
                <div className="col-md-4">
                  <p>
                    <strong>Pending:</strong>{" "}
                    <span className={`badge ${(myEnrollment.pendingAmount || 0) > 0 ? 'bg-danger' : 'bg-success'}`}>
                      ₹{myEnrollment.pendingAmount || 0}
                    </span>
                  </p>
                </div>
              </div>

              <div className="text-center mt-4">
                <button className="btn btn-primary" onClick={downloadEnrollmentPDF}>
                  <i className="bi bi-download me-2"></i>
                  Download Enrollment Info
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="alert alert-warning">
            Unable to load your enrollment details. Please contact your center.
          </div>
        )}
      </div>
    );
  }

  // Public verification form for non-logged-in users
  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Enrollment Verification</h2>

      <form onSubmit={handleSubmit} className="card p-4 mx-auto" style={{ maxWidth: 500 }}>
        <input className="form-control mb-3" placeholder="Enrollment No"
          value={enrollmentNo} onChange={(e) => setEnrollmentNo(e.target.value)} />
        <input type="date" className="form-control mb-3"
          value={dob} onChange={(e) => setDob(e.target.value)} />
        <button className="btn btn-primary" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {result && (
        <div className="card mt-4 p-3">
          <p><b>Name:</b> {result.name}</p>
          <p><b>Course:</b> {result.course}</p>
          <p><b>Session:</b> {result.session}</p>
          <p><b>Status:</b> {result.status}</p>
        </div>
      )}
    </div>
  );
}
