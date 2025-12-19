import { useEffect, useState } from "react";
import API from "../api/axiosInstance";

export default function StudentResults() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    API.get("/student-profile/results")
      .then(res => setResults(res.data.data))
      .catch(() => {
        localStorage.removeItem("student_token");
        window.location.href = "/student-login";
      });
  }, []);

  return (
    <div className="container my-5">
      <h3>My Results</h3>

      {results.length === 0 ? (
        <p>No results available</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Marks</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i}>
                <td>{r.subject}</td>
                <td>{r.marks}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
