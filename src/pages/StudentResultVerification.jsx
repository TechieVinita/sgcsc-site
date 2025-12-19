import { useState } from "react";
import API from "../api/axiosInstance";

export default function StudentResultVerification() {
  const [rollNo, setRollNo] = useState("");
  const [dob, setDob] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    try {
      const res = await API.post("/public/result", { rollNo, dob });
      setResult(res.data.data);
    } catch {
      setError("Result not found.");
    }
  };

  return (
    <div className="container my-5">
      <form onSubmit={handleSubmit} className="card p-4 mx-auto" style={{ maxWidth: 500 }}>
        <input className="form-control mb-3" placeholder="Roll No"
          value={rollNo} onChange={(e) => setRollNo(e.target.value)} />
        <input type="date" className="form-control mb-3"
          value={dob} onChange={(e) => setDob(e.target.value)} />
        <button className="btn btn-primary">Verify</button>
      </form>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {result && (
        <div className="card mt-4 p-3">
          <p><b>Name:</b> {result.name}</p>
          <p><b>Course:</b> {result.course}</p>
          <p><b>Grade:</b> {result.grade}</p>
          <p><b>Status:</b> {result.status}</p>
        </div>
      )}
    </div>
  );
}
