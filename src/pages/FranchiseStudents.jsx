// src/pages/FranchiseStudents.jsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";
import Sidebar from "./FranchiseDashboard";

function fmtDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toISOString().slice(0, 10);
}

export default function FranchiseStudents() {
  const [students, setStudents] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [franchise, setFranchise] = useState(null);
  const [viewing, setViewing] = useState(null);

  const navigate = useNavigate();

  // Fetch franchise info
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

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/franchise/students");
      const data = res.data;
      const arr = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
        ? data.data
        : [];
      setStudents(arr);
    } catch (err) {
      console.error("fetchStudents:", err);
      setError(err.userMessage || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
    // Fetch courses for dropdown
    const fetchCourses = async () => {
      try {
        const res = await API.get("/courses");
        const data = res.data;
        setCourses(Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error("fetchCourses error:", err);
      }
    };
    fetchCourses();
  }, [fetchStudents]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await API.delete(`/franchise/students/${id}`);
      setStudents((prev) => prev.filter((s) => (s._id || s.id) !== id));
    } catch (err) {
      console.error("delete student:", err);
      setError(err.userMessage || "Failed to delete student");
    }
  };

  // Filter students based on search
  const filteredStudents = students.filter((student) => {
    const searchLower = search.toLowerCase();
    return (
      (student.name?.toLowerCase() || "").includes(searchLower) ||
      (student.rollNumber?.toLowerCase() || "").includes(searchLower) ||
      (student.enrollmentNo?.toLowerCase() || "").includes(searchLower) ||
      (student.mobile?.toLowerCase() || "").includes(searchLower) ||
      (student.email?.toLowerCase() || "").includes(searchLower)
    );
  });

  return (
    <div className="d-flex">
      <Sidebar franchise={franchise} />
      <div className="flex-grow-1 p-4" style={{ marginLeft: "260px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h2 className="fw-bold mb-0">Students</h2>
            <small className="text-muted">
              Manage your franchise students
            </small>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/franchise/students/add")}
          >
            + Add Student
          </button>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, roll number, mobile, email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="card">
          <div className="card-body">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" role="status" />
                <p className="mt-2">Loading students...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">No students found.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/franchise/students/add")}
                >
                  Add Your First Student
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Roll No.</th>
                      <th>Name</th>
                      <th>Mobile</th>
                      <th>Email</th>
                      <th>Course</th>
                      <th>Fees Status</th>
                      <th>Join Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student._id || student.id}>
                        <td>{student.rollNumber || "—"}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            {student.photo && (
                              <img
                                src={student.photo}
                                alt=""
                                className="rounded-circle me-2"
                                style={{ width: "32px", height: "32px", objectFit: "cover" }}
                              />
                            )}
                            <div>
                              <div className="fw-semibold">{student.name}</div>
                              {student.fatherName && (
                                <small className="text-muted">
                                  S/o {student.fatherName}
                                </small>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>{student.mobile}</td>
                        <td>{student.email || "—"}</td>
                        <td>
                          {student.courses && student.courses.length > 0
                            ? student.courses[0].courseName
                            : student.courseName || "—"}
                        </td>
                        <td>
                          {student.courses && student.courses.some(c => c.feesPaid) ? (
                            <span className="badge bg-success">Paid</span>
                          ) : student.feesPaid ? (
                            <span className="badge bg-success">Paid</span>
                          ) : (
                            <span className="badge bg-warning">Pending</span>
                          )}
                        </td>
                        <td>{fmtDate(student.joinDate || student.createdAt)}</td>
                        <td>
                          <div className="btn-group">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => setViewing(student)}
                            >
                              View
                            </button>
                            <button
                              className="btn btn-sm btn-outline-warning"
                              onClick={() => {
                                // Navigate to edit page or open edit modal
                                navigate(`/franchise/students/edit/${student._id || student.id}`);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(student._id || student.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* View Details Modal */}
        {viewing && (
          <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Student Details - {viewing.name || "Unknown"}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setViewing(null)}></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    {/* Personal Information */}
                    <div className="col-md-6 mb-3">
                      <h6 className="border-bottom pb-2 mb-3">Personal Information</h6>
                      <p className="mb-1"><strong>Name:</strong> {viewing.name || "-"}</p>
                      <p className="mb-1"><strong>Father's Name:</strong> {viewing.fatherName || "-"}</p>
                      <p className="mb-1"><strong>Mother's Name:</strong> {viewing.motherName || "-"}</p>
                      <p className="mb-1"><strong>Gender:</strong> {viewing.gender || "-"}</p>
                      <p className="mb-1"><strong>Date of Birth:</strong> {viewing.dob ? new Date(viewing.dob).toLocaleDateString('en-IN') : "-"}</p>
                    </div>
                    
                    {/* Contact Information */}
                    <div className="col-md-6 mb-3">
                      <h6 className="border-bottom pb-2 mb-3">Contact Information</h6>
                      <p className="mb-1"><strong>Email:</strong> {viewing.email || "-"}</p>
                      <p className="mb-1"><strong>Mobile:</strong> {viewing.mobile || "-"}</p>
                      <p className="mb-1"><strong>State:</strong> {viewing.state || "-"}</p>
                      <p className="mb-1"><strong>District:</strong> {viewing.district || "-"}</p>
                      <p className="mb-1"><strong>Address:</strong> {viewing.address || "-"}</p>
                    </div>

                    {/* Academic Information */}
                    <div className="col-md-6 mb-3">
                      <h6 className="border-bottom pb-2 mb-3">Academic Information</h6>
                      <p className="mb-1"><strong>Roll Number:</strong> {viewing.rollNumber || "-"}</p>
                      <p className="mb-1"><strong>Enrollment No:</strong> {viewing.enrollmentNo || viewing.enrollment || "-"}</p>
                      <p className="mb-1"><strong>Course:</strong> {viewing.courseName || (viewing.courses && viewing.courses[0]?.courseName) || "-"}</p>
                      <p className="mb-1"><strong>Exam Passed:</strong> {viewing.examPassed || "-"}</p>
                      <p className="mb-1"><strong>Board:</strong> {viewing.board || "-"}</p>
                      <p className="mb-1"><strong>Marks/Grade:</strong> {viewing.marksOrGrade || "-"}</p>
                    </div>

                    {/* Fee Details */}
                    <div className="col-md-6 mb-3">
                      <h6 className="border-bottom pb-2 mb-3">Fee Details</h6>
                      {(() => {
                        const feeDetails = viewing.courses && Array.isArray(viewing.courses) && viewing.courses.length > 0
                          ? {
                              fee: viewing.courses.reduce((sum, c) => sum + (Number(c.feeAmount) || 0), 0),
                              paid: viewing.courses.reduce((sum, c) => sum + (Number(c.amountPaid) || 0), 0),
                            }
                          : { fee: Number(viewing.feeAmount) || 0, paid: Number(viewing.amountPaid) || 0 };
                        const pending = feeDetails.fee - feeDetails.paid;
                        return (
                          <>
                            <p className="mb-1"><strong>Total Fee:</strong> ₹{feeDetails.fee}</p>
                            <p className="mb-1"><strong>Amount Paid:</strong> ₹{feeDetails.paid}</p>
                            <p className="mb-1">
                              <strong>Pending:</strong>{" "}
                              <span className={pending > 0 ? "text-danger" : "text-success"}>
                                ₹{pending}
                              </span>
                            </p>
                            <p className="mb-1"><strong>Fees Paid:</strong> {viewing.feesPaid ? "Yes" : "No"}</p>
                          </>
                        );
                      })()}
                    </div>

                    {/* Additional Info */}
                    <div className="col-12 mb-3">
                      <h6 className="border-bottom pb-2 mb-3">Additional Information</h6>
                      <p className="mb-1"><strong>Session:</strong> {viewing.sessionStart && viewing.sessionEnd ? `${new Date(viewing.sessionStart).toLocaleDateString('en-IN')} - ${new Date(viewing.sessionEnd).toLocaleDateString('en-IN')}` : "-"}</p>
                      <p className="mb-1"><strong>Join Date:</strong> {viewing.joinDate || viewing.createdAt ? new Date(viewing.joinDate || viewing.createdAt).toLocaleDateString('en-IN') : "-"}</p>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setViewing(null)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
