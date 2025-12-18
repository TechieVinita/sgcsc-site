import { useEffect, useState } from "react";
import API from "../api/axiosInstance";

export default function Courses() {
  /**
   * courses shape:
   * {
   *   "Long Term Courses": ["ADCA", "DCA"],
   *   "Short Term Courses": ["CCC", "DTP"]
   * }
   */
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true; // prevents state update after unmount

    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await API.get("/courses");

        // ✅ Normalize response
        const data =
          res?.data && typeof res.data === "object" && !Array.isArray(res.data)
            ? res.data
            : {};

        if (isMounted) {
          setCourses(data);
        }
      } catch (err) {
        console.error("Fetch courses failed:", err);

        if (isMounted) {
          setError("Failed to load courses. Please try again later.");
          setCourses({});
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ===================== STATES ===================== */

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

  const categories = Object.entries(courses).filter(
    ([, list]) => Array.isArray(list) && list.length > 0
  );

  if (categories.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <p className="text-muted">No courses available</p>
      </div>
    );
  }

  /* ===================== RENDER ===================== */

  return (
    <div className="container mt-5">
      <h1 className="fw-bold mb-4">Our Courses</h1>

      {categories.map(([category, list]) => (
        <section
          key={category}
          className="mb-5"
          id={category.replace(/\s+/g, "-").toLowerCase()}
        >
          <h3 className="fw-bold mb-3">{category}</h3>

          <div className="row">
            {list.map((course, index) => (
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
