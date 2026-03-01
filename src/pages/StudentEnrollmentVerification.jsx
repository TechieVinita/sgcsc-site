import { useState, useEffect } from "react";
import API from "../api/axiosInstance";
import { jsPDF } from "jspdf";

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

  // Generate PDF for enrollment
  const generateEnrollmentPDF = (enrollment) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = 20;

    // Header
    doc.setFillColor(0, 102, 204);
    doc.rect(0, 0, pageWidth, 35, "F");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text("ENROLLMENT CERTIFICATE", pageWidth / 2, y, { align: "center" });
    y = 45;

    // Enrollment Info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Enrollment Information", margin, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Enrollment Number: ${enrollment.enrollmentNo || "-"}`, margin, y);
    y += 6;
    doc.text(`Roll Number: ${enrollment.rollNumber || "-"}`, margin, y);
    y += 12;

    // Personal Details
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Personal Details", margin, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Name: ${enrollment.name || "-"}`, margin, y);
    y += 6;
    doc.text(`Father's Name: ${enrollment.fatherName || "-"}`, margin, y);
    y += 6;
    doc.text(`Mother's Name: ${enrollment.motherName || "-"}`, margin, y);
    y += 6;
    doc.text(`Date of Birth: ${enrollment.dob ? new Date(enrollment.dob).toLocaleDateString() : "-"}`, margin, y);
    y += 12;

    // Course Details
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Course Details", margin, y);
    y += 8;

    if (enrollment.courses && enrollment.courses.length > 0) {
      enrollment.courses.forEach((course, index) => {
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, y, pageWidth - 2 * margin, 35, "F");
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.text(`Course ${index + 1}: ${course.courseName || "-"}`, margin + 2, y + 6);
        doc.setFont("helvetica", "normal");
        doc.text(`Center: ${enrollment.centerName || "-"}`, margin + 2, y + 13);
        doc.text(`Session: ${course.sessionStart ? new Date(course.sessionStart).getFullYear() : "-"} - ${course.sessionEnd ? new Date(course.sessionEnd).getFullYear() : "-"}`, margin + 2, y + 20);
        doc.text(`Fee: Rs.${course.feeAmount || 0} | Paid: Rs.${course.amountPaid || 0}`, margin + 2, y + 27);
        doc.text(`Fees Paid: ${course.feesPaid ? "Yes" : "No"}`, margin + 100, y + 27);
        y += 40;
      });
    } else {
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Course: ${enrollment.course || "-"}`, margin, y);
      y += 6;
      doc.text(`Center: ${enrollment.centerName || "-"}`, margin, y);
      y += 6;
      doc.text(`Session: ${enrollment.sessionStart ? new Date(enrollment.sessionStart).getFullYear() : "-"} - ${enrollment.sessionEnd ? new Date(enrollment.sessionEnd).getFullYear() : "-"}`, margin, y);
      y += 12;
    }

    // Fee Summary
    doc.setFillColor(0, 102, 204);
    doc.rect(margin, y, pageWidth - 2 * margin, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("FEE SUMMARY", pageWidth / 2, y + 8, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Fee: Rs.${enrollment.feeAmount || 0}`, margin + 10, y + 18);
    doc.text(`Amount Paid: Rs.${enrollment.amountPaid || 0}`, margin + 70, y + 18);
    doc.text(`Pending: Rs.${enrollment.pendingAmount || 0}`, margin + 130, y + 18);
    y += 35;

    // Status
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Fees Paid: ${enrollment.feesPaid ? "YES" : "NO"}`, margin, y);
    doc.text(`Certified: ${enrollment.isCertified ? "YES" : "NO"}`, margin + 70, y);
    if (enrollment.joinDate) {
      doc.text(`Join Date: ${new Date(enrollment.joinDate).toLocaleDateString()}`, margin + 130, y);
    }

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 20;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("This is a computer-generated document. Verification can be done on the website.", pageWidth / 2, footerY, { align: "center" });

    return doc;
  };

  // Download enrollment info as PDF
  const downloadEnrollmentPDF = () => {
    if (!myEnrollment) return;
    const doc = generateEnrollmentPDF(myEnrollment);
    doc.save(`enrollment_${myEnrollment.enrollmentNo || "student"}.pdf`);
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
                  <p><strong>Father's Name:</strong> {myEnrollment.fatherName || "-"}</p>
                  <p><strong>Mother's Name:</strong> {myEnrollment.motherName || "-"}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Date of Birth:</strong> {myEnrollment.dob ? new Date(myEnrollment.dob).toLocaleDateString() : "-"}</p>
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
                          <p><strong>Course:</strong> {course.courseName || "-"}</p>
                          <p><strong>Center:</strong> {myEnrollment.centerName || "-"}</p>
                          <p><strong>Session:</strong> {course.sessionStart ? new Date(course.sessionStart).getFullYear() : "-"} - {course.sessionEnd ? new Date(course.sessionEnd).getFullYear() : "-"}</p>
                        </div>
                        <div className="col-md-6">
                          <p><strong>Fee:</strong> ₹{course.feeAmount || 0}</p>
                          <p><strong>Paid:</strong> ₹{course.amountPaid || 0}</p>
                          <p>
                            <strong>Pending:</strong>{" "}
                            <span className={`badge ${((course.feeAmount || 0) - (course.amountPaid || 0)) > 0 ? "bg-danger" : "bg-success"}`}>
                              ₹{(course.feeAmount || 0) - (course.amountPaid || 0)}
                            </span>
                          </p>
                          <p><strong>Paid?</strong> {course.feesPaid ? "Yes" : "No"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p><strong>Course:</strong> {myEnrollment.course || "-"}</p>
                    <p><strong>Center:</strong> {myEnrollment.centerName || "-"}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Session:</strong> {myEnrollment.sessionStart ? new Date(myEnrollment.sessionStart).getFullYear() : "-"} - {myEnrollment.sessionEnd ? new Date(myEnrollment.sessionEnd).getFullYear() : "-"}</p>
                    <p><strong>Join Date:</strong> {myEnrollment.joinDate ? new Date(myEnrollment.joinDate).toLocaleDateString() : "-"}</p>
                  </div>
                </div>
              )}

              <h5 className="border-bottom pb-2 mb-3">Status</h5>
              <div className="row mb-3">
                <div className="col-md-6">
                  <p>
                    <strong>Fees Paid:</strong>{" "}
                    <span className={`badge ${myEnrollment.feesPaid ? "bg-success" : "bg-warning"}`}>
                      {myEnrollment.feesPaid ? "Yes" : "No"}
                    </span>
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Certified:</strong>{" "}
                    <span className={`badge ${myEnrollment.isCertified ? "bg-success" : "bg-secondary"}`}>
                      {myEnrollment.isCertified ? "Yes" : "No"}
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
                    <span className={`badge ${(myEnrollment.pendingAmount || 0) > 0 ? "bg-danger" : "bg-success"}`}>
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
          {loading ? "Verifying..." : "Verify"}
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
