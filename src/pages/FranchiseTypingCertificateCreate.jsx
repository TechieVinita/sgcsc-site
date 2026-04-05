// src/pages/FranchiseTypingCertificateCreate.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";
import Sidebar from "./FranchiseDashboard";

// Typing Certificate Generator Global Reference
let typingCertificateGenerator = null;

// Initialize Typing Certificate Generator function
const initTypingCertificateGenerator = async () => {
  if (typingCertificateGenerator) return typingCertificateGenerator;

  // Ensure canvas is available before loading template
  const canvasElement = document.getElementById('typingCertCanvas');
  if (!canvasElement) {
    console.warn('Canvas element not found in DOM yet. Waiting...');
    // Wait for canvas to be available
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Check if already available on window
  if (window.TypingCertificateGenerator) {
    typingCertificateGenerator = window.TypingCertificateGenerator;
    try {
      await typingCertificateGenerator.loadTemplate('/typing-certificate-template.jpeg');
      console.log('Typing certificate template loaded successfully');
      return typingCertificateGenerator;
    } catch (err) {
      console.error('CRITICAL ERROR: Typing certificate template not found:', err.message);
      console.error('Please upload typing-certificate-template.jpeg to the public folder');
      throw new Error(`Template required: ${err.message}`);
    }
  }

  // Script not loaded yet, dynamically load it
  return new Promise((resolve, reject) => {
    // Load jspdf if not present
    if (!window.jspdf) {
      const jspdfScript = document.createElement('script');
      jspdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      jspdfScript.onload = () => {
        // Load typing-certificate-generator
        const certScript = document.createElement('script');
        certScript.src = '/typing-certificate-generator.js';
        certScript.onload = async () => {
          if (window.TypingCertificateGenerator) {
            typingCertificateGenerator = window.TypingCertificateGenerator;
            try {
              await typingCertificateGenerator.loadTemplate('/typing-certificate-template.jpeg');
              console.log('Typing certificate template loaded successfully');
              resolve(typingCertificateGenerator);
            } catch (err) {
              console.error('CRITICAL ERROR: Typing certificate template not found:', err.message);
              reject(new Error(`Template required: ${err.message}`));
            }
          } else {
            reject(new Error('Typing certificate generator script failed to load'));
          }
        };
        certScript.onerror = () => reject(new Error('Failed to load typing certificate generator script'));
        document.body.appendChild(certScript);
      };
      jspdfScript.onerror = () => reject(new Error('Failed to load jspdf script'));
      document.body.appendChild(jspdfScript);
    } else if (!window.TypingCertificateGenerator) {
      // jspdf loaded but typing-certificate-generator not loaded
      const certScript = document.createElement('script');
      certScript.src = '/typing-certificate-generator.js';
      certScript.onload = async () => {
        if (window.TypingCertificateGenerator) {
          typingCertificateGenerator = window.TypingCertificateGenerator;
          try {
            await typingCertificateGenerator.loadTemplate('/typing-certificate-template.jpeg');
            console.log('Typing certificate template loaded successfully');
            resolve(typingCertificateGenerator);
          } catch (err) {
            console.error('CRITICAL ERROR: Typing certificate template not found:', err.message);
            reject(new Error(`Template required: ${err.message}`));
          }
        } else {
          reject(new Error('Typing certificate generator script failed to load'));
        }
      };
      certScript.onerror = () => reject(new Error('Failed to load typing certificate generator script'));
      document.body.appendChild(certScript);
    }
  });
};

export default function FranchiseTypingCertificateCreate() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [franchise, setFranchise] = useState(null);

  const [formData, setFormData] = useState({
    studentName: "",
    fatherHusbandName: "",
    motherName: "",
    enrollmentNumber: "",
    computerTyping: "",
    certificateNo: "",
    dateOfIssue: "",
  });

  // Get franchise info
  useEffect(() => {
    const fetchFranchise = async () => {
      try {
        const res = await API.get("/franchise-profile/me");
        setFranchise(res.data?.data || null);
      } catch (err) {
        console.error("fetchFranchise error:", err);
      }
    };
    fetchFranchise();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.studentName.trim()) {
      setError("Student Name is required");
      return false;
    }
    if (!formData.fatherHusbandName.trim()) {
      setError("Father/Husband Name is required");
      return false;
    }
    if (!formData.motherName.trim()) {
      setError("Mother Name is required");
      return false;
    }
    if (!formData.enrollmentNumber.trim()) {
      setError("Enrollment Number is required");
      return false;
    }
    if (!formData.computerTyping.trim()) {
      setError("Computer Typing is required");
      return false;
    }
    if (!formData.certificateNo.trim()) {
      setError("Certificate Number is required");
      return false;
    }
    if (!formData.dateOfIssue) {
      setError("Date of Issue is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setSaving(true);

    try {
      // Generate certificate image data URL for storing
      let certificateImage = null;
      try {
        await initTypingCertificateGenerator();
      } catch (genErr) {
        setError(`Certificate generation failed: ${genErr.message}`);
        return;
      }

      if (typingCertificateGenerator) {
        try {
          const certificateData = {
            studentName: formData.studentName.trim(),
            fatherHusbandName: formData.fatherHusbandName.trim(),
            motherName: formData.motherName.trim(),
            enrollmentNumber: formData.enrollmentNumber.trim(),
            computerTyping: formData.computerTyping.trim(),
            certificateNo: formData.certificateNo.trim(),
            dateOfIssue: formData.dateOfIssue,
          };
          certificateImage = await typingCertificateGenerator.getDataURL(certificateData);
        } catch (imgErr) {
          console.error('Could not generate typing certificate image:', imgErr);
          setError('Failed to generate certificate image. Please ensure the JPG template is properly configured.');
          return;
        }
      } else {
        setError('Certificate generator not available. Please refresh the page.');
        return;
      }

      const payload = {
        studentName: formData.studentName.trim(),
        fatherHusbandName: formData.fatherHusbandName.trim(),
        motherName: formData.motherName.trim(),
        enrollmentNumber: formData.enrollmentNumber.trim(),
        computerTyping: formData.computerTyping.trim(),
        certificateNo: formData.certificateNo.trim(),
        dateOfIssue: formData.dateOfIssue,
        certificateImage,
      };

      await API.post("/franchise/typing-certificates", payload);

      navigate("/franchise/typing-certificates", {
        state: { message: "Typing certificate created successfully!" },
      });
    } catch (err) {
      console.error("Create typing certificate error:", err);
      setError(err.response?.data?.message || "Failed to create certificate");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar franchise={franchise} />

      <div
        className="flex-grow-1 bg-light min-vh-100"
        style={{ marginLeft: "260px" }}
      >
        <div className="container-fluid p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">Create Typing Certificate</h2>
              <p className="text-muted mb-0">Generate certificate for computer typing training completion</p>
            </div>
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate("/franchise/typing-certificates")}
            >
              <i className="bi bi-arrow-left me-1"></i>
              Back to List
            </button>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {error}
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setError("")}
                        aria-label="Close"
                      ></button>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Student Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="studentName"
                          value={formData.studentName}
                          onChange={handleInputChange}
                          placeholder="Enter student full name"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Father/Husband Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="fatherHusbandName"
                          value={formData.fatherHusbandName}
                          onChange={handleInputChange}
                          placeholder="Enter father or husband name"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Mother Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="motherName"
                          value={formData.motherName}
                          onChange={handleInputChange}
                          placeholder="Enter mother name"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Enrollment Number <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="enrollmentNumber"
                          value={formData.enrollmentNumber}
                          onChange={handleInputChange}
                          placeholder="Enter enrollment number"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Computer Typing <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="computerTyping"
                          value={formData.computerTyping}
                          onChange={handleInputChange}
                          placeholder="e.g., English/Hindi Typing"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Certificate Number <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="certificateNo"
                          value={formData.certificateNo}
                          onChange={handleInputChange}
                          placeholder="Enter certificate number"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Date of Issue <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          name="dateOfIssue"
                          value={formData.dateOfIssue}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="col-12 mt-4">
                        <button
                          type="submit"
                          className="btn btn-primary w-100"
                          disabled={saving}
                        >
                          {saving ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Creating Certificate...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-plus-circle me-2"></i>
                              Create Typing Certificate
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="alert alert-info mt-4" role="alert">
                <i className="bi bi-info-circle-fill me-2"></i>
                <strong>Note:</strong> Make sure all JPG template files are uploaded to the server before creating certificates.
                The system requires <code>typing-certificate-template.jpeg</code> to generate certificates.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden canvas for typing certificate rendering */}
      <canvas id="typingCertCanvas" style={{ display: 'none' }}></canvas>
    </div>
  );
}