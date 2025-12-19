import { useState } from "react";
import API from "../api/axiosInstance";

export default function StudentCertificateVerification() {
  const [certificateNo, setCertificateNo] = useState("");
  const [dob, setDob] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    try {
      const res = await API.post("/public/certificate", {
        certificateNo,
        dob,
      });
      setResult(res.data.data);
    } catch {
      setError("Certificate not found.");
    }
  };

  return (
    <div className="container my-5">
      <form onSubmit={handleSubmit} className="card p-4 mx-auto" style={{ maxWidth: 500 }}>
        <input className="form-control mb-3" placeholder="Certificate No"
          value={certificateNo} onChange={(e) => setCertificateNo(e.target.value)} />
        <input type="date" className="form-control mb-3"
          value={dob} onChange={(e) => setDob(e.target.value)} />
        <button className="btn btn-primary">Verify</button>
      </form>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {result && (
        <div className="card mt-4 p-3">
          <p><b>Name:</b> {result.name}</p>
          <p><b>Course:</b> {result.course}</p>
          <p><b>Issued:</b> {new Date(result.issueDate).toDateString()}</p>
        </div>
      )}
    </div>
  );
}
