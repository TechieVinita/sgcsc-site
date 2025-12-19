import { useEffect, useState } from "react";
import API from "../api/axiosInstance";

export default function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/student-profile/me")
      .then((res) => {
        setStudent(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("student_token");
        window.location.href = "/student-login";
      });
  }, []);

  if (loading) {
    return <p className="text-center mt-5">Loading...</p>;
  }

  if (!student) {
    return <p className="text-center mt-5">No student data found</p>;
  }

  return (
    <div className="container my-5">
      <h3 className="mb-4">Student Profile</h3>

      <table className="table table-bordered">
        <tbody>
          <tr>
            <th>Name</th>
            <td>{student.name}</td>
          </tr>

          <tr>
            <th>Enrollment No</th>
            <td>{student.enrollmentNo}</td>
          </tr>

          <tr>
            <th>Course</th>
            <td>{student.course}</td>
          </tr>

          <tr>
            <th>Date of Birth</th>
            <td>
              {student.dob
                ? new Date(student.dob).toLocaleDateString()
                : "-"}
            </td>
          </tr>

          <tr>
            <th>Status</th>
            <td>
              <span className="badge bg-success">
                {student.status || "Active"}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
