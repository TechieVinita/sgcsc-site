import { useEffect, useState } from "react";
import API from "../api/axiosInstance";

export default function Courses() {
  // courses must be an OBJECT, not array
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await API.get("/courses");

        // Defensive: ensure object
        if (res.data && typeof res.data === "object") {
          setCourses(res.data);
        } else {
          setCourses({});
        }
      } catch (err) {
        console.error("Fetch courses failed:", err);
        setError("Failed to load courses");
        setCourses({});
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  /* ===================== RENDER ===================== */

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <p className="text-muted">Loading courses…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  if (Object.keys(courses).length === 0) {
    return (
      <div className="container mt-5 text-center">
        <p className="text-muted">No courses available</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="fw-bold mb-4">Our Courses</h1>

      {Object.entries(courses).map(([category, list]) => (
        <section
          key={category}
          className="mb-5"
          id={category.replace(/\s+/g, "-").toLowerCase()}
        >
          <h3 className="fw-bold mb-3">{category}</h3>

          <div className="row">
            {Array.isArray(list) &&
              list.map((course, index) => (
                <div
                  key={`${category}-${index}`}
                  className="col-md-6 col-lg-4 mb-3"
                >
                  <div className="card h-100 shadow-sm">
                    <div className="card-body d-flex flex-column">
                      <p className="card-text">{course}</p>

                      <button
                        type="button"
                        className="btn btn-primary mt-auto"
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
