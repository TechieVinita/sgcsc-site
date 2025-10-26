import { useState } from "react";

export default function StudyCenterList() {
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [results, setResults] = useState([]);

  // Dummy data for centers
  const centers = [
    { id: 1, name: "SGCSC Lucknow", state: "Uttar Pradesh", city: "Lucknow", address: "Aliganj, Lucknow" },
    { id: 2, name: "SGCSC Delhi", state: "Delhi", city: "New Delhi", address: "Connaught Place" },
    { id: 3, name: "SGCSC Jaipur", state: "Rajasthan", city: "Jaipur", address: "Vaishali Nagar" },
    { id: 4, name: "SGCSC Mumbai", state: "Maharashtra", city: "Mumbai", address: "Andheri East" },
  ];

  const states = ["Uttar Pradesh", "Delhi", "Rajasthan", "Maharashtra"];
  const cities = {
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi"],
    Delhi: ["New Delhi", "Dwarka", "Rohini"],
    Rajasthan: ["Jaipur", "Udaipur", "Jodhpur"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!state || !city) {
      alert("Please select both State and City.");
      return;
    }
    const filtered = centers.filter(
      (center) => center.state === state && center.city === city
    );
    setResults(filtered);
  };

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold mb-4">Study Center List</h2>
      <div className="card shadow-sm p-4 mb-5">
        <form onSubmit={handleSearch}>
          <div className="row g-3">
            {/* State Dropdown */}
            <div className="col-md-5">
              <label htmlFor="state" className="form-label fw-semibold">Select State</label>
              <select
                id="state"
                className="form-select"
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  setCity("");
                }}
              >
                <option value="">--Select--</option>
                {states.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* City Dropdown */}
            <div className="col-md-5">
              <label htmlFor="city" className="form-label fw-semibold">Select City</label>
              <select
                id="city"
                className="form-select"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!state}
              >
                <option value="">--Select--</option>
                {state &&
                  cities[state].map((ct) => (
                    <option key={ct} value={ct}>{ct}</option>
                  ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="col-md-2 d-flex align-items-end">
              <button type="submit" className="btn btn-primary w-100 fw-semibold">
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Search Results */}
      <div className="mt-4">
        {results.length > 0 ? (
          <div className="row">
            {results.map((center) => (
              <div key={center.id} className="col-md-6 mb-4">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <h5 className="fw-bold">{center.name}</h5>
                    <p className="mb-1"><strong>State:</strong> {center.state}</p>
                    <p className="mb-1"><strong>City:</strong> {center.city}</p>
                    <p className="mb-0"><strong>Address:</strong> {center.address}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted">No centers found. Please search to view results.</p>
        )}
      </div>
    </div>
  );
}
