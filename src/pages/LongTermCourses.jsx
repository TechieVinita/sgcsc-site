export default function LongTermCourses() {
  const courses = [
    {
      title: "Advanced Diploma in Computer Applications (ADCA)",
      duration: "1 Year",
      image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=800&q=80",
      desc: "Comprehensive course covering MS Office, Tally, DTP, Internet, and Programming Fundamentals.",
    },
    {
      title: "Advanced Diploma in Information Technology (ADIT)",
      duration: "1 Year",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
      desc: "Learn full-stack development, database management, and IT networking essentials.",
    },
  ];

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold mb-5">Long Term Courses (1 Year)</h2>
      <div className="row g-4">
        {courses.map((course, i) => (
          <div className="col-md-6 col-lg-4" key={i}>
            <div className="card shadow-sm h-100">
              <img src={course.image} className="card-img-top" alt={course.title} />
              <div className="card-body">
                <h5 className="card-title fw-bold">{course.title}</h5>
                <p className="text-muted mb-1">Duration: {course.duration}</p>
                <p className="card-text">{course.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
