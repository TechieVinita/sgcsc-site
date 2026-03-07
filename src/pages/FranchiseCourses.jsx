// src/pages/FranchiseCourses.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";
import Sidebar from "./FranchiseDashboard";

export default function FranchiseCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [franchise, setFranchise] = useState(null);
  const navigate = useNavigate();

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

  // Load courses
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await API.get("/franchise/courses");
        setCourses(res.data || []);
      } catch (err) {
        console.error("Failed to load courses:", err);
        setError(err?.response?.data?.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const handleEdit = (course) => {
    navigate(`/franchise/courses/create?id=${course._id}`);
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await API.delete(`/franchise/courses/${courseId}`);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err?.response?.data?.message || "Failed to delete course");
    }
  };

  const groupedCourses = courses.reduce((acc, course) => {
    const type = course.type || "other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(course);
    return acc;
  }, {});

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case "certificate":
        return "bg-success";
      case "long":
        return "bg-primary";
      case "short":
        return "bg-warning text-dark";
      default:
        return "bg-secondary";
    }
  };

  // Check if course was created by this franchise
  const isOwnCourse = (course) => {
    return course.createdBy && franchise && course.createdBy === franchise._id;
  };

  if (loading) {
    return (
      <div className="d-flex">
        <Sidebar franchise={franchise} />
        <div className="flex-grow-1 p-4" style={{ marginLeft: "260px" }}>
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-primary me-2" />
            Loading courses…
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar franchise={franchise} />
      <div className="flex-grow-1 p-4" style={{ marginLeft: "260px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h2 className="fw-bold mb-1">Courses</h2>
            <small className="text-muted">
              View courses created by you and admin-created courses available for your franchise.
            </small>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/franchise/courses/create")}
          >
            + Add Course
          </button>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {Object.entries(groupedCourses).map(([type, list]) => (
          <div key={type} className="mb-5">
            <h4 className="fw-bold mb-3 text-capitalize">
              {type.replace("-", " ")} Courses
            </h4>

            <div className="row g-4">
              {list.map((course) => (
                <div key={course._id} className="col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="fw-bold mb-0">
                          {course.title}
                        </h5>
                        {isOwnCourse(course) && (
                          <span className="badge bg-info text-dark">Your Course</span>
                        )}
                      </div>

                      <div className="mb-2">
                        <span
                          className={`badge me-2 ${getTypeBadgeClass(course.type)}`}
                        >
                          {course.type}
                        </span>

                        {course.duration && (
                          <span className="badge bg-info text-dark me-2">
                            {course.duration}
                          </span>
                        )}

                        {course.feeAmount > 0 && (
                          <span className="badge bg-success">
                            ₹{course.feeAmount}
                          </span>
                        )}
                      </div>

                      <p className="text-muted small flex-grow-1">
                        {course.description || "No description provided."}
                      </p>

                      {isOwnCourse(course) ? (
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(course)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(course._id)}
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <div className="d-flex justify-content-end">
                          <span className="text-muted small">
                            Admin Course - View Only
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {courses.length === 0 && !error && (
          <div className="text-center py-5 text-muted">
            <p>No courses available yet.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/franchise/courses/create")}
            >
              Create Your First Course
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
