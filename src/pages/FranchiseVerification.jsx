import { useState } from "react";
import API from "../api/axiosInstance";

export default function FranchiseVerification() {
  const [instituteId, setInstituteId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    if (!instituteId.trim()) return;

    try {
      setLoading(true);
      setResult(null);

      const res = await API.get(
        `/public/franchise/verify?instituteId=${instituteId}`
      );

      setResult(res.data);
    } catch {
      setResult({ verified: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <h3 className="text-center mb-4">Franchise Verification</h3>

      <input
        className="form-control mb-3"
        placeholder="Enter Institute ID"
        value={instituteId}
        onChange={(e) => setInstituteId(e.target.value)}
      />

      <button className="btn btn-primary w-100" onClick={verify}>
        {loading ? "Verifying..." : "Verify"}
      </button>

      {result && (
        <div className="mt-4">
          {result.verified ? (
            <div className="alert alert-success">
              <strong>Verified Franchise</strong>
              <div>{result.data.instituteName}</div>
              <div>{result.data.ownerName}</div>
              <div>
                {result.data.district}, {result.data.state}
              </div>
            </div>
          ) : (
            <div className="alert alert-danger">
              Franchise not verified
            </div>
          )}
        </div>
      )}
    </div>
  );
}
