import { useState } from "react";

export default function AdmitCard() {
  const [enrollmentNo, setEnrollmentNo] = useState("");
  const [dob, setDob] = useState("");
  const [admitCard, setAdmitCard] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!enrollmentNo || !dob) {
      alert("Please fill in both fields.");
      return;
    }

    // Temporary dummy data — replace with API fetch later
    if (enrollmentNo === "SGC12345" && dob === "2000-05-12") {
      setAdmitCard({
        name: "Rahul Sharma",
        course: "ADCA",
        examDate: "15-Nov-2025",
        examTime: "10:00 AM - 1:00 PM",
        examCenter: "SGCSC Raipur (Chiraiyakot)",
        photo: "https://randomuser.me/api/portraits/men/31.jpg",
      });
    } else {
      setAdmitCard({ notFound: true });
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold mb-4">Admit Card</h2>

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

          {/* Submit */}
          <button type="submit" className="btn btn-primary w-100 fw-semibold">
            Submit
          </button>
        </form>
      </div>

      {/* Admit Card Display */}
      {admitCard && !admitCard.notFound && (
        <div className="card mt-5 shadow-lg mx-auto" style={{ maxWidth: "700px" }}>
          <div className="card-header bg-primary text-white text-center fw-bold">
            SHREE GANPATI COMPUTER AND STUDY CENTRE<br />
            <small>An ISO 9001:2015 Certified Organization</small>
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-md-4 text-center">
                <img
                  src={admitCard.photo}
                  alt="Student"
                  className="rounded border"
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />
              </div>
              <div className="col-md-8">
                <h5 className="fw-bold mb-2">{admitCard.name}</h5>
                <p><strong>Course:</strong> {admitCard.course}</p>
                <p><strong>Exam Date:</strong> {admitCard.examDate}</p>
                <p><strong>Exam Time:</strong> {admitCard.examTime}</p>
                <p><strong>Exam Center:</strong> {admitCard.examCenter}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Not Found */}
      {admitCard?.notFound && (
        <div className="alert alert-danger mt-5 mx-auto text-center" style={{ maxWidth: "600px" }}>
          No Admit Card found for the provided details.
        </div>
      )}
    </div>
  );
}
