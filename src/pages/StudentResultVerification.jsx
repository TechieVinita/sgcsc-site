// src/pages/StudentResultVerification.jsx
import { useState, useEffect } from "react";
import API from "../api/axiosInstance";
import { jsPDF } from "jspdf";

export default function StudentResultVerification() {
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [dob, setDob] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if student is logged in
  const studentToken = localStorage.getItem("student_token");
  const isLoggedIn = !!studentToken;
  const [myResults, setMyResults] = useState([]);
  const [loadingMyResult, setLoadingMyResult] = useState(false);

  // Fetch logged-in student's results
  useEffect(() => {
    if (isLoggedIn) {
      fetchMyResults();
    }
  }, [isLoggedIn]);

  const fetchMyResults = async () => {
    setLoadingMyResult(true);
    try {
      const res = await API.get("/student-profile/result");
      if (res.data.success) {
        // Handle both single result and array of results
        const data = res.data.data;
        setMyResults(Array.isArray(data) ? data : [data]);
      }
    } catch (err) {
      console.error("Failed to fetch results:", err);
    } finally {
      setLoadingMyResult(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await API.post("/public/result", { enrollmentNumber, dob });
      // Handle both single result and array of results
      const data = res.data.data;
      setResult(Array.isArray(data) ? data : [data]);
    } catch {
      setError("Result not found. Please check your enrollment number and date of birth.");
    } finally {
      setLoading(false);
    }
  };

  // Generate PDF for result
  const generateResultPDF = (res) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = 20;

    // Header
    doc.setFillColor(0, 102, 204);
    doc.rect(0, 0, pageWidth, 35, "F");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text("RESULT CERTIFICATE", pageWidth / 2, y, { align: "center" });
    y = 45;

    // Student Info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Student Information", margin, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Enrollment Number: ${res.enrollmentNumber || res.rollNumber || "-"}`, margin, y);
    y += 6;
    doc.text(`Roll Number: ${res.rollNumber || "-"}`, margin, y);
    y += 6;
    doc.text(`Course: ${res.courseName || "-"}`, margin, y);
    y += 6;
    doc.text(`Exam Session: ${res.examSession || "-"}`, margin, y);
    y += 6;
    doc.text(`Exam Date: ${res.examDate ? new Date(res.examDate).toLocaleDateString() : "-"}`, margin, y);
    y += 12;

    // Subject Marks Table
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Subject Marks", margin, y);
    y += 8;

    // Table header
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, y, pageWidth - 2 * margin, 8, "F");
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text("Subject", margin + 2, y + 5);
    doc.text("Max", margin + 70, y + 5);
    doc.text("Min", margin + 85, y + 5);
    doc.text("Obtained", margin + 100, y + 5);
    doc.text("Grade", margin + 125, y + 5);
    doc.text("Status", margin + 145, y + 5);
    y += 8;

    // Table rows
    doc.setFont("helvetica", "normal");
    if (res.subjects && res.subjects.length > 0) {
      res.subjects.forEach((sub) => {
        doc.text(sub.subjectName || "Subject", margin + 2, y + 5);
        doc.text(String(sub.maxMarks || 0), margin + 70, y + 5);
        doc.text(String(sub.minMarks || 0), margin + 85, y + 5);
        doc.text(String(sub.marksObtained || 0), margin + 100, y + 5);
        doc.text(sub.grade || "-", margin + 125, y + 5);
        doc.text(sub.status || "-", margin + 145, y + 5);
        y += 7;
      });
    }

    y += 8;

    // Overall Result
    doc.setFillColor(0, 102, 204);
    doc.rect(margin, y, pageWidth - 2 * margin, 45, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("OVERALL RESULT", pageWidth / 2, y + 8, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Marks: ${res.totalMarks || 0}`, margin + 10, y + 20);
    doc.text(`Obtained Marks: ${res.totalObtained || 0}`, margin + 80, y + 20);
    doc.text(`Percentage: ${res.percentage?.toFixed(2) || 0}%`, margin + 10, y + 30);
    doc.text(`Grade: ${res.overallGrade || "-"}`, margin + 80, y + 30);
    doc.text(`Status: ${res.resultStatus?.toUpperCase() || "-"}`, margin + 10, y + 40);

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 20;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("This is a computer-generated document. Verification can be done on the website.", pageWidth / 2, footerY, { align: "center" });

    return doc;
  };

  // Download result as PDF
  const downloadResult = (res) => {
    const doc = generateResultPDF(res);
    doc.save(`result_${res.enrollmentNumber || res.rollNumber || "student"}_${res.examSession || "result"}.pdf`);
  };

  // Download all results as PDF (for public verification)
  const downloadAllPublicResults = (results) => {
    if (!results || results.length === 0) return;

    const doc = new jsPDF();

    results.forEach((res, index) => {
      if (index > 0) {
        doc.addPage();
      }

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let y = 20;

      // Header
      doc.setFillColor(0, 102, 204);
      doc.rect(0, 0, pageWidth, 35, "F");
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text("RESULT CERTIFICATE", pageWidth / 2, y, { align: "center" });
      y = 45;

      // Page number
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(`Result ${index + 1} of ${results.length}`, pageWidth - margin, 30, { align: "right" });

      // Student Info
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text("Student Information", margin, y);
      y += 8;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Enrollment Number: ${res.enrollmentNumber || res.rollNumber || "-"}`, margin, y);
      y += 6;
      doc.text(`Roll Number: ${res.rollNumber || "-"}`, margin, y);
      y += 6;
      doc.text(`Course: ${res.courseName || "-"}`, margin, y);
      y += 6;
      doc.text(`Exam Session: ${res.examSession || "-"}`, margin, y);
      y += 6;
      doc.text(`Exam Date: ${res.examDate ? new Date(res.examDate).toLocaleDateString() : "-"}`, margin, y);
      y += 12;

      // Subject Marks Table
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Subject Marks", margin, y);
      y += 8;

      // Table header
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, y, pageWidth - 2 * margin, 8, "F");
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.text("Subject", margin + 2, y + 5);
      doc.text("Max", margin + 70, y + 5);
      doc.text("Min", margin + 85, y + 5);
      doc.text("Obtained", margin + 100, y + 5);
      doc.text("Grade", margin + 125, y + 5);
      doc.text("Status", margin + 145, y + 5);
      y += 8;

      // Table rows
      doc.setFont("helvetica", "normal");
      if (res.subjects && res.subjects.length > 0) {
        res.subjects.forEach((sub) => {
          doc.text(sub.subjectName || "Subject", margin + 2, y + 5);
          doc.text(String(sub.maxMarks || 0), margin + 70, y + 5);
          doc.text(String(sub.minMarks || 0), margin + 85, y + 5);
          doc.text(String(sub.marksObtained || 0), margin + 100, y + 5);
          doc.text(sub.grade || "-", margin + 125, y + 5);
          doc.text(sub.status || "-", margin + 145, y + 5);
          y += 7;
        });
      }

      y += 8;

      // Overall Result
      doc.setFillColor(0, 102, 204);
      doc.rect(margin, y, pageWidth - 2 * margin, 45, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("OVERALL RESULT", pageWidth / 2, y + 8, { align: "center" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Total Marks: ${res.totalMarks || 0}`, margin + 10, y + 20);
      doc.text(`Obtained Marks: ${res.totalObtained || 0}`, margin + 80, y + 20);
      doc.text(`Percentage: ${res.percentage?.toFixed(2) || 0}%`, margin + 10, y + 30);
      doc.text(`Grade: ${res.overallGrade || "-"}`, margin + 80, y + 30);
      doc.text(`Status: ${res.resultStatus?.toUpperCase() || "-"}`, margin + 10, y + 40);
    });

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 20;
    const finalPageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("This is a computer-generated document. All results are included above.", finalPageWidth / 2, footerY, { align: "center" });

    doc.save(`all_results_${results[0]?.enrollmentNumber || results[0]?.rollNumber || "student"}.pdf`);
  };

  // Download all results (for logged in users)
  const downloadAllResults = () => {
    if (!myResults || myResults.length === 0) return;

    const doc = new jsPDF();

    myResults.forEach((result, index) => {
      if (index > 0) {
        doc.addPage();
      }

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let y = 20;

      // Header
      doc.setFillColor(0, 102, 204);
      doc.rect(0, 0, pageWidth, 35, "F");
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text("RESULT CERTIFICATE", pageWidth / 2, y, { align: "center" });
      y = 45;

      // Page number
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${index + 1} of ${myResults.length}`, pageWidth - margin, 30, { align: "right" });

      // Student Info
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text("Student Information", margin, y);
      y += 8;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Enrollment Number: ${result.enrollmentNumber || result.rollNumber || "-"}`, margin, y);
      y += 6;
      doc.text(`Roll Number: ${result.rollNumber || "-"}`, margin, y);
      y += 6;
      doc.text(`Course: ${result.courseName || "-"}`, margin, y);
      y += 6;
      doc.text(`Exam Session: ${result.examSession || "-"}`, margin, y);
      y += 6;
      doc.text(`Exam Date: ${result.examDate ? new Date(result.examDate).toLocaleDateString() : "-"}`, margin, y);
      y += 12;

      // Subject Marks Table
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Subject Marks", margin, y);
      y += 8;

      // Table header
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, y, pageWidth - 2 * margin, 8, "F");
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.text("Subject", margin + 2, y + 5);
      doc.text("Max", margin + 70, y + 5);
      doc.text("Min", margin + 85, y + 5);
      doc.text("Obtained", margin + 100, y + 5);
      doc.text("Grade", margin + 125, y + 5);
      doc.text("Status", margin + 145, y + 5);
      y += 8;

      // Table rows
      doc.setFont("helvetica", "normal");
      if (result.subjects && result.subjects.length > 0) {
        result.subjects.forEach((sub) => {
          doc.text(sub.subjectName || "Subject", margin + 2, y + 5);
          doc.text(String(sub.maxMarks || 0), margin + 70, y + 5);
          doc.text(String(sub.minMarks || 0), margin + 85, y + 5);
          doc.text(String(sub.marksObtained || 0), margin + 100, y + 5);
          doc.text(sub.grade || "-", margin + 125, y + 5);
          doc.text(sub.status || "-", margin + 145, y + 5);
          y += 7;
        });
      }

      y += 8;

      // Overall Result
      doc.setFillColor(0, 102, 204);
      doc.rect(margin, y, pageWidth - 2 * margin, 45, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("OVERALL RESULT", pageWidth / 2, y + 8, { align: "center" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Total Marks: ${result.totalMarks || 0}`, margin + 10, y + 20);
      doc.text(`Obtained Marks: ${result.totalObtained || 0}`, margin + 80, y + 20);
      doc.text(`Percentage: ${result.percentage?.toFixed(2) || 0}%`, margin + 10, y + 30);
      doc.text(`Grade: ${result.overallGrade || "-"}`, margin + 80, y + 30);
      doc.text(`Status: ${result.resultStatus?.toUpperCase() || "-"}`, margin + 10, y + 40);
    });

    // Footer on last page
    const footerY = doc.internal.pageSize.getHeight() - 20;
    const finalPageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("This is a computer-generated document. All results are included above.", finalPageWidth / 2, footerY, { align: "center" });

    doc.save(`all_results_${myResults[0]?.enrollmentNumber || myResults[0]?.rollNumber || "student"}.pdf`);
  };

  // If logged in, show student's own results
  if (isLoggedIn) {
    return (
      <div className="container py-5">
        <h2 className="text-center mb-4">My Results</h2>

        {loadingMyResult ? (
          <div className="text-center">
            <p>Loading your results...</p>
          </div>
        ) : myResults.length > 0 ? (
          <div>
            {myResults.map((res, index) => (
              <div key={index} className="card shadow-sm mb-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Result #{index + 1}: {res.courseName || "Course"}</h5>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => downloadResult(res)}
                    >
                      <i className="bi bi-download me-1"></i> Download
                    </button>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p><strong>Enrollment Number:</strong> {res.enrollmentNumber || res.rollNumber}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Roll Number:</strong> {res.rollNumber || "-"}</p>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p><strong>Exam Session:</strong> {res.examSession || "-"}</p>
                    </div>
                  </div>

                  <h6 className="border-bottom pb-2 mb-3">Subject Marks</h6>
                  <div className="table-responsive">
                    <table className="table table-bordered table-sm">
                      <thead className="table-light">
                        <tr>
                          <th>Subject</th>
                          <th>Max Marks</th>
                          <th>Min Marks</th>
                          <th>Marks Obtained</th>
                          <th>Practical</th>
                          <th>Grade</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {res.subjects?.map((sub, idx) => (
                          <tr key={idx}>
                            <td>{sub.subjectName || "Subject " + (idx + 1)}</td>
                            <td>{sub.maxMarks || 0}</td>
                            <td>{sub.minMarks || 0}</td>
                            <td>{sub.marksObtained || 0}</td>
                            <td>{sub.practicalMarks || 0}/{sub.maxPracticalMarks || 0}</td>
                            <td>{sub.grade || "-"}</td>
                            <td>
                              <span className={`badge ${sub.status === "pass" ? "bg-success" : sub.status === "fail" ? "bg-danger" : "bg-warning"}`}>
                                {sub.status || "-"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <h6 className="border-bottom pb-2 mb-3">Overall Result</h6>
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <p><strong>Total Marks:</strong> {res.totalMarks || 0}</p>
                    </div>
                    <div className="col-md-4">
                      <p><strong>Obtained Marks:</strong> {res.totalObtained || 0}</p>
                    </div>
                    <div className="col-md-4">
                      <p><strong>Percentage:</strong> {res.percentage?.toFixed(2) || 0}%</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <p><strong>Overall Grade:</strong> {res.overallGrade || "-"}</p>
                    </div>
                    <div className="col-md-4">
                      <p>
                        <strong>Result Status:</strong>{" "}
                        <span className={`badge ${res.resultStatus === "pass" ? "bg-success" : res.resultStatus === "fail" ? "bg-danger" : "bg-warning"}`}>
                          {res.resultStatus || "-"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {myResults.length > 1 && (
              <div className="text-center mt-4">
                <button className="btn btn-primary" onClick={() => downloadAllResults()}>
                  <i className="bi bi-download me-2"></i>
                  Download All Results
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="alert alert-warning">
            No results found. Please contact your center.
          </div>
        )}
      </div>
    );
  }

  // Public verification form for non-logged-in users
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Result Verification</h2>
      <p className="text-center text-muted mb-4">
        Enter your enrollment number and date of birth to verify and download your result
      </p>

      <form onSubmit={handleSubmit} className="card p-4 mx-auto" style={{ maxWidth: 500 }}>
        <div className="mb-3">
          <label className="form-label">Enrollment Number</label>
          <input 
            className="form-control" 
            placeholder="Enter your enrollment number"
            value={enrollmentNumber} 
            onChange={(e) => setEnrollmentNumber(e.target.value)} 
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Date of Birth</label>
          <input 
            type="date" 
            className="form-control"
            value={dob} 
            onChange={(e) => setDob(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Verifying..." : "Verify & Download"}
        </button>
      </form>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {result && (
        <div>
          {result.map((res, index) => (
            <div key={index} className="card mt-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Result #{index + 1}: {res.courseName || "Course"}</h5>
                <button
                  className="btn btn-primary"
                  onClick={() => downloadResult(res)}
                >
                  <i className="bi bi-download me-1"></i> Download PDF
                </button>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p><strong>Enrollment Number:</strong> {res.enrollmentNumber || res.rollNumber}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Roll Number:</strong> {res.rollNumber || "-"}</p>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p><strong>Course:</strong> {res.courseName || "-"}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Exam Session:</strong> {res.examSession || "-"}</p>
                  </div>
                </div>

                <h6 className="border-bottom pb-2 mb-3">Subject Marks</h6>
                <div className="table-responsive">
                  <table className="table table-bordered table-sm">
                    <thead className="table-light">
                      <tr>
                        <th>Subject</th>
                        <th>Max</th>
                        <th>Min</th>
                        <th>Obtained</th>
                        <th>Grade</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {res.subjects?.map((sub, idx) => (
                        <tr key={idx}>
                          <td>{sub.subjectName || "Subject " + (idx + 1)}</td>
                          <td>{sub.maxMarks || 0}</td>
                          <td>{sub.minMarks || 0}</td>
                          <td>{sub.marksObtained || 0}</td>
                          <td>{sub.grade || "-"}</td>
                          <td>
                            <span className={`badge ${sub.status === "pass" ? "bg-success" : sub.status === "fail" ? "bg-danger" : "bg-warning"}`}>
                              {sub.status || "-"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h6 className="border-bottom pb-2 mb-3 mt-4">Overall Result</h6>
                <div className="row">
                  <div className="col-md-3">
                    <p><strong>Total:</strong> {res.totalMarks || 0}</p>
                  </div>
                  <div className="col-md-3">
                    <p><strong>Obtained:</strong> {res.totalObtained || 0}</p>
                  </div>
                  <div className="col-md-3">
                    <p><strong>Percentage:</strong> {res.percentage?.toFixed(2) || 0}%</p>
                  </div>
                  <div className="col-md-3">
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className={`badge ${res.resultStatus === "pass" ? "bg-success" : res.resultStatus === "fail" ? "bg-danger" : "bg-warning"}`}>
                        {res.resultStatus || "-"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Download All Button */}
          {result.length > 1 && (
            <div className="text-center mt-4">
              <button className="btn btn-success" onClick={() => downloadAllPublicResults(result)}>
                <i className="bi bi-download me-2"></i>
                Download All Results
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
