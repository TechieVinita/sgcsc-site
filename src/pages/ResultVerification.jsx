import React, { useState } from "react";

export default function ResultVerification() {
  const [formData, setFormData] = useState({
    rollNo: "",
    dob: "",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.rollNo || !formData.dob) {
      setError("Please fill all fields before submitting.");
      setResult(null);
      return;
    }

    // Simulated Result Lookup (Replace this with backend call later)
    if (formData.rollNo === "12345" && formData.dob === "2000-01-01") {
      setResult({
        name: "Ajay Maurya",
        course: "Advance Diploma in Computer Application (ADCA)",
        grade: "A+",
        status: "Pass",
      });
      setError("");
    } else {
      setError("No record found for the given details.");
      setResult(null);
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "600px" }}>
        <h3 className="text-center mb-4 fw-bold text-primary">Result Verification</h3>

        <form onSubmit={handleSubmit}>
          {/* Roll No */}
          <div className="mb-3">
            <label className="form-label">Roll No.</label>
            <input
              type="text"
              name="rollNo"
              placeholder="Enter Roll No."
              value={formData.rollNo}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          {/* Date of Birth */}
          <div className="mb-3">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              name="dob"
              placeholder="dd-mm-yyyy"
              value={formData.dob}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          {/* Error Message */}
          {error && <div className="alert alert-danger py-2">{error}</div>}

          {/* Submit Button */}
          <div className="text-center">
            <button type="submit" className="btn btn-primary px-5">
              Submit
            </button>
          </div>
        </form>

        {/* Display Result */}
        {result && (
          <div className="mt-4 p-3 border rounded bg-light">
            <h5 className="text-success mb-3">Result Found:</h5>
            <p><strong>Name:</strong> {result.name}</p>
            <p><strong>Course:</strong> {result.course}</p>
            <p><strong>Grade:</strong> {result.grade}</p>
            <p><strong>Status:</strong> {result.status}</p>
          </div>
        )}
      </div>
    </div>
  );
}
