// src/pages/StudentCertificateVerification.jsx
import { useState, useEffect } from "react";
import API from "../api/axiosInstance";
import { jsPDF } from "jspdf";

export default function StudentCertificateVerification() {
  const [rollNumber, setRollNumber] = useState("");
  const [certificate, setCertificate] = useState(null);
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
    setCertificate(null);
    setLoading(true);

    try {
      const res = await API.post("/public/verify/certificate", {
        rollNumber,
      });
      // Handle both single certificate and array of certificates
      const data = res.data.data;
      setCertificate(Array.isArray(data) ? data : [data]);
    } catch {
      setError("Certificate not found. Please check your roll number.");
    } finally {
      setLoading(false);
    }
  };

  // Generate PDF for certificate
  const generateCertificatePDF = (cert) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = 30;

    // Header border
    doc.setDrawColor(0, 102, 204);
    doc.setLineWidth(1);
    doc.rect(margin, 15, pageWidth - 2 * margin, 120);

    // Title
    doc.setFontSize(22);
    doc.setTextColor(0, 102, 204);
    doc.text("CERTIFICATE OF COMPLETION", pageWidth / 2, y, { align: "center" });
    y += 15;

    // Subtitle
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text("This is to certify that", pageWidth / 2, y, { align: "center" });
    y += 12;

    // Student Name
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text(cert.name || "N/A", pageWidth / 2, y, { align: "center" });
    y += 10;

    // Father's Name
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(`S/D of ${cert.fatherName || "-"}`, pageWidth / 2, y, { align: "center" });
    y += 15;

    // Certificate text
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    const text = `has successfully completed the course`;
    doc.text(text, pageWidth / 2, y, { align: "center" });
    y += 10;

    // Course Name
    doc.setFontSize(16);
    doc.setTextColor(0, 102, 0);
    doc.text(cert.courseName || "-", pageWidth / 2, y, { align: "center" });
    y += 12;

    // Session and Grade
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(`Session: ${cert.sessionFrom || "-"} - ${cert.sessionTo || "-"}`, pageWidth / 2, y, { align: "center" });
    y += 8;
    doc.text(`Grade: ${cert.grade || "-"}`, pageWidth / 2, y, { align: "center" });
    y += 20;

    // Certificate details section
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin + 10, y, pageWidth - margin - 10, y);
    y += 10;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Certificate No: ${cert.certificateNumber || "-"}`, margin + 10, y);
    doc.text(`Enrollment No: ${cert.enrollmentNumber || "-"}`, pageWidth - margin - 10, y, { align: "right" });
    y += 8;
    doc.text(`Issue Date: ${cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : "-"}`, margin + 10, y);

    // Footer
    y = 145;
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("This is a computer-generated certificate. Verification can be done on the website.", pageWidth / 2, y, { align: "center" });

    return doc;
  };

  // Download certificate as PDF
  const downloadCertificate = (cert) => {
    const doc = generateCertificatePDF(cert);
    doc.save(`certificate_${cert.enrollmentNumber || cert.certificateNumber || "student"}.pdf`);
  };

  // Download all certificates (for both logged in users and public verification)
  const downloadAllCertificates = (certs) => {
    // Use provided certs or fall back to myCertificates (for logged in users)
    const certificates = certs || myCertificates;
    if (!certificates || certificates.length === 0) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;

    certificates.forEach((cert, index) => {
      if (index > 0) {
        doc.addPage();
      }

      let y = 30;

      // Header border
      doc.setDrawColor(0, 102, 204);
      doc.setLineWidth(1);
      doc.rect(margin, 15, pageWidth - 2 * margin, 120);

      // Page header
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(`Certificate ${index + 1} of ${myCertificates.length}`, pageWidth / 2, 22, { align: "center" });

      // Title
      doc.setFontSize(22);
      doc.setTextColor(0, 102, 204);
      doc.text("CERTIFICATE OF COMPLETION", pageWidth / 2, y, { align: "center" });
      y += 15;

      // Subtitle
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text("This is to certify that", pageWidth / 2, y, { align: "center" });
      y += 12;

      // Student Name
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.text(cert.name || "N/A", pageWidth / 2, y, { align: "center" });
      y += 10;

      // Father's Name
      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80);
      doc.text(`S/D of ${cert.fatherName || "-"}`, pageWidth / 2, y, { align: "center" });
      y += 15;

      // Certificate text
      doc.setFontSize(12);
      doc.setTextColor(50, 50, 50);
      doc.text("has successfully completed the course", pageWidth / 2, y, { align: "center" });
      y += 10;

      // Course Name
      doc.setFontSize(16);
      doc.setTextColor(0, 102, 0);
      doc.text(cert.courseName || "-", pageWidth / 2, y, { align: "center" });
      y += 12;

      // Session and Grade
      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80);
      doc.text(`Session: ${cert.sessionFrom || "-"} - ${cert.sessionTo || "-"}`, pageWidth / 2, y, { align: "center" });
      y += 8;
      doc.text(`Grade: ${cert.grade || "-"}`, pageWidth / 2, y, { align: "center" });
      y += 20;

      // Certificate details section
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(margin + 10, y, pageWidth - margin - 10, y);
      y += 10;

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Certificate No: ${cert.certificateNumber || "-"}`, margin + 10, y);
      doc.text(`Enrollment No: ${cert.enrollmentNumber || "-"}`, pageWidth - margin - 10, y, { align: "right" });
      y += 8;
      doc.text(`Issue Date: ${cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : "-"}`, margin + 10, y);
    });

    // Footer on last page
    const finalY = 145;
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("This is a computer-generated certificate. Verification can be done on the website.", pageWidth / 2, finalY, { align: "center" });

    doc.save(`all_certificates_${myCertificates[0]?.enrollmentNumber || "student"}.pdf`);
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
                      <i className="bi bi-award-fill text-warning" style={{ fontSize: "2rem" }}></i>
                      <h5 className="mt-2 mb-0">Certificate of Completion</h5>
                      <p className="text-muted mb-0">#{index + 1}</p>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => downloadCertificate(cert)}
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
                      <p><strong>Issue Date:</strong> {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : "-"}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {myCertificates.length > 1 && (
              <div className="text-center mt-4">
                <button className="btn btn-primary" onClick={() => downloadAllCertificates()}>
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
      <p className="text-center text-muted mb-4">
        Enter your roll number to verify and download your certificate
      </p>

      <form onSubmit={handleSubmit} className="card p-4 mx-auto" style={{ maxWidth: 500 }}>
        <div className="mb-3">
          <label className="form-label">Roll Number</label>
          <input
            className="form-control"
            placeholder="Enter your roll number"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Verifying..." : "Verify & Download"}
        </button>
      </form>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {certificate && (
        <div>
          {certificate.map((cert, index) => (
            <div key={index} className="card mt-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Certificate #{index + 1}</h5>
                <button
                  className="btn btn-primary"
                  onClick={() => downloadCertificate(cert)}
                >
                  <i className="bi bi-download me-1"></i> Download PDF
                </button>
              </div>
              <div className="card-body">
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
                    <p><strong>Issue Date:</strong> {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : "-"}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Download All Button */}
          {certificate.length > 1 && (
            <div className="text-center mt-4">
              <button className="btn btn-success" onClick={() => downloadAllCertificates(certificate)}>
                <i className="bi bi-download me-2"></i>
                Download All Certificates
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
