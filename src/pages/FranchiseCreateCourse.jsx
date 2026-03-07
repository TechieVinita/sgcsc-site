// src/pages/FranchiseCreateCourse.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";
import Sidebar from "./FranchiseDashboard";

export default function FranchiseCreateCourse() {
  const navigate = useNavigate();
  const location = useLocation();

  // detect edit mode
  const params = new URLSearchParams(location.search);
  const courseId = params.get("id");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [franchise, setFranchise] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [type, setType] = useState("long");
  const [feeAmount, setFeeAmount] = useState(0);

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

  /* ======================================================
     LOAD COURSE (EDIT MODE)
     ====================================================== */
  useEffect(() => {
    if (!courseId) return;

    const loadCourse = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await API.get(`/franchise/courses/${courseId}`);
        const data = res.data;

        if (!data) throw new Error("Invalid course data");

        // Check if the course belongs to this franchise
        if (data.createdBy && franchise && data.createdBy !== franchise._id) {
          setError("You can only edit courses you created.");
          return;
        }

        setTitle(data.title || "");
        setDescription(data.description || "");
        setDuration(data.duration || "");
        setType(data.type || "long");
        setFeeAmount(data.feeAmount || 0);
      } catch (err) {
        console.error("Load course error:", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load course"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId, franchise]);

  /* ======================================================
     SUBMIT (CREATE / UPDATE)
     ====================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Course name is required");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        duration: duration.trim(),
        type,
        feeAmount: Number(feeAmount) || 0,
      };

      if (courseId) {
        // EDIT - only allow editing own courses
        await API.put(`/franchise/courses/${courseId}`, payload);
      } else {
        // CREATE - will deduct credits
        await API.post("/franchise/courses", payload);
      }

      navigate("/franchise/courses");
    } catch (err) {
      console.error("Save course error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save course"
      );
    } finally {
      setSaving(false);
    }
  };

  /* ======================================================
     UI
     ====================================================== */

  if (loading) {
    return (
      <div className="d-flex">
        <Sidebar franchise={franchise} />
        <div className="flex-grow-1 p-4" style={{ marginLeft: "260px" }}>
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-primary me-2" />
            Loading course…
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar franchise={franchise} />
      <div className="flex-grow-1 p-4" style={{ marginLeft: "260px" }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h2 className="fw-bold mb-1">
              {courseId ? "Edit Course" : "Create Course"}
            </h2>
            <small className="text-muted">
              {courseId 
                ? "Update your course details." 
                : "Creating a new course will deduct credits from your account."}
            </small>
          </div>

          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/franchise/courses")}
            disabled={saving}
          >
            Back to Courses
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="card shadow-sm border-0 p-4"
          style={{ maxWidth: "800px" }}
        >
          {/* Course Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Course Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Diploma in Computer Application"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Optional description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Type + Duration */}
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Course Type</label>
              <select
                className="form-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="long">Long Term</option>
                <option value="short">Short Term</option>
                <option value="certificate">Certificate</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Duration</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 1 Year / 6 Months"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Fee Amount (₹)</label>
              <input
                type="number"
                className="form-control"
                placeholder="Course fee"
                value={feeAmount}
                onChange={(e) => setFeeAmount(e.target.value)}
                min="0"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="d-flex justify-content-end mt-4">
            <button
              type="button"
              className="btn btn-outline-secondary me-2"
              onClick={() => navigate("/franchise/courses")}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving
                ? courseId
                  ? "Saving…"
                  : "Creating…"
                : courseId
                ? "Save Changes"
                : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
