import React, { useState, useRef, useEffect } from "react";
import API from "../api/axiosInstance";

const OWNER_UPI_ID = "demo@upi";
const REGISTRATION_FEE = 5000; // example amount

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];



export default function FranchiseRegistration() {
  const [formData, setFormData] = useState({
    ownerName: "",
    instituteName: "",
    dob: "",
    aadharNumber: "",
    panNumber: "",
    address: "",
    state: "",
    district: "",
    numTeachers: "",
    numClassrooms: "",
    totalComputers: "",
    centerSpace: "",
    whatsapp: "",
    contact: "",
    email: "",
    qualification: "",
    staffRoom: "",
    waterSupply: "",
    toilet: "",
    hasReception: "",
    username: "",
    password: "",
    captchaInput: "",
  });

  const [files, setFiles] = useState({
    aadharFront: null,
    aadharBack: null,
    panImage: null,
    certificateFile: null,
    institutePhoto: null,
    ownerSign: null,
    ownerImage: null,
  });


  // const [captcha] = useState(Math.floor(1000 + Math.random() * 9000).toString());
  const [captcha, setCaptcha] = useState("");
  const canvasRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);



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
      ownerImage: [100, 300],
      ownerSign: [0, 100],
      panImage: [100, 300],
      certificateFile: [100, 500],

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

      if (formData.captchaInput.toUpperCase() !== captcha) {
        alert("Invalid captcha");
        return;
      }


      try {
        const fd = new FormData(); // ✅ DECLARED FIRST

        // LOGIN
        fd.append("username", formData.username);
        fd.append("password", formData.password);

        // TEXT FIELDS
        fd.append("ownerName", formData.ownerName);
        fd.append("instituteName", formData.instituteName);
        fd.append("dob", formData.dob);
        fd.append("address", formData.address);
        fd.append("state", formData.state);
        fd.append("district", formData.district);
        fd.append("numTeachers", formData.numTeachers);
        fd.append("numClassrooms", formData.numClassrooms);
        fd.append("totalComputers", formData.totalComputers);
        fd.append("qualification", formData.qualification);
        fd.append("whatsapp", formData.whatsapp);
        fd.append("contact", formData.contact);
        fd.append("email", formData.email);
        fd.append("staffRoom", formData.staffRoom);
        fd.append("waterSupply", formData.waterSupply);
        fd.append("toilet", formData.toilet);

        fd.append("aadharNumber", formData.aadharNumber);
        fd.append("panNumber", formData.panNumber);
        fd.append("centerSpace", formData.centerSpace);
        fd.append("hasReception", formData.hasReception);



        // FILES
        if (files.aadharFront) fd.append("aadharFront", files.aadharFront);
        if (files.aadharBack) fd.append("aadharBack", files.aadharBack);
        if (files.institutePhoto) fd.append("institutePhoto", files.institutePhoto);
        if (files.ownerSign) fd.append("ownerSign", files.ownerSign);
        if (files.ownerImage) fd.append("ownerImage", files.ownerImage);
        if (files.panImage) fd.append("panImage", files.panImage);
        if (files.certificateFile) fd.append("certificateFile", files.certificateFile);

        await API.post("/franchises/public/register", fd);

        alert("Franchise application submitted successfully!");
        window.location.reload();
      } catch (err) {
        console.error("FRANCHISE SUBMIT ERROR:", err);
        alert(err.response?.data?.message || "Failed to submit form");
      }
    };


    const generateCaptcha = () => {
    const text = Math.random().toString(36).substring(2, 7).toUpperCase();
    setCaptcha(text);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // background
    ctx.fillStyle = "#f2f2f2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // smaller, uneven font
    ctx.font = "18px Arial";
    ctx.fillStyle = "#444";

    // slight blur
    ctx.shadowColor = "rgba(0,0,0,0.4)";
    ctx.shadowBlur = 1;

    // draw each character separately with randomness
    let x = 10;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      const y = 25 + Math.random() * 5;      // vertical jitter
      const angle = (Math.random() - 0.5) * 0.4; // rotation

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillText(char, 0, 0);
      ctx.restore();

      x += 18; // spacing between characters
    }

    // reset blur
    ctx.shadowBlur = 0;

    // extra noise dots
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        0.5,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }



    // noise lines
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = "#aaa";
      ctx.beginPath();
      ctx.moveTo(Math.random() * 120, Math.random() * 40);
      ctx.lineTo(Math.random() * 120, Math.random() * 40);
      ctx.stroke();
    }
  };

  useEffect(() => {
    generateCaptcha();
  }, []);




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

        {/* Aadhaar & PAN */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Aadhaar Card Number</label>
            <input
              type="text"
              name="aadharNumber"
              className="form-control"
              placeholder="12-digit Aadhaar Number"
              value={formData.aadharNumber}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 12);
                setFormData((p) => ({ ...p, aadharNumber: v }));
              }}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">PAN Card Number</label>
            <input
              type="text"
              name="panNumber"
              className="form-control"
              placeholder="ABCDE1234F"
              value={formData.panNumber}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  panNumber: e.target.value.toUpperCase(),
                }))
              }
              maxLength={10}
              required
            />
          </div>
        </div>


        {/* File Uploads */}
        <div className="row">
          {[
            { label: "Aadhar Front (100KB - 300KB)", name: "aadharFront" },
            { label: "Aadhar Back (100KB - 300KB)", name: "aadharBack" },
            { label: "Upload Institute Photo (100KB - 300KB)", name: "institutePhoto" },
            { label: "Center Owner Sign (0KB - 100KB)", name: "ownerSign" },
            { label: "Upload Image of Franchise Owner (100KB - 300KB)", name: "ownerImage" },
            { label: "PAN Card Image (100KB - 300KB)", name: "panImage" },
            { label: "Certificate Image (100KB - 500KB)", name: "certificateFile" },

          ].map((item, i) => (
            <div className="col-md-6 mb-3" key={i}>
              <label className="form-label fw-semibold">{item.label}</label>
              <input
                type="file"
                accept="image/*"
                name={item.name}
                className="form-control"
                onChange={handleFileChange}
                // required
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
                <option value="">-- Select State --</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">District</label>
            <input
              type="text"
              name="district"
              className="form-control"
              placeholder="Enter District"
              value={formData.district}
              onChange={handleChange}
              required
            />
          </div>

        </div>

        {/* Numbers */}
        <div className="row mb-3">
          <div className="col-md-3">
            <label className="form-label fw-semibold">Number of Teachers</label>
            <input
              type="number"
              name="numTeachers"
              className="form-control"
              value={formData.numTeachers}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold">Number of Class Rooms</label>
            <input
              type="number"
              name="numClassrooms"
              className="form-control"
              value={formData.numClassrooms}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold">Total Computers</label>
            <input
              type="number"
              name="totalComputers"
              className="form-control"
              value={formData.totalComputers}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold">
              Computer Center Space (sq.ft)
            </label>
            <input
              type="number"
              name="centerSpace"
              className="form-control"
              placeholder="e.g. 500"
              value={formData.centerSpace}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Contact Info */}

        <div className="row mb-3">
          {/* WhatsApp */}
          <div className="col-md-4">
            <label className="form-label fw-semibold">WhatsApp Number</label>
            <div className="input-group">
              <span className="input-group-text">+91</span>
              <input
                type="tel"
                name="whatsapp"
                className="form-control"
                placeholder="10 digit number"
                value={formData.whatsapp}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setFormData((p) => ({ ...p, whatsapp: v }));
                }}
                required
              />
            </div>
          </div>

          {/* Contact */}
          <div className="col-md-4">
            <label className="form-label fw-semibold">Contact Number</label>
            <div className="input-group">
              <span className="input-group-text">+91</span>
              <input
                type="tel"
                name="contact"
                className="form-control"
                placeholder="10 digit number"
                value={formData.contact}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setFormData((p) => ({ ...p, contact: v }));
                }}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="col-md-4">
            <label className="form-label fw-semibold">E-Mail ID</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter E-Mail"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
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
            { label: "Reception", name: "hasReception" },
            { label: "Staff Room", name: "staffRoom" },
            { label: "Water Supply", name: "waterSupply" },
            { label: "Toilet", name: "toilet" },
          ].map((item, i) => (
            <div className="col-md-3" key={i}>
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
              placeholder="Create Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control"
                placeholder="Create Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="mb-4 border rounded p-3 bg-white">
          <h5 className="fw-bold mb-2">Registration Fee Payment</h5>

          <p className="mb-1">
            <strong>Amount:</strong> ₹{REGISTRATION_FEE}
          </p>

          <p className="mb-2">
            <strong>UPI ID:</strong> {OWNER_UPI_ID}
          </p>

          <div className="text-center mb-2">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=demo@upi"
              alt="UPI QR Code"
              style={{ maxWidth: 180 }}
            />
          </div>

          <small className="text-muted d-block text-center">
            Scan the QR using any UPI app and complete payment before submitting.
          </small>
        </div>


        {/* Captcha */}
        <div className="mb-3">
          {/* <label className="form-label fw-semibold d-block">Captcha</label> */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Captcha</label>

              <div className="d-flex align-items-center gap-3">
                <canvas
                  ref={canvasRef}
                  width="110"
                  height="35"
                  style={{ border: "1px solid #ccc" }}
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={generateCaptcha}
                >
                  ↻
                </button>
              </div>

              <input
                type="text"
                name="captchaInput"
                className="form-control mt-2"
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
