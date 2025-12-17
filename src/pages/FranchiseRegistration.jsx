import React, { useState } from "react";

export default function FranchiseRegistration() {
  const [formData, setFormData] = useState({
    ownerName: "",
    instituteName: "",
    dob: "",
    address: "",
    state: "",
    district: "",
    numTeachers: "",
    numClassrooms: "",
    totalComputers: "",
    whatsapp: "",
    contact: "",
    email: "",
    qualification: "",
    staffRoom: "",
    waterSupply: "",
    toilet: "",
    username: "",
    password: "",
    captchaInput: "",
  });

  const [files, setFiles] = useState({
    aadharFront: null,
    aadharBack: null,
    institutePhoto: null,
    ownerSign: null,
    ownerPhoto: null,
  });

  const [captcha] = useState(Math.floor(1000 + Math.random() * 9000).toString());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    const file = selectedFiles[0];
    if (!file) return;

    const limits = {
      aadharFront: [100, 300],
      aadharBack: [100, 300],
      institutePhoto: [100, 300],
      ownerPhoto: [100, 300],
      ownerSign: [0, 100],
    };

    const [minKB, maxKB] = limits[name];
    const sizeKB = file.size / 1024;

    if (sizeKB < minKB || sizeKB > maxKB) {
      alert(`${name} must be between ${minKB}KB and ${maxKB}KB`);
      e.target.value = null;
      return;
    }

    setFiles((prev) => ({ ...prev, [name]: file }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const fd = new FormData();

    // TEXT FIELDS
    fd.append("instituteId", formData.instituteId);
    fd.append("ownerName", formData.ownerName);
    fd.append("instituteName", formData.instituteName);
    fd.append("dob", formData.dob);
    fd.append("aadharNumber", formData.aadharNumber);
    fd.append("panNumber", formData.panNumber);
    fd.append("address", formData.address);
    fd.append("state", formData.state);
    fd.append("district", formData.district);
    fd.append("operatorsCount", formData.operatorsCount);
    fd.append("classRooms", formData.classRooms);
    fd.append("totalComputers", formData.totalComputers);
    fd.append("centerSpace", formData.centerSpace);
    fd.append("whatsapp", formData.whatsapp);
    fd.append("contact", formData.contact);
    fd.append("email", formData.email);
    fd.append("ownerQualification", formData.ownerQualification);
    fd.append("hasReception", formData.hasReception);
    fd.append("hasStaffRoom", formData.hasStaffRoom);
    fd.append("hasWaterSupply", formData.hasWaterSupply);
    fd.append("hasToilet", formData.hasToilet);

    // FILES — NAMES MUST MATCH MULTER
    if (files.aadharFront) fd.append("aadharFront", files.aadharFront);
    if (files.aadharBack) fd.append("aadharBack", files.aadharBack);
    if (files.panImage) fd.append("panImage", files.panImage);
    if (files.institutePhoto) fd.append("institutePhoto", files.institutePhoto);
    if (files.ownerSign) fd.append("ownerSign", files.ownerSign);
    if (files.ownerImage) fd.append("ownerImage", files.ownerImage);
    if (files.certificateFile) fd.append("certificateFile", files.certificateFile);

    const res = await fetch(
      "http://localhost:5000/api/franchises/register",
      {
        method: "POST",
        body: fd,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }

    alert("Franchise registration submitted successfully!");
    window.location.reload();
  } catch (err) {
    console.error("FRANCHISE SUBMIT ERROR:", err);
    alert(err.message || "Failed to submit form");
  }
};


  return (
    <div className="container my-5">
      <h2 className="text-center text-uppercase fw-bold mb-4">
        Franchise Registration Form
      </h2>
      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">

        {/* Institute Owner Name */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Institute Owner Name</label>
          <input
            type="text"
            name="ownerName"
            className="form-control"
            placeholder="Enter Institute Owner Name"
            value={formData.ownerName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Institute Name */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Institute Name</label>
          <input
            type="text"
            name="instituteName"
            className="form-control"
            placeholder="Enter Institute Name"
            value={formData.instituteName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Date of Birth */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Date of Birth</label>
          <input
            type="date"
            name="dob"
            className="form-control"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>

        {/* File Uploads */}
        <div className="row">
          {[
            { label: "Aadhar Front (100KB - 300KB)", name: "aadharFront" },
            { label: "Aadhar Back (100KB - 300KB)", name: "aadharBack" },
            { label: "Upload Institute Photo (100KB - 300KB)", name: "institutePhoto" },
            { label: "Center Owner Sign (0KB - 100KB)", name: "ownerSign" },
            { label: "Upload Image of Franchise Owner (100KB - 300KB)", name: "ownerPhoto" },
          ].map((item, i) => (
            <div className="col-md-6 mb-3" key={i}>
              <label className="form-label fw-semibold">{item.label}</label>
              <input
                type="file"
                accept="image/*"
                name={item.name}
                className="form-control"
                onChange={handleFileChange}
                required
              />
            </div>
          ))}
        </div>

        {/* Address */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Institute Full Address</label>
          <textarea
            name="address"
            className="form-control"
            placeholder="Enter Institute Full Address"
            rows="3"
            value={formData.address}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        {/* State and District */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Select State</label>
            <select
              name="state"
              className="form-select"
              value={formData.state}
              onChange={handleChange}
              required
            >
              <option value="">--Select--</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Bihar">Bihar</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Select District</label>
            <select
              name="district"
              className="form-select"
              value={formData.district}
              onChange={handleChange}
              required
            >
              <option value="">--Select--</option>
              <option value="Mau">Mau</option>
              <option value="Raipur">Raipur</option>
            </select>
          </div>
        </div>

        {/* Numbers */}
        <div className="row mb-3">
          {[
            { label: "Number of Teachers", name: "numTeachers" },
            { label: "Number of Class Rooms", name: "numClassrooms" },
            { label: "Total Computers", name: "totalComputers" },
          ].map((item, i) => (
            <div className="col-md-4" key={i}>
              <label className="form-label fw-semibold">{item.label}</label>
              <input
                type="number"
                name={item.name}
                className="form-control"
                placeholder={`Enter ${item.label}`}
                value={formData[item.name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="row mb-3">
          {[
            { label: "Whatsapp Number", name: "whatsapp" },
            { label: "Contact Number", name: "contact" },
            { label: "E-Mail ID", name: "email", type: "email" },
          ].map((item, i) => (
            <div className="col-md-4" key={i}>
              <label className="form-label fw-semibold">{item.label}</label>
              <input
                type={item.type || "text"}
                name={item.name}
                className="form-control"
                placeholder={`Enter ${item.label}`}
                value={formData[item.name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
        </div>

        {/* Qualification */}
        <div className="mb-3">
          <label className="form-label fw-semibold">
            Qualification of Institute Head
          </label>
          <input
            type="text"
            name="qualification"
            className="form-control"
            placeholder="Enter Qualification of Institute Head"
            value={formData.qualification}
            onChange={handleChange}
            required
          />
        </div>

        {/* Facilities */}
        <div className="row mb-3">
          {[
            { label: "Staff Room", name: "staffRoom" },
            { label: "Water Supply", name: "waterSupply" },
            { label: "Toilet", name: "toilet" },
          ].map((item, i) => (
            <div className="col-md-4" key={i}>
              <label className="form-label fw-semibold d-block">
                {item.label}
              </label>
              <div>
                <label className="me-3">
                  <input
                    type="radio"
                    name={item.name}
                    value="Yes"
                    onChange={handleChange}
                    required
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name={item.name}
                    value="No"
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Username / Password */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Enter Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Captcha */}
        <div className="mb-3">
          <label className="form-label fw-semibold d-block">Captcha</label>
          <div className="d-flex align-items-center">
            <div
              className="border bg-white p-2 me-3 fw-bold fs-5 text-center"
              style={{ width: "100px", letterSpacing: "3px" }}
            >
              {captcha}
            </div>
            <input
              type="text"
              name="captchaInput"
              className="form-control"
              placeholder="Enter Captcha Code"
              value={formData.captchaInput}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="text-danger fw-semibold mb-3">
          * Important: Ensure all uploaded images meet the size criteria before submitting.
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary px-5 py-2">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
