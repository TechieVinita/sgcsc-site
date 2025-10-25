import { useEffect, useState } from 'react';
import API from '../api/api';

export default function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get('/courses');
        setCourses(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="container my-5">
      <h1 className="mb-4 text-center">Our Courses</h1>
      <div className="row g-4">
        {courses.length === 0 && <p className="text-center">No courses available.</p>}
        {courses.map(course => (
          <div className="col-md-4" key={course._id}>
            <div className="card h-100 shadow-sm">
              <img 
                src={`http://localhost:5000/uploads/${course.image}`} 
                className="card-img-top" 
                alt={course.title} 
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text flex-grow-1">{course.description}</p>
                <p className="text-muted mb-0"><strong>Duration:</strong> {course.duration}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
