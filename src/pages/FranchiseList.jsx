import { useEffect, useState } from "react";
import API from "../api/axiosInstance";

export default function FranchiseList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    API.get("/public/franchise")
      .then((res) => setItems(res.data?.data || []))
      .catch(() => setItems([]));
  }, []);

  return (
    <div className="container my-5">
      <h3 className="text-center mb-4">Approved Study Centers</h3>

      <div className="row">
        {items.map((f) => (
          <div key={f._id} className="col-md-4 mb-3">
            <div className="card p-3 shadow-sm">
              <h5>{f.instituteName}</h5>
              <div className="text-muted">{f.instituteId}</div>
              <div>
                {f.district}, {f.state}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
