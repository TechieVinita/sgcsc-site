import React from "react";

export default function Contact() {
  return (
    <div className="container my-5">
      <div className="card shadow p-4">
        <h2 className="text-center mb-4 fw-bold text-primary">Contact Us</h2>

        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="text-center">
              <h5 className="fw-semibold mb-3">Address</h5>
              <p className="mb-1">Raipur (Chiraiyakot) - Mau</p>
              <p className="mb-1">State: Uttar Pradesh, India</p>
              <p className="mb-1">
                <strong>Phone:</strong>{" "}
                <a
                  href="tel:+919889624850"
                  className="text-decoration-none text-dark"
                >
                  +91 9889624850
                </a>
              </p>
              <p className="mb-4">
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:ajayamaurya@gmail.com"
                  className="text-decoration-none text-dark"
                >
                  ajayamaurya@gmail.com
                </a>
              </p>

              <h5 className="fw-semibold mb-2">Contact Us</h5>
              <p>
                <a
                  href="tel:+919889624850"
                  className="btn btn-primary px-4 py-2"
                >
                  Call: +91 9889624850
                </a>
              </p>
            </div>

            <hr className="my-4" />

            <div className="text-center text-muted">
              <small>
                For any franchise-related queries, admissions, or verification,
                please reach out to us during office hours (Mon–Sat, 10 AM–6 PM).
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
