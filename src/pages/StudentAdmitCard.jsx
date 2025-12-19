import { useEffect, useState } from "react";
import API from "../api/axiosInstance";

export default function StudentAdmitCard() {
  const [card, setCard] = useState(null);

  useEffect(() => {
    API.get("/student-profile/admit-card")
      .then(res => setCard(res.data.data))
      .catch(() => {
        localStorage.removeItem("student_token");
        window.location.href = "/student-login";
      });
  }, []);

  if (!card) return <p className="text-center mt-5">No admit card available</p>;

  return (
    <div className="container my-5">
      <h3>Admit Card</h3>

      <table className="table table-bordered">
        <tbody>
          <tr><th>Name</th><td>{card.name}</td></tr>
          <tr><th>Course</th><td>{card.course}</td></tr>
          <tr><th>Exam Date</th><td>{card.examDate}</td></tr>
          <tr><th>Center</th><td>{card.center}</td></tr>
        </tbody>
      </table>
    </div>
  );
}
