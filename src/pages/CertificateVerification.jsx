import React, { useState } from "react";

export default function CertificateVerification() {
  const [enrollmentNo, setEnrollmentNo] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!enrollmentNo.trim()) {
      setError("Please enter your Enrollment Number.");
      setCertificate(null);
      return;
    }

    // Simulated certificate lookup (Replace with backend API call later)
    if (enrollmentNo === "SGC2025A001") {
      setCertificate({
        name: "Ajay Maurya",
        course: "Advance Diploma in Computer Application (ADCA)",
        issueDate: "2025-06-20",
        certificateNo: "SGCS/ADCA/2025/001",
        status: "Verified",
      });
      setError("");
    } else {
      setError("No record found for the given Enrollment Number.");
      setCertificate(null);
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "600px" }}>
        <h3 className="text-center mb-4 fw-bold text-primary">
          Certificate Verification
        </h3>

        <form onSubmit={handleSubmit}>
          {/* Enrollment Number */}
          <div className="mb-3">
            <label className="form-label">Enrollment No.</label>
            <input
              type="text"
              placeholder="Enter Enrollment No."
              value={enrollmentNo}
              onChange={(e) => setEnrollmentNo(e.target.value)}
              className="form-control"
            />
          </div>

          {/* Error Message */}
          {error && <div className="alert alert-danger py-2">{error}</div>}

          {/* Submit Button */}
          <div className="text-center">
            <button type="submit" className="btn btn-primary px-5">
              Submit
            </button>
          </div>
        </form>

        {/* Display Certificate Info */}
        {certificate && (
          <div className="mt-4 p-3 border rounded bg-light">
            <h5 className="text-success mb-3">Certificate Verified:</h5>
            <p><strong>Name:</strong> {certificate.name}</p>
            <p><strong>Course:</strong> {certificate.course}</p>
            <p><strong>Issue Date:</strong> {certificate.issueDate}</p>
            <p><strong>Certificate No.:</strong> {certificate.certificateNo}</p>
            <p><strong>Status:</strong> {certificate.status}</p>
          </div>
        )}
      </div>
    </div>
  );
}
