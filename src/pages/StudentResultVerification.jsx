import { useState, useEffect } from "react";
import API from "../api/axiosInstance";

export default function StudentResultVerification() {
  const [rollNo, setRollNo] = useState("");
  const [dob, setDob] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Check if student is logged in
  const studentToken = localStorage.getItem("student_token");
  const isLoggedIn = !!studentToken;
  const [myResults, setMyResults] = useState([]);
  const [loadingMyResult, setLoadingMyResult] = useState(false);

  // Fetch logged-in student's results
  useEffect(() => {
    if (isLoggedIn) {
      fetchMyResults();
    }
  }, [isLoggedIn]);

  const fetchMyResults = async () => {
    setLoadingMyResult(true);
    try {
      const res = await API.get("/student-profile/result");
      if (res.data.success) {
        // Handle both single result and array of results
        const data = res.data.data;
        setMyResults(Array.isArray(data) ? data : [data]);
      }
    } catch (err) {
      console.error("Failed to fetch results:", err);
    } finally {
      setLoadingMyResult(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await API.post("/public/result", { rollNo, dob });
      setResult(res.data.data);
    } catch {
      setError("Result not found.");
    } finally {
      setLoading(false);
    }
  };

  // Download single result as PDF
  const downloadSingleResult = (result) => {
    const subjectsList = result.subjects?.map((sub, idx) => `
${idx + 1}. ${sub.subjectName || 'Subject ' + (idx + 1)}
   Max Marks: ${sub.maxMarks || 0} | Min Marks: ${sub.minMarks || 0}
   Marks Obtained: ${sub.marksObtained || 0}
   Practical: ${sub.practicalMarks || 0}/${sub.maxPracticalMarks || 0}
   Grade: ${sub.grade || '-'}
   Status: ${sub.status || '-'}
`).join('\n') || 'No subjects available';

    const content = `
===============================================
              RESULT CERTIFICATE
===============================================

Student Name     : ${result.studentName || '-'}
Roll Number      : ${result.rollNumber || '-'}
Course           : ${result.courseName || '-'}

Exam Session     : ${result.examSession || '-'}
Exam Date        : ${result.examDate ? new Date(result.examDate).toLocaleDateString() : '-'}

-----------------------------------------------
                 MARKS DETAILS
-----------------------------------------------
${subjectsList}

-----------------------------------------------
              OVERALL RESULT
-----------------------------------------------
Total Marks      : ${result.totalMarks || 0}
Obtained Marks   : ${result.totalObtained || 0}
Percentage       : ${result.percentage?.toFixed(2) || 0}%
Overall Grade    : ${result.overallGrade || '-'}
Result Status    : ${result.resultStatus || '-'}

Remarks          : ${result.remarks || '-'}

===============================================
This is a computer-generated document.
Verification can be done on the website.
===============================================
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `result_${result.rollNumber}_${result.examSession || 'result'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download all results
  const downloadAllResults = () => {
    if (!myResults || myResults.length === 0) return;

    let content = "";

    myResults.forEach((result, index) => {
      const subjectsList = result.subjects?.map((sub, idx) => `
  ${idx + 1}. ${sub.subjectName || 'Subject ' + (idx + 1)}
     Max Marks: ${sub.maxMarks || 0} | Min Marks: ${sub.minMarks || 0}
     Marks Obtained: ${sub.marksObtained || 0}
     Practical: ${sub.practicalMarks || 0}/${sub.maxPracticalMarks || 0}
     Grade: ${sub.grade || '-'}
     Status: ${sub.status || '-'}
`).join('\n') || 'No subjects available';

      content += `
===============================================
         RESULT #${index + 1} OF ${myResults.length}
===============================================

Student Name     : ${result.studentName || '-'}
Roll Number      : ${result.rollNumber || '-'}
Course           : ${result.courseName || '-'}

Exam Session     : ${result.examSession || '-'}
Exam Date        : ${result.examDate ? new Date(result.examDate).toLocaleDateString() : '-'}

-----------------------------------------------
                 MARKS DETAILS
-----------------------------------------------
${subjectsList}

-----------------------------------------------
              OVERALL RESULT
-----------------------------------------------
Total Marks      : ${result.totalMarks || 0}
Obtained Marks   : ${result.totalObtained || 0}
Percentage       : ${result.percentage?.toFixed(2) || 0}%
Overall Grade    : ${result.overallGrade || '-'}
Result Status    : ${result.resultStatus || '-'}

      `;
    });

    content += `
===============================================
This is a computer-generated document.
All results for this student are included above.
===============================================
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `all_results_${myResults[0]?.rollNumber || 'student'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // If logged in, show student's own results
  if (isLoggedIn) {
    return (
      <div className="container py-5">
        <h2 className="text-center mb-4">My Results</h2>

        {loadingMyResult ? (
          <div className="text-center">
            <p>Loading your results...</p>
          </div>
        ) : myResults.length > 0 ? (
          <div>
            {myResults.map((result, index) => (
              <div key={index} className="card shadow-sm mb-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Result #{index + 1}: {result.courseName || 'Course'}</h5>
                    <button 
                      className="btn btn-sm btn-outline-primary" 
                      onClick={() => downloadSingleResult(result)}
                    >
                      <i className="bi bi-download me-1"></i> Download
                    </button>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p><strong>Student Name:</strong> {result.studentName}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Roll Number:</strong> {result.rollNumber}</p>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p><strong>Exam Session:</strong> {result.examSession || '-'}</p>
                    </div>
                  </div>

                  <h6 className="border-bottom pb-2 mb-3">Subject Marks</h6>
                  <div className="table-responsive">
                    <table className="table table-bordered table-sm">
                      <thead className="table-light">
                        <tr>
                          <th>Subject</th>
                          <th>Max Marks</th>
                          <th>Min Marks</th>
                          <th>Marks Obtained</th>
                          <th>Practical</th>
                          <th>Grade</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.subjects?.map((sub, idx) => (
                          <tr key={idx}>
                            <td>{sub.subjectName || 'Subject ' + (idx + 1)}</td>
                            <td>{sub.maxMarks || 0}</td>
                            <td>{sub.minMarks || 0}</td>
                            <td>{sub.marksObtained || 0}</td>
                            <td>{sub.practicalMarks || 0}/{sub.maxPracticalMarks || 0}</td>
                            <td>{sub.grade || '-'}</td>
                            <td>
                              <span className={`badge ${sub.status === 'pass' ? 'bg-success' : sub.status === 'fail' ? 'bg-danger' : 'bg-warning'}`}>
                                {sub.status || '-'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <h6 className="border-bottom pb-2 mb-3">Overall Result</h6>
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <p><strong>Total Marks:</strong> {result.totalMarks || 0}</p>
                    </div>
                    <div className="col-md-4">
                      <p><strong>Obtained Marks:</strong> {result.totalObtained || 0}</p>
                    </div>
                    <div className="col-md-4">
                      <p><strong>Percentage:</strong> {result.percentage?.toFixed(2) || 0}%</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <p><strong>Overall Grade:</strong> {result.overallGrade || '-'}</p>
                    </div>
                    <div className="col-md-4">
                      <p>
                        <strong>Result Status:</strong>{" "}
                        <span className={`badge ${result.resultStatus === 'pass' ? 'bg-success' : result.resultStatus === 'fail' ? 'bg-danger' : 'bg-warning'}`}>
                          {result.resultStatus || '-'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {myResults.length > 1 && (
              <div className="text-center mt-4">
                <button className="btn btn-primary" onClick={downloadAllResults}>
                  <i className="bi bi-download me-2"></i>
                  Download All Results
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="alert alert-warning">
            No results found. Please contact your center.
          </div>
        )}
      </div>
    );
  }

  // Public verification form for non-logged-in users
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Result Verification</h2>

      <form onSubmit={handleSubmit} className="card p-4 mx-auto" style={{ maxWidth: 500 }}>
        <input className="form-control mb-3" placeholder="Roll No"
          value={rollNo} onChange={(e) => setRollNo(e.target.value)} />
        <input type="date" className="form-control mb-3"
          value={dob} onChange={(e) => setDob(e.target.value)} />
        <button className="btn btn-primary" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {result && (
        <div className="card mt-4 p-3">
          <p><b>Name:</b> {result.name}</p>
          <p><b>Course:</b> {result.course}</p>
          <p><b>Grade:</b> {result.grade}</p>
          <p><b>Status:</b> {result.status}</p>
        </div>
      )}
    </div>
  );
}
