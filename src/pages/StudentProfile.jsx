import { useEffect, useState, useRef } from "react";
import API from "../api/axiosInstance";

// Default avatar SVG for students without a photo
const DEFAULT_AVATAR_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill="#a0a0a0"/>
      <circle cx="40" cy="30" r="14" fill="#e0e0e0"/>
      <path d="M20 68 Q40 45 60 68" fill="#e0e0e0"/>
    </svg>`
  );

export default function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const printRef = useRef();
  
  // Month names
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Generate default monthly data from student courses
  const generateMonthlyData = () => {
    const data = {};
    const currentYear = new Date().getFullYear();
    const yearStr = currentYear.toString().slice(-2);
    
    // Initialize all 12 months with default values
    for (let i = 0; i < 12; i++) {
      const monthNum = i + 1;
      data[i] = {
        date: `01-${monthNum.toString().padStart(2, '0')}-${yearStr}`,
        paid: student?.feeAmount ? Math.ceil(student.feeAmount / 12) : 0,
        due: 0
      };
    }
    return data;
  };
  
  const [monthlyData, setMonthlyData] = useState({});
  
  // Calculate totals
  const calculateTotals = () => {
    let totalPaid = 0;
    let totalDue = 0;
    Object.values(monthlyData).forEach(d => {
      totalPaid += Number(d.paid) || 0;
      totalDue += Number(d.due) || 0;
    });
    return { totalPaid, totalDue };
  };
  
  const { totalPaid, totalDue } = calculateTotals();
  
  // Generate receipt number
  const generateReceiptNo = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `RC${year}${month}${random}`;
  };
  
  const [receiptNo] = useState(generateReceiptNo());
  
  // Initialize monthly data when student loads
  useEffect(() => {
    if (student) {
      setMonthlyData(generateMonthlyData());
    }
  }, [student]);
  
  const handlePrint = () => {
    const printContent = printRef.current;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Fee Receipt</title>
        <style>
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .receipt { width: 490px; margin: 20px auto; background: #fff; border: 4px solid #25D366; padding: 8px; font-size: 12px; }
          .center-name { width: 100%; margin: 5px auto 2px auto; background: #25D366; color: #fff; text-align: center; font-weight: bold; font-size: 16px; padding: 5px 0; border-radius: 10px; letter-spacing: 2px; }
          .center-address { text-align: center; font-size: 13px; margin-bottom: 10px; color: #444; }
          .student { display: flex; justify-content: space-between; }
          .details { flex: 1; margin: 0 8px; }
          .row { margin-bottom: 3px; }
          .label { display: inline-block; width: 110px; font-weight: bold; }
          .fee-title { margin: 8px auto; width: 75%; background: #25D366; color: #fff; text-align: center; font-weight: bold; padding: 8px 0; border-radius: 30px; letter-spacing: 1px; }
          .photo img { width: 90px; height: 90px; border: 1px solid #000; object-fit: cover; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 6px; }
          th, td { border: 1px solid #000; padding: 3px; text-align: center; }
          th { background: #eaeaea; }
          .footer { margin-top: 6px; font-size: 10px; }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };
  
  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "-";
  
  const formatDateGB = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB').replace(/\//g, '-');
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/student-profile/me");
        setStudent(res.data?.data || null);
      } catch (err) {
        console.error("Student profile fetch failed:", err);
        setError("Unable to load student profile at the moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <p>Loading student profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-warning">{error}</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container my-5 text-center">
        <p>No profile data found.</p>
      </div>
    );
  }

  const yesNoBadge = (value) => (
    <span className={`badge ${value ? "bg-success" : "bg-secondary"}`}>
      {value ? "Yes" : "No"}
    </span>
  );

  return (
    <div className="container my-5">
      <h3 className="mb-4 text-center">Student Profile</h3>

      <div className="card shadow-sm">
        <div className="card-body">

          {/* ================= PHOTO + BASIC ================= */}
          <div className="row mb-4 align-items-center">
            <div className="col-md-3 text-center">
              <img
                src={student.photo || DEFAULT_AVATAR_SVG}
                alt="Student"
                className="img-fluid rounded border"
                style={{ maxHeight: "150px" }}
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_AVATAR_SVG;
                }}
              />
            </div>
            <div className="col-md-9">
              <h5 className="fw-bold mb-1">{student.name}</h5>
              <p className="mb-1 text-muted">{student.courseName || "-"}</p>
              <p className="mb-0">
                <strong>Center:</strong> {student.centerName || "-"}
              </p>
            </div>
          </div>

          {/* ================= PERSONAL DETAILS ================= */}
          <h6 className="fw-bold border-bottom pb-2 mb-3">
            Personal Details
          </h6>
          <table className="table table-bordered mb-4">
            <tbody>
              <tr>
                <th>Gender</th>
                <td>{student.gender || "-"}</td>
              </tr>
              <tr>
                <th>Date of Birth</th>
                <td>{formatDate(student.dob)}</td>
              </tr>
              <tr>
                <th>Father's Name</th>
                <td>{student.fatherName || "-"}</td>
              </tr>
              <tr>
                <th>Mother's Name</th>
                <td>{student.motherName || "-"}</td>
              </tr>
            </tbody>
          </table>

          {/* ================= CONTACT DETAILS ================= */}
          <h6 className="fw-bold border-bottom pb-2 mb-3">
            Contact Details
          </h6>
          <table className="table table-bordered mb-4">
            <tbody>
              <tr>
                <th>Email</th>
                <td>{student.email || "-"}</td>
              </tr>
              <tr>
                <th>Mobile</th>
                <td>{student.mobile || student.contact || "-"}</td>
              </tr>
              <tr>
                <th>State</th>
                <td>{student.state || "-"}</td>
              </tr>
              <tr>
                <th>District</th>
                <td>{student.district || "-"}</td>
              </tr>
              <tr>
                <th>Address</th>
                <td>{student.address || "-"}</td>
              </tr>
            </tbody>
          </table>

          {/* ================= ACADEMIC DETAILS ================= */}
          <h6 className="fw-bold border-bottom pb-2 mb-3">
            Academic Details
          </h6>
          <table className="table table-bordered mb-4">
            <tbody>
              <tr>
                <th>Exam Passed</th>
                <td>{student.examPassed || "-"}</td>
              </tr>
              <tr>
                <th>Board / University</th>
                <td>{student.board || "-"}</td>
              </tr>
              <tr>
                <th>Marks / Grade</th>
                <td>{student.marksOrGrade || "-"}</td>
              </tr>
              <tr>
                <th>Passing Year</th>
                <td>{student.passingYear || "-"}</td>
              </tr>
            </tbody>
          </table>

          {/* ================= COURSE & SESSION ================= */}
          <h6 className="fw-bold border-bottom pb-2 mb-3">
            Course & Session
          </h6>
          
          {/* Show all enrolled courses */}
          {student.courses && student.courses.length > 0 ? (
            student.courses.map((course, index) => (
              <div key={index} className="mb-3">
                <h6 className="text-muted">Course {index + 1}</h6>
                <table className="table table-bordered mb-3">
                  <tbody>
                    <tr>
                      <th>Course Name</th>
                      <td>{course.courseName || "-"}</td>
                    </tr>
                    <tr>
                      <th>Fee</th>
                      <td>₹{course.feeAmount || 0}</td>
                    </tr>
                    <tr>
                      <th>Amount Paid</th>
                      <td>₹{course.amountPaid || 0}</td>
                    </tr>
                    <tr>
                      <th>Pending</th>
                      <td>
                        <span className={`badge ${((course.feeAmount || 0) - (course.amountPaid || 0)) > 0 ? 'bg-danger' : 'bg-success'}`}>
                          ₹{(course.feeAmount || 0) - (course.amountPaid || 0)}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th>Session Start</th>
                      <td>{formatDate(course.sessionStart)}</td>
                    </tr>
                    <tr>
                      <th>Session End</th>
                      <td>{formatDate(course.sessionEnd)}</td>
                    </tr>
                    <tr>
                      <th>Paid?</th>
                      <td>{yesNoBadge(course.feesPaid)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <table className="table table-bordered mb-4">
              <tbody>
                <tr>
                  <th>Course Name</th>
                  <td>{student.courseName || "-"}</td>
                </tr>
                <tr>
                  <th>Semester</th>
                  <td>{student.semester ?? "-"}</td>
                </tr>
                <tr>
                  <th>Session Start</th>
                  <td>{formatDate(student.sessionStart)}</td>
                </tr>
                <tr>
                  <th>Session End</th>
                  <td>{formatDate(student.sessionEnd)}</td>
                </tr>
                <tr>
                  <th>Join Date</th>
                  <td>{formatDate(student.joinDate)}</td>
                </tr>
              </tbody>
            </table>
          )}

          {/* ================= FEE DETAILS ================= */}
          <h6 className="fw-bold border-bottom pb-2 mb-3">
            Fee Details
          </h6>
          <table className="table table-bordered mb-4">
            <tbody>
              <tr>
                <th>Total Fee</th>
                <td>₹{student.feeAmount || 0}</td>
              </tr>
              <tr>
                <th>Amount Paid</th>
                <td>₹{student.amountPaid || 0}</td>
              </tr>
              <tr>
                <th>Pending Amount</th>
                <td>
                  <span className={`badge ${(student.pendingAmount || 0) > 0 ? 'bg-danger' : 'bg-success'}`}>
                    ₹{student.pendingAmount || 0}
                  </span>
                </td>
              </tr>
              <tr>
                <th>Payment Status</th>
                <td>{yesNoBadge(student.feesPaid)}</td>
              </tr>
            </tbody>
          </table>

          {/* ================= FEE RECEIPT ================= */}
          <h6 className="fw-bold border-bottom pb-2 mb-3">
            Fee Receipt
          </h6>
          <div className="mb-4">
            <button 
              className="btn btn-primary me-2" 
              onClick={() => setShowReceipt(!showReceipt)}
            >
              {showReceipt ? 'Hide Receipt' : 'View/Print Receipt'}
            </button>
          </div>
          
          {showReceipt && (
            <div className="card mb-4">
              <div className="card-body">
                <div ref={printRef}>
                  <div className="receipt" style={{ maxWidth: '490px', margin: '0 auto', border: '4px solid #25D366', padding: '10px', background: '#fff' }}>
                    <div style={{ background: '#25D366', color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: '16px', padding: '8px 0', borderRadius: '10px', marginBottom: '5px' }}>
                      SHREE GANPATI COMPUTER AND STUDY CENTRE
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '13px', marginBottom: '10px', color: '#444' }}>
                      <u>RAIPUR CHIRAIYAKOT MAU</u>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div style={{ width: '90px' }}>
                        <img 
                          src={student.photo || DEFAULT_AVATAR_SVG}
                          alt="Student"
                          style={{ width: '90px', height: '90px', border: '1px solid #000', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ flex: 1, marginLeft: '10px' }}>
                        <div style={{ marginBottom: '3px' }}>
                          <strong>Student's Name:</strong> {student.name || 'N/A'}
                        </div>
                        <div style={{ marginBottom: '3px' }}>
                          <strong>Father's Name:</strong> {student.fatherName || 'N/A'}
                        </div>
                        <div style={{ marginBottom: '3px' }}>
                          <strong>Course Name:</strong> {student.courseName || 'N/A'}
                        </div>
                        <div style={{ marginBottom: '3px' }}>
                          <strong>Receipt No:</strong> {receiptNo}
                        </div>
                        <div style={{ background: '#25D366', color: '#fff', textAlign: 'center', fontWeight: 'bold', padding: '8px 0', borderRadius: '30px', marginTop: '8px' }}>
                          STUDENT'S FEE RECEIPT
                        </div>
                      </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                      <thead>
                        <tr>
                          <th style={{ border: '1px solid #000', padding: '3px' }}>Month</th>
                          <th style={{ border: '1px solid #000', padding: '3px' }}>Date</th>
                          <th style={{ border: '1px solid #000', padding: '3px' }}>Paid</th>
                          <th style={{ border: '1px solid #000', padding: '3px' }}>Due</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(monthlyData).map((monthIndex) => (
                          <tr key={monthIndex}>
                            <td style={{ border: '1px solid #000', padding: '3px', textAlign: 'center' }}>{months[monthIndex]}</td>
                            <td style={{ border: '1px solid #000', padding: '3px', textAlign: 'center' }}>{monthlyData[monthIndex]?.date || '-'}</td>
                            <td style={{ border: '1px solid #000', padding: '3px', textAlign: 'center' }}>{monthlyData[monthIndex]?.paid || 0}</td>
                            <td style={{ border: '1px solid #000', padding: '3px', textAlign: 'center' }}>{monthlyData[monthIndex]?.due || 0}</td>
                          </tr>
                        ))}
                        <tr>
                          <th style={{ border: '1px solid #000', padding: '3px' }}>Total</th>
                          <th style={{ border: '1px solid #000', padding: '3px' }}>-</th>
                          <th style={{ border: '1px solid #000', padding: '3px' }}>{totalPaid}</th>
                          <th style={{ border: '1px solid #000', padding: '3px' }}>{totalDue}</th>
                        </tr>
                      </tbody>
                    </table>

                    <div style={{ marginTop: '10px', fontSize: '10px' }}>
                      Received By: ............................................................ All fees are non-refundable
                    </div>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <button className="btn btn-success" onClick={handlePrint}>
                    Download/Print Receipt
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= ACCOUNT / STATUS ================= */}
          <h6 className="fw-bold border-bottom pb-2 mb-3">
            Account & Status
          </h6>
          <table className="table table-bordered mb-0">
            <tbody>
              <tr>
                <th>Username</th>
                <td>{student.username || "-"}</td>
              </tr>
              <tr>
                <th>Certified</th>
                <td>{yesNoBadge(student.isCertified)}</td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}
