// src/pages/FranchiseViewCertificate.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";
import { FranchiseLayout } from "./FranchiseStudents";

export default function FranchiseViewCertificate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await API.get(`/franchise/certificates/${id}`);
        setCertificate(res.data);
      } catch (err) {
        console.error("fetchCertificate:", err);
        setError(err.userMessage || "Failed to fetch certificate details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCertificate();
    }
  }, [id]);

  if (loading) {
    return (
      <FranchiseLayout>
        <div className="text-center py-5">
          <div className="spinner-border" role="status" />
          <p className="mt-2">Loading certificate details...</p>
        </div>
      </FranchiseLayout>
    );
  }

  if (error || !certificate) {
    return (
      <FranchiseLayout>
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error || "Certificate not found"}
          <button type="button" className="btn-close" onClick={() => navigate("/franchise/certificates")} aria-label="Close"></button>
        </div>
        <div className="text-center py-5">
          <button className="btn btn-primary" onClick={() => navigate("/franchise/certificates")}>
            Back to Certificates
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
          <h2 className="fw-bold mb-0">Certificate Details</h2>
          <small className="text-muted">View certificate information</small>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/franchise/certificates/create?id=${id}`)}
          >
            Edit Certificate
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/franchise/certificates")}
          >
            Back to Certificates
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

      {/* Certificate Details Card */}
      <div className="card">
        <div className="card-body">
          <div className="row">
            {/* Student Info */}
            <div className="col-md-6 mb-3">
              <h6 className="border-bottom pb-2 mb-3">Student Information</h6>
              <p className="mb-1"><strong>Name:</strong> {certificate.student?.name || "N/A"}</p>
              <p className="mb-1"><strong>Roll Number:</strong> {certificate.rollNumber || "N/A"}</p>
              <p className="mb-1"><strong>Father's Name:</strong> {certificate.fatherName || "N/A"}</p>
              <p className="mb-1"><strong>Course:</strong> {certificate.courseName || "N/A"}</p>
            </div>

            {/* Certificate Info */}
            <div className="col-md-6 mb-3">
              <h6 className="border-bottom pb-2 mb-3">Certificate Information</h6>
              <p className="mb-1"><strong>Certificate Type:</strong> {certificate.certificateType || "N/A"}</p>
              <p className="mb-1"><strong>Issue Date:</strong> {certificate.issueDate ? new Date(certificate.issueDate).toLocaleDateString("en-IN") : "N/A"}</p>
              <p className="mb-1"><strong>Certificate Number:</strong> {certificate.certificateNumber || "N/A"}</p>
              <p className="mb-1"><strong>Status:</strong> 
                <span className={`badge ms-2 ${certificate.status === "active" ? "bg-success" : "bg-secondary"}`}>
                  {certificate.status || "N/A"}
                </span>
              </p>
            </div>

            {/* Additional Details */}
            <div className="col-12 mb-3">
              <h6 className="border-bottom pb-2 mb-3">Additional Details</h6>
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-1"><strong>Grade:</strong> {certificate.grade || "N/A"}</p>
                  <p className="mb-1"><strong>Percentage:</strong> {certificate.percentage ? `${certificate.percentage}%` : "N/A"}</p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1"><strong>Session:</strong> {certificate.session || "N/A"}</p>
                  <p className="mb-1"><strong>Remarks:</strong> {certificate.remarks || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Certificate Preview */}
            {certificate.certificateUrl && (
              <div className="col-12">
                <h6 className="border-bottom pb-2 mb-3">Certificate Preview</h6>
                <div className="text-center">
                  <img
                    src={certificate.certificateUrl}
                    alt="Certificate"
                    className="img-fluid border rounded"
                    style={{ maxHeight: "400px" }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </FranchiseLayout>
  );
}