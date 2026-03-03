import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";

/**
 * CreditBadge Component
 * Displays a small badge with current credit balance
 * Color indicator: Green (>20), Yellow (10-20), Red (<10)
 * Click navigates to credits page
 */
export default function CreditBadge() {
  const navigate = useNavigate();
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);

  const franchiseToken = localStorage.getItem("franchise_token");
  const userRole = localStorage.getItem("user_role");

  // Only show for franchise users
  const isFranchise = userRole === "franchise" && franchiseToken;

  useEffect(() => {
    if (!isFranchise) {
      setLoading(false);
      return;
    }

    const fetchCredits = async () => {
      try {
        const res = await API.get("/credits/my-credits");
        setCredits(res.data?.data?.credits ?? null);
      } catch (err) {
        console.error("Failed to fetch credits:", err);
        setCredits(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();

    // Refresh credits every 30 seconds
    const interval = setInterval(fetchCredits, 30000);
    return () => clearInterval(interval);
  }, [isFranchise]);

  if (!isFranchise || loading) {
    return null;
  }

  // Determine color based on credit balance
  const getBadgeColor = () => {
    if (credits === null) return "bg-secondary";
    if (credits > 20) return "bg-success";
    if (credits >= 10) return "bg-warning text-dark";
    return "bg-danger";
  };

  const handleClick = () => {
    navigate("/franchise/credits");
  };

  return (
    <button
      onClick={handleClick}
      className={`btn btn-sm ${getBadgeColor()} rounded-pill d-flex align-items-center gap-1 px-3`}
      style={{ fontSize: "0.875rem", fontWeight: 500 }}
      title="Click to view credits"
    >
      <i className="bi bi-coin"></i>
      <span>{credits !== null ? credits : "--"}</span>
      <span className="d-none d-sm-inline">credits</span>
    </button>
  );
}
