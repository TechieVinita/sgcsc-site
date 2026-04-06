// src/pages/FranchiseCertificateList.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";
import { FranchiseLayout } from "./FranchiseStudents";

function fmtDate(d) {
  if (!d) return "-";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "-";
  return dt.toLocaleDateString("en-IN");
}

export default function FranchiseCertificateList() {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("info");


  const [search, setSearch] = useState("");




  const fetchCertificates = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await API.get("/franchise/certificates");
      const arr = Array.isArray(res.data) ? res.data : [];
      setCertificates(arr);
    } catch (err) {
      console.error("fetch certificates", err);
      setMsgType("danger");
      setMsg(err.response?.data?.message || err.userMessage || "Failed to fetch certificates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this certificate?")) return;
    setMsg("");
    try {
      await API.delete(`/franchise/certificates/${id}`);
      setCertificates((prev) => prev.filter((c) => c._id !== id));
      setMsgType("success");
      setMsg("Certificate deleted.");
    } catch (err) {
      console.error("delete certificate", err);
      setMsgType("danger");
      setMsg(err.response?.data?.message || "Failed to delete certificate");
    }
  };

  const filteredCertificates = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return certificates;

    return certificates.filter((c) => {
      const name = (c.name || "").toLowerCase();
      const enrollment = (c.enrollmentNumber || "").toLowerCase();
      const certNumber = (c.certificateNumber || "").toLowerCase();
      const course = (c.courseName || "").toLowerCase();
      return name.includes(q) || enrollment.includes(q) || certNumber.includes(q) || course.includes(q);
    });
  }, [certificates, search]);

  // Print certificate
  const handlePrint = (certificate) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Certificate - ${certificate.certificateNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Times New Roman', serif; padding: 20px; }
            .certificate {
              border: 5px double #1a365d;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
              text-align: center;
              background: #fff;
            }
            .certificate h1 {
              font-size: 32px;
              color: #1a365d;
              margin-bottom: 10px;
              text-transform: uppercase;
            }
            .certificate h2 {
              font-size: 24px;
              color: #2d3748;
              margin: 20px 0;
              font-weight: normal;
            }
            .certificate .subtitle {
              font-size: 18px;
              color: #4a5568;
              margin-bottom: 30px;
            }
            .certificate .content {
              font-size: 16px;
              line-height: 2;
              color: #2d3748;
            }
            .certificate .name {
              font-size: 28px;
              font-weight: bold;
              color: #1a365d;
              margin: 20px 0;
              text-decoration: underline;
            }
            .certificate .details {
              margin: 30px 0;
            }
            .certificate .details table {
              width: 100%;
              border-collapse: collapse;
            }
            .certificate .details td {
              padding: 8px;
              text-align: left;
            }
            .certificate .details td:first-child {
              font-weight: bold;
              width: 40%;
            }
            .certificate .footer {
              margin-top: 40px;
              display: flex;
              justify-content: space-between;
            }
            .certificate .signature {
              text-align: center;
              width: 200px;
            }
            .certificate .signature-line {
              border-top: 1px solid #000;
              margin-top: 50px;
              padding-top: 5px;
            }
            @media print {
              body { padding: 0; }
              .certificate { border: none; }
            }
          </style>
        </head>
        <body>
          <div class="certificate">
            <h1>Certificate of Completion</h1>
            <div class="subtitle">This is to certify that</div>
            <div class="name">${certificate.name}</div>
            <div class="content">
              Son/Daughter of <strong>${certificate.fatherName}</strong>
              <br /><br />
              has successfully completed the course
            </div>
            <h2>${certificate.courseName}</h2>
            <div class="details">
              <table>
                <tbody>
                  <tr>
                    <td>Session:</td>
                    <td>${certificate.sessionFrom} - ${certificate.sessionTo}</td>
                  </tr>
                  <tr>
                    <td>Grade:</td>
                    <td>${certificate.grade}</td>
                  </tr>
                  <tr>
                    <td>Enrollment Number:</td>
                    <td>${certificate.enrollmentNumber}</td>
                  </tr>
                  <tr>
                    <td>Certificate Number:</td>
                    <td>${certificate.certificateNumber}</td>
                  </tr>
                  <tr>
                    <td>Issue Date:</td>
                    <td>${fmtDate(certificate.issueDate)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="footer">
              <div class="signature">
                <div class="signature-line">Director</div>
              </div>
              <div class="signature">
                <div class="signature-line">Principal</div>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <FranchiseLayout>
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h2 className="fw-bold mb-1">Certificates</h2>
            <small className="text-muted">
              Manage certificates for your students
            </small>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search by name / enrollment / certificate no"
              style={{ minWidth: 220 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={fetchCertificates}
              disabled={loading}
            >
              {loading ? "Refreshing…" : "Refresh"}
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate("/franchise/certificates/create")}
            >
              Add Certificate
            </button>
          </div>
        </div>

        {msg && <div className={`alert alert-${msgType}`}>{msg}</div>}

        <div className="card shadow-sm">
          <div className="card-body p-0">
            {loading ? (
              <div className="p-3 text-center">Loading certificates…</div>
            ) : filteredCertificates.length === 0 ? (
              <div className="p-3 text-center text-muted">
                No certificates found.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Student Name</th>
                      <th>Course</th>
                      <th>Enrollment No</th>
                      <th>Certificate No</th>
                      <th>Grade</th>
                      <th>Issue Date</th>
                      <th style={{ width: 140 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCertificates.map((c) => (
                      <tr key={c._id}>
                        <td>
                          <strong>{c.name}</strong>
                          <div className="small text-muted">
                            {c.fatherName && `S/o ${c.fatherName}`}
                          </div>
                        </td>
                        <td>{c.courseName}</td>
                        <td>{c.enrollmentNumber}</td>
                        <td>{c.certificateNumber}</td>
                        <td>
                          <span className="badge bg-success">{c.grade}</span>
                        </td>
                        <td>{fmtDate(c.issueDate)}</td>
                         <td>
                           <button
                             className="btn btn-sm btn-outline-primary me-1"
                             onClick={() => navigate(`/franchise/certificates/view/${c._id}`)}
                           >
                             View
                           </button>
                           <button
                             className="btn btn-sm btn-outline-info me-1"
                             onClick={() => handlePrint(c)}
                           >
                             Print
                           </button>
                           <button
                             className="btn btn-sm btn-outline-danger"
                             onClick={() => handleDelete(c._id)}
                           >
                             Delete
                           </button>
                         </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
    </FranchiseLayout>
  );
}
