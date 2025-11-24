// src/pages/Contact.jsx
import React from "react";

const DEV_SAMPLE_IMAGE = "/mnt/data/58e83842-f724-41ef-b678-0d3ad1e30ed8.png";

export default function Contact() {
  const embedUrl = process.env.REACT_APP_MAP_EMBED_URL || "";

  const searchQuery = encodeURIComponent("Chiraiyakot Mau Uttar Pradesh India");
  const fallbackEmbed = `https://www.google.com/maps?q=${searchQuery}&z=14&output=embed`;

  return (
    <div className="container my-5">
      <div className="card shadow p-4">
        <h2 className="text-center mb-4 fw-bold text-primary">Contact Us</h2>

        <div className="row g-4">
          {/* LEFT: Contact Info */}
          <div className="col-md-5">
            <div className="mb-4">
              <h5 className="fw-semibold mb-2">Address</h5>
              <p className="mb-1">Raipur (Chiraiyakot) - Mau</p>
              <p className="mb-1">Uttar Pradesh, India</p>
            </div>

            <div className="mb-4">
              <h5 className="fw-semibold mb-2">Phone</h5>
              <a
                href="tel:+919889624850"
                className="text-decoration-none text-dark fs-6"
              >
                +91 9889624850
              </a>
            </div>

            <div className="mb-4">
              <h5 className="fw-semibold mb-2">Email</h5>
              <a
                href="mailto:ajayamaurya@gmail.com"
                className="text-decoration-none text-dark fs-6"
              >
                ajayamaurya@gmail.com
              </a>
            </div>

            <div className="text-muted small mt-4">
              For franchise, admission, or verification queries, contact during
              office hours (Mon–Sat, 10 AM–6 PM).
            </div>
          </div>

          {/* RIGHT: Embedded Google Map */}
          <div className="col-md-7">
            <h5 className="fw-semibold mb-3">Location Map</h5>

            <div
              className="rounded overflow-hidden shadow-sm"
              style={{ height: "350px" }}
            >
              <iframe
                title="SGCSC Location"
                src={embedUrl || fallbackEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <noscript className="d-block mt-3 text-center">
              <img
                src={DEV_SAMPLE_IMAGE}
                alt="Map preview"
                style={{
                  width: "100%",
                  maxHeight: 240,
                  objectFit: "cover",
                  borderRadius: 6,
                }}
              />
            </noscript>
          </div>
        </div>
      </div>
    </div>
  );
}
