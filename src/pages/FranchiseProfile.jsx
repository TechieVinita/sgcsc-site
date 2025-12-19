import { useEffect, useState } from "react";
import API from "../api/axiosInstance";

export default function FranchiseProfile() {
  const [franchise, setFranchise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/franchise-profile/me");
        setFranchise(res.data);
      } catch (err) {
        console.error("Franchise profile load failed:", err);
        setError(
          "Unable to load profile data right now. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <p>Loading franchise profile...</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h3 className="mb-4 text-center">Franchise Profile</h3>

      {error && (
        <div className="alert alert-warning text-center">
          {error}
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-bordered mb-0">
            <tbody>
              <tr>
                <th style={{ width: "35%" }}>Institute ID</th>
                <td>{franchise?.instituteId || "-"}</td>
              </tr>

              <tr>
                <th>Institute Name</th>
                <td>{franchise?.instituteName || "-"}</td>
              </tr>

              <tr>
                <th>Owner Name</th>
                <td>{franchise?.ownerName || "-"}</td>
              </tr>

              <tr>
                <th>Email</th>
                <td>{franchise?.email || "-"}</td>
              </tr>

              <tr>
                <th>Contact</th>
                <td>{franchise?.contact || "-"}</td>
              </tr>

              <tr>
                <th>WhatsApp</th>
                <td>{franchise?.whatsapp || "-"}</td>
              </tr>

              <tr>
                <th>Address</th>
                <td>{franchise?.address || "-"}</td>
              </tr>

              <tr>
                <th>District</th>
                <td>{franchise?.district || "-"}</td>
              </tr>

              <tr>
                <th>State</th>
                <td>{franchise?.state || "-"}</td>
              </tr>

              <tr>
                <th>Status</th>
                <td>
                  <span className="badge bg-success">
                    {franchise?.status || "Approved"}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
