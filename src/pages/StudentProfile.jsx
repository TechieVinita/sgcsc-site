import { useEffect, useState } from "react";
import API from "../api/axiosInstance";

export default function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/student-profile/me");
        setStudent(res.data?.data || null);
      } catch (err) {
        console.error("Student profile fetch failed:", err);
        setError("Unable to load student profile at the moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <p>Loading student profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-warning">{error}</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container my-5 text-center">
        <p>No profile data found.</p>
      </div>
    );
  }

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "-";

  const yesNoBadge = (value) => (
    <span className={`badge ${value ? "bg-success" : "bg-secondary"}`}>
      {value ? "Yes" : "No"}
    </span>
  );

  return (
    <div className="container my-5">
      <h3 className="mb-4 text-center">Student Profile</h3>

      <div className="card shadow-sm">
        <div className="card-body">

          {/* ================= PHOTO + BASIC ================= */}
          <div className="row mb-4 align-items-center">
            <div className="col-md-3 text-center">
              <img
                src={
                  student.photo ||
                  "https://via.placeholder.com/150?text=No+Photo"
                }
                alt="Student"
                className="img-fluid rounded border"
                style={{ maxHeight: "150px" }}
              />
            </div>
            <div className="col-md-9">
              <h5 className="fw-bold mb-1">{student.name}</h5>
              <p className="mb-1 text-muted">{student.courseName || "-"}</p>
              <p className="mb-0">
                <strong>Center:</strong> {student.centerName || "-"}
              </p>
            </div>
          </div>

          {/* ================= PERSONAL DETAILS ================= */}
          <h6 className="fw-bold border-bottom pb-2 mb-3">
            Personal Details
          </h6>
          <table className="table table-bordered mb-4">
            <tbody>
              <tr>
                <th>Gender</th>
                <td>{student.gender || "-"}</td>
              </tr>
              <tr>
                <th>Date of Birth</th>
                <td>{formatDate(student.dob)}</td>
              </tr>
              <tr>
                <th>Father's Name</th>
                <td>{student.fatherName || "-"}</td>
              </tr>
              <tr>
                <th>Mother's Name</th>
                <td>{student.motherName || "-"}</td>
              </tr>
            </tbody>
          </table>

          {/* ================= CONTACT DETAILS ================= */}
          <h6 className="fw-bold border-bottom pb-2 mb-3">
            Contact Details
          </h6>
          <table className="table table-bordered mb-4">
            <tbody>
              <tr>
                <th>Email</th>
                <td>{student.email || "-"}</td>
              </tr>
              <tr>
                <th>Mobile</th>
                <td>{student.mobile || student.contact || "-"}</td>
              </tr>
              <tr>
                <th>State</th>
                <td>{student.state || "-"}</td>
              </tr>
              <tr>
                <th>District</th>
                <td>{student.district || "-"}</td>
              </tr>
              <tr>
                <th>Address</th>
                <td>{student.address || "-"}</td>
              </tr>
            </tbody>
          </table>

          {/* ================= ACADEMIC DETAILS ================= */}
          <h6 className="fw-bold border-bottom pb-2 mb-3">
            Academic Details
          </h6>
          <table className="table table-bordered mb-4">
            <tbody>
              <tr>
                <th>Exam Passed</th>
                <td>{student.examPassed || "-"}</td>
              </tr>
              <tr>
                <th>Board / University</th>
                <td>{student.board || "-"}</td>
              </tr>
              <tr>
                <th>Marks / Grade</th>
                <td>{student.marksOrGrade || "-"}</td>
              </tr>
              <tr>
                <th>Passing Year</th>
                <td>{student.passingYear || "-"}</td>
              </tr>
            </tbody>
          </table>

          {/* ================= COURSE & SESSION ================= */}
          <h6 className="fw-bold border-bottom pb-2 mb-3">
            Course & Session
          </h6>
          <table className="table table-bordered mb-4">
            <tbody>
              <tr>
                <th>Course Name</th>
                <td>{student.courseName || "-"}</td>
              </tr>
              <tr>
                <th>Semester</th>
                <td>{student.semester ?? "-"}</td>
              </tr>
              <tr>
                <th>Session Start</th>
                <td>{formatDate(student.sessionStart)}</td>
              </tr>
              <tr>
                <th>Session End</th>
                <td>{formatDate(student.sessionEnd)}</td>
              </tr>
              <tr>
                <th>Join Date</th>
                <td>{formatDate(student.joinDate)}</td>
              </tr>
            </tbody>
          </table>

          {/* ================= ACCOUNT / STATUS ================= */}
          <h6 className="fw-bold border-bottom pb-2 mb-3">
            Account & Status
          </h6>
          <table className="table table-bordered mb-0">
            <tbody>
              <tr>
                <th>Username</th>
                <td>{student.username || "-"}</td>
              </tr>
              <tr>
                <th>Fees Paid</th>
                <td>{yesNoBadge(student.feesPaid)}</td>
              </tr>
              <tr>
                <th>Certified</th>
                <td>{yesNoBadge(student.isCertified)}</td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}
