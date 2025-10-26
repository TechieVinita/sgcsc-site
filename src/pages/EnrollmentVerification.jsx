import { useState } from "react";

export default function EnrollmentVerification() {
  const [enrollmentNo, setEnrollmentNo] = useState("");
  const [dob, setDob] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!enrollmentNo || !dob) {
      alert("Please enter both Enrollment Number and Date of Birth.");
      return;
    }

    // Dummy verification result for now
    if (enrollmentNo === "SGC12345" && dob === "2000-05-12") {
      setResult({
        name: "Rahul Sharma",
        course: "ADCA",
        session: "2024-2025",
        status: "Verified",
      });
    } else {
      setResult({ status: "Not Found" });
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold mb-4">Enrollment Verification</h2>

      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "600px" }}>
        <form onSubmit={handleSubmit}>
          {/* Enrollment No */}
          <div className="mb-3">
            <label htmlFor="enrollmentNo" className="form-label fw-semibold">
              Enrollment No.
            </label>
            <input
              type="text"
              id="enrollmentNo"
              className="form-control"
              placeholder="Enter Enrollment No."
              value={enrollmentNo}
              onChange={(e) => setEnrollmentNo(e.target.value)}
            />
          </div>

          {/* Date of Birth */}
          <div className="mb-3">
            <label htmlFor="dob" className="form-label fw-semibold">
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              className="form-control"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100 fw-semibold">
            Submit
          </button>
        </form>
      </div>

      {/* Result Section */}
      {result && (
        <div className="mt-5 text-center">
          {result.status === "Verified" ? (
            <div className="card shadow-sm border-success mx-auto" style={{ maxWidth: "500px" }}>
              <div className="card-body">
                <h5 className="fw-bold text-success mb-3">Enrollment Verified ✅</h5>
                <p><strong>Name:</strong> {result.name}</p>
                <p><strong>Course:</strong> {result.course}</p>
                <p><strong>Session:</strong> {result.session}</p>
                <p><strong>Status:</strong> {result.status}</p>
              </div>
            </div>
          ) : (
            <div className="alert alert-danger mt-4 mx-auto" style={{ maxWidth: "500px" }}>
              No record found for the provided details.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
