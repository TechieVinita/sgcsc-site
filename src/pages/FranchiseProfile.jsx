import { useEffect, useState } from "react";
import API from "../api/axiosInstance";

export default function FranchiseProfile() {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);
const [form, setForm] = useState(null);


  useEffect(() => {
    API.get("/franchise-profile/me")
      .then((res) => {
  setData(res.data.data);
  setForm(res.data.data);
})

      .catch(() => {
        localStorage.clear();
        window.location.href = "/franchise-login";
      });
  }, []);

  if (!data) return <p className="text-center mt-5">Loading...</p>;


const renderText = (label, field) => (
  <tr>
    <th>{label}</th>
    <td>
      {editMode ? (
        <input
          className="form-control"
          value={form[field] || ""}
          onChange={(e) =>
            setForm({ ...form, [field]: e.target.value })
          }
        />
      ) : (
        data[field] || "-"
      )}
    </td>
  </tr>
);

const renderNumber = (label, field) => (
  <tr>
    <th>{label}</th>
    <td>
      {editMode ? (
        <input
          type="number"
          className="form-control"
          value={form[field] ?? 0}
          onChange={(e) =>
            setForm({ ...form, [field]: Number(e.target.value) })
          }
        />
      ) : (
        data[field] ?? 0
      )}
    </td>
  </tr>
);

const renderBoolean = (label, field) => (
  <tr>
    <th>{label}</th>
    <td>
      {editMode ? (
        <select
          className="form-select"
          value={form[field] ? "yes" : "no"}
          onChange={(e) =>
            setForm({ ...form, [field]: e.target.value === "yes" })
          }
        >
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      ) : (
        data[field] ? "Yes" : "No"
      )}
    </td>
  </tr>
);



return (
  <div className="container my-5">
<h3 className="mb-4">Franchise Profile</h3>

<table className="table table-bordered">
<tbody>
  {/* READ-ONLY */}
  <tr><th>Institute ID</th><td>{data.instituteId}</td></tr>

  {/* EDITABLE TEXT */}
  {renderText("Institute Name", "instituteName")}
  {renderText("Owner Name", "ownerName")}
  {renderText("Email", "email")}
  {renderText("Contact", "contact")}
  {renderText("WhatsApp", "whatsapp")}
  {renderText("Address", "address")}
  {renderText("District", "district")}
  {renderText("State", "state")}

  {/* DATE */}
  <tr>
    <th>Date of Birth</th>
    <td>
      {editMode ? (
        <input
          type="date"
          className="form-control"
          value={
            form.dob
              ? new Date(form.dob).toISOString().slice(0, 10)
              : ""
          }
          onChange={(e) =>
            setForm({ ...form, dob: e.target.value })
          }
        />
      ) : (
        data.dob ? new Date(data.dob).toLocaleDateString() : "-"
      )}
    </td>
  </tr>

  {/* NUMBERS */}
  {renderNumber("Total Computers", "totalComputers")}
  {renderNumber("Class Rooms", "classRooms")}
  {renderNumber("Operators Count", "operatorsCount")}

  {/* BOOLEANS */}
  {renderBoolean("Reception", "hasReception")}
  {renderBoolean("Staff Room", "hasStaffRoom")}
  {renderBoolean("Water Supply", "hasWaterSupply")}
  {renderBoolean("Toilet", "hasToilet")}

  {/* READ-ONLY */}
  <tr>
    <th>Status</th>
    <td>
      <span className="badge bg-success">{data.status}</span>
    </td>
  </tr>
</tbody>

</table>

<div className="d-flex gap-2">
{!editMode ? (
  <button
    className="btn btn-primary"
    onClick={() => setEditMode(true)}
  >
    Edit Profile
  </button>
) : (
  <>
    <button
      className="btn btn-success"
      onClick={async () => {
        await API.put("/franchise-profile/me", form);
        setData(form);
        setEditMode(false);
      }}
    >
      Save
    </button>

    <button
      className="btn btn-secondary"
      onClick={() => {
        setForm(data);
        setEditMode(false);
      }}
    >
      Cancel
    </button>
  </>
)}



  

  <button
    className="btn btn-outline-danger"
    onClick={() => {
      localStorage.clear();
      window.location.href = "/franchise-login";
    }}
  >
    Logout
  </button>
</div>

  </div>
);

}
