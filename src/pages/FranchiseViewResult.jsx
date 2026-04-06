// src/pages/FranchiseViewResult.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";
import { FranchiseLayout } from "./FranchiseStudents";

export default function FranchiseViewResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Calculate grade color
  const getGradeColor = (grade) => {
    if (!grade) return "secondary";
    if (grade === "A+" || grade === "A") return "success";
    if (grade === "B+" || grade === "B") return "primary";
    if (grade === "C") return "warning";
    if (grade === "D") return "secondary";
    return "danger";
  };

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await API.get(`/franchise/results/${id}`);
        setResult(res.data);
      } catch (err) {
        console.error("fetchResult:", err);
        setError(err.userMessage || "Failed to fetch result details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResult();
    }
  }, [id]);

  if (loading) {
    return (
      <FranchiseLayout>
        <div className="text-center py-5">
          <div className="spinner-border" role="status" />
          <p className="mt-2">Loading result details...</p>
        </div>
      </FranchiseLayout>
    );
  }

  if (error || !result) {
    return (
      <FranchiseLayout>
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error || "Result not found"}
          <button type="button" className="btn-close" onClick={() => navigate("/franchise/results")} aria-label="Close"></button>
        </div>
        <div className="text-center py-5">
          <button className="btn btn-primary" onClick={() => navigate("/franchise/results")}>
            Back to Results List
          </button>
        </div>
      </FranchiseLayout>
    );
  }

  return (
    <FranchiseLayout>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-0">Result Details</h2>
          <small className="text-muted">View student result information</small>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/franchise/results/create?id=${id}`)}
          >
            Edit Result
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/franchise/results")}
          >
            Back to Results
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError("")} aria-label="Close"></button>
        </div>
      )}

      {/* Result Details Card */}
      <div className="card">
        <div className="card-body">
          {/* Student Info */}
          <div className="row mb-4">
            <div className="col-md-6">
              <p className="mb-1">
                <strong>Student:</strong> {result.student?.name || "N/A"}
              </p>
              <p className="mb-1">
                <strong>Roll Number:</strong> {result.rollNumber}
              </p>
            </div>
            <div className="col-md-6">
              <p className="mb-1">
                <strong>Course:</strong>{" "}
                {result.course?.title || result.course?.name || "N/A"}
              </p>
              <p className="mb-1">
                <strong>Exam Session:</strong> {result.examSession || "N/A"}
              </p>
            </div>
          </div>

          {/* Subject Marks Table */}
          <h6 className="border-bottom pb-2 mb-3">Subject-wise Marks</h6>
          <div className="table-responsive mb-4">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Subject</th>
                  <th className="text-center">Max</th>
                  <th className="text-center">Obtained</th>
                  <th className="text-center">Practical</th>
                  <th className="text-center">Total</th>
                  <th className="text-center">Grade</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {result.subjects?.map((sub, idx) => (
                  <tr key={idx}>
                    <td>{sub.subjectName}</td>
                    <td className="text-center">{sub.maxMarks}</td>
                    <td className="text-center">{sub.marksObtained}</td>
                    <td className="text-center">{sub.practicalMarks || 0}</td>
                    <td className="text-center">
                      {(sub.marksObtained || 0) + (sub.practicalMarks || 0)}
                    </td>
                    <td className="text-center">
                      <span className={`badge bg-${getGradeColor(sub.grade)}`}>
                        {sub.grade}
                      </span>
                    </td>
                    <td className="text-center">
                      <span
                        className={`badge bg-${
                          sub.status === "pass" ? "success" : "danger"
                        }`}
                      >
                        {sub.status?.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="table-secondary">
                <tr>
                  <th>Total</th>
                  <th className="text-center">{result.totalMarks}</th>
                  <th colSpan="2"></th>
                  <th className="text-center">{result.totalObtained}</th>
                  <th className="text-center">
                    <span className={`badge bg-${getGradeColor(result.overallGrade)}`}>
                      {result.overallGrade}
                    </span>
                  </th>
                  <th className="text-center">
                    <span
                      className={`badge bg-${
                        result.resultStatus === "pass" ? "success" : "danger"
                      }`}
                    >
                      {result.resultStatus?.toUpperCase()}
                    </span>
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Summary */}
          <div className="row mt-3">
            <div className="col-md-4">
              <div className="card text-center">
                <div className="card-body py-3">
                  <h4 className="mb-0">{result.percentage}%</h4>
                  <small className="text-muted">Percentage</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center">
                <div className="card-body py-3">
                  <h4 className={`mb-0 text-${getGradeColor(result.overallGrade)}`}>
                    {result.overallGrade}
                  </h4>
                  <small className="text-muted">Grade</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center">
                <div className="card-body py-3">
                  <h4
                    className={`mb-0 ${
                      result.resultStatus === "pass"
                        ? "text-success"
                        : "text-danger"
                    }`}
                  >
                    {result.resultStatus?.toUpperCase()}
                  </h4>
                  <small className="text-muted">Result</small>
                </div>
              </div>
            </div>
          </div>

          {result.remarks && (
            <div className="mt-4">
              <h6>Remarks:</h6>
              <p className="mb-0 text-muted">{result.remarks}</p>
            </div>
          )}
        </div>
      </div>
    </FranchiseLayout>
  );
}