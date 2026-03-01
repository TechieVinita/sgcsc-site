import { useState, useEffect } from "react";
import API from "../api/axiosInstance";

export default function StudentCertificateVerification() {
  const [certificateNo, setCertificateNo] = useState("");
  const [dob, setDob] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Check if student is logged in
  const studentToken = localStorage.getItem("student_token");
  const isLoggedIn = !!studentToken;
  const [myCertificates, setMyCertificates] = useState([]);
  const [loadingMyCertificate, setLoadingMyCertificate] = useState(false);

  // Fetch logged-in student's certificates
  useEffect(() => {
    if (isLoggedIn) {
      fetchMyCertificates();
    }
  }, [isLoggedIn]);

  const fetchMyCertificates = async () => {
    setLoadingMyCertificate(true);
    try {
      const res = await API.get("/student-profile/certificate");
      if (res.data.success) {
        // Handle both single certificate and array of certificates
        const data = res.data.data;
        setMyCertificates(Array.isArray(data) ? data : [data]);
      }
    } catch (err) {
      console.error("Failed to fetch certificates:", err);
    } finally {
      setLoadingMyCertificate(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await API.post("/public/certificate", {
        certificateNo,
        dob,
      });
      setResult(res.data.data);
    } catch {
      setError("Certificate not found.");
    } finally {
      setLoading(false);
    }
  };

  // Download single certificate as PDF
  const downloadSingleCertificate = (cert) => {
    const content = `
===============================================
           CERTIFICATE OF COMPLETION
===============================================

Certificate Number : ${cert.certificateNumber || '-'}
Enrollment Number  : ${cert.enrollmentNumber || '-'}

Student Details:
----------------
Name             : ${cert.name}
Father's Name   : ${cert.fatherName}

Course Details:
---------------
Course           : ${cert.courseName}
Session          : ${cert.sessionFrom} - ${cert.sessionTo}
Grade            : ${cert.grade}

Issue Date       : ${cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : '-'}

===============================================
This is a computer-generated certificate.
Verification can be done on the website
using the certificate number.
===============================================
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `certificate_${cert.certificateNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download all certificates
  const downloadAllCertificates = () => {
    if (!myCertificates || myCertificates.length === 0) return;

    let content = "";

    myCertificates.forEach((cert, index) => {
      content += `
===============================================
     CERTIFICATE #${index + 1} OF ${myCertificates.length}
===============================================

Certificate Number : ${cert.certificateNumber || '-'}
Enrollment Number  : ${cert.enrollmentNumber || '-'}

Student Details:
----------------
Name             : ${cert.name}
Father's Name   : ${cert.fatherName}

Course Details:
---------------
Course           : ${cert.courseName}
Session          : ${cert.sessionFrom} - ${cert.sessionTo}
Grade            : ${cert.grade}

Issue Date       : ${cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : '-'}

      `;
    });

    content += `
===============================================
This is a computer-generated certificate.
All certificates for this student are included above.
===============================================
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `all_certificates_${myCertificates[0]?.enrollmentNumber || 'student'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // If logged in, show student's own certificates
  if (isLoggedIn) {
    return (
      <div className="container py-5">
        <h2 className="text-center mb-4">My Certificates</h2>

        {loadingMyCertificate ? (
          <div className="text-center">
            <p>Loading your certificates...</p>
          </div>
        ) : myCertificates.length > 0 ? (
          <div>
            {myCertificates.map((cert, index) => (
              <div key={index} className="card shadow-sm mb-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="text-center flex-grow-1">
                      <i className="bi bi-award-fill text-warning" style={{ fontSize: '2rem' }}></i>
                      <h5 className="mt-2 mb-0">Certificate of Completion</h5>
                      <p className="text-muted mb-0">#{index + 1}</p>
                    </div>
                    <button 
                      className="btn btn-sm btn-outline-primary" 
                      onClick={() => downloadSingleCertificate(cert)}
                    >
                      <i className="bi bi-download me-1"></i> Download
                    </button>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p><strong>Certificate Number:</strong> {cert.certificateNumber}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Enrollment Number:</strong> {cert.enrollmentNumber}</p>
                    </div>
                  </div>

                  <h6 className="border-bottom pb-2 mb-3">Student Details</h6>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p><strong>Name:</strong> {cert.name}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Father's Name:</strong> {cert.fatherName}</p>
                    </div>
                  </div>

                  <h6 className="border-bottom pb-2 mb-3">Course Details</h6>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p><strong>Course:</strong> {cert.courseName}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Session:</strong> {cert.sessionFrom} - {cert.sessionTo}</p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <p>
                        <strong>Grade:</strong>{" "}
                        <span className="badge bg-success">{cert.grade}</span>
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Issue Date:</strong> {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : '-'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {myCertificates.length > 1 && (
              <div className="text-center mt-4">
                <button className="btn btn-primary" onClick={downloadAllCertificates}>
                  <i className="bi bi-download me-2"></i>
                  Download All Certificates
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="alert alert-warning">
            No certificates found. Please contact your center.
          </div>
        )}
      </div>
    );
  }

  // Public verification form for non-logged-in users
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Certificate Verification</h2>

      <form onSubmit={handleSubmit} className="card p-4 mx-auto" style={{ maxWidth: 500 }}>
        <input className="form-control mb-3" placeholder="Certificate No"
          value={certificateNo} onChange={(e) => setCertificateNo(e.target.value)} />
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
          <p><b>Issued:</b> {new Date(result.issueDate).toDateString()}</p>
        </div>
      )}
    </div>
  );
}
