import { useEffect, useState } from "react";
import API from "../api/axiosInstance";

export default function ShortTermCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await API.get("/courses");
      const list = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      return list;
    } catch (err) {
      console.error("getCourses error:", err);
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to load courses"
      );
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const allCourses = await getCourses();
      const shortCourses = allCourses.filter(
        (c) => c.type === "short"
      );
      setCourses(shortCourses);
    })();
  }, []);

  if (loading) {
    return <div className="container py-5">Loading courses…</div>;
  }

  if (error) {
    return (
      <div className="container py-5 text-danger text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold mb-5">
        Short Term Courses (1 Year)
      </h2>

      <div className="row g-4">
        {courses.map((course) => (
          <div className="col-md-6 col-lg-4" key={course._id}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="fw-bold">{course.title}</h5>
                <p className="card-text">
                  {course.description || "No description available."}
                </p>
              </div>
            </div>
          </div>
        ))}

        {courses.length === 0 && (
          <div className="text-muted text-center w-100">
            No courses available.
          </div>
        )}
      </div>
    </div>
  );
}
