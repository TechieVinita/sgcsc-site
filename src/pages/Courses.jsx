import { useEffect, useState } from "react";
import API from "../api/axiosInstance";

export default function Courses() {
  // Example course data; replace with API data if needed
  // const coursesData = {
  //   "Long Form Courses": [
  //     "Advance Diploma in Computer Application (ADCA)",
  //     "Diploma in Computer Application (DCA)",
  //     "Master Diploma in Computer Application (MCA)",
  //     "Diploma in Computer Teacher Application (DCTA)",
  //     "Diploma in Office Automation and Publishing (DOAP)",
  //     "Professional Diploma in Computer Application (PDCA)",
  //     "Advance Diploma in Information Technology (ADIT)",
  //     "Diploma in Secretarial Practice & Publishing (DSPP)",
  //     "Advance Diploma in Computer Programming (ADCP)",
  //     "Diploma in Multimedia Operation (DMO)"
  //   ],
  //   "Short Form Courses": [
  //     "Diploma in Computer Programming (DCP)",
  //     "Diploma in Computer Application & Designing (DCAD)",
  //     "Diploma in Financial Accounting (DFA)",
  //     "Diploma in Computer Application (DCA)",
  //     "Diploma in Computer Office Management (DCOM)",
  //     "Certificate Course in Computer Application (CCCA)",
  //     "Diploma in Tally.Erp 9 Advanced With GST",
  //     "Diploma in Web Designing"
  //   ],
  //   "Basic Courses": [
  //     "Certificate in Computer Based Hindi Typing - 40 W.P.M",
  //     "Certificate in Computer Based English Typing - 40 W.P.M",
  //     "Certificate in Computer Operator",
  //     "Certificate in Desktop Publishing (DTP)",
  //     "Certificate in Data Entry Operator (DEO)",
  //     "Course on Computer Concepts (CCC)",
  //     "Basic Computer Course (BCC)",
  //     "Basics Courses (2 Months)",
  //     "Certificate in HTML",
  //     "Certificate in Ms-Office",
  //     "Certificate in Corel Draw",
  //     "Certificate in Tally.Erp9.0 with GST",
  //     "Certificate in Tally Erp9 Experts",
  //     "Certificate in Java"
  //   ]
  // };

  return (
    <div className="container mt-5">
      <h1 className="fw-bold mb-4">Our Courses</h1>

      {Object.entries(coursesData).map(([category, courses], idx) => (
        <div
          key={idx}
          className="mb-5"
          id={category.replace(/\s+/g, "-").toLowerCase()}
        >
          <h3 className="fw-bold mb-3">{category}</h3>
          <div className="row">
            {courses.map((course, index) => (
              <div key={index} className="col-md-6 col-lg-4 mb-3">
                <div className="card h-100 shadow-sm">
                  <div className="card-body d-flex flex-column">
                    <p className="card-text">{course}</p>
                    <button className="btn btn-primary mt-auto">
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
