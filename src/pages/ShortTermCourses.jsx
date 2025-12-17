import { useEffect, useState } from "react";
import API from "../api/axiosInstance";

export default function LongTermCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const all = await getCourses();
      setCourses(all.filter(c => c.type === "short"));
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <div className="container py-5">Loading courses…</div>;
  }

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold mb-5">
        Long Term Courses (1 Year)
      </h2>

      <div className="row g-4">
        {courses.map(course => (
          <div className="col-md-6 col-lg-4" key={course._id}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="fw-bold">{course.title}</h5>
                {/* <p className="text-muted mb-1">
                  Duration: {course.duration}
                </p> */}
                <p className="card-text">
                  {course.description || "No description available."}
                </p>
              </div>
            </div>
          </div>
        ))}

        {courses.length === 0 && (
          <div className="text-muted text-center">
            No courses available.
          </div>
        )}
      </div>
    </div>
  );
}
