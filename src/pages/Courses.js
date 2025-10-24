import { useEffect, useState } from 'react';
import API from '../utils/api';

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
    <div>
      <h1>Courses</h1>
      {courses.length === 0 && <p>No courses available.</p>}
      {courses.map(course => (
        <div key={course._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h2>{course.title}</h2>
          <p>{course.description}</p>
          <p>{course.duration}</p>
          <img src={`http://localhost:5000/uploads/${course.image}`} alt={course.title} width="200" />
        </div>
      ))}
    </div>
  );
}
