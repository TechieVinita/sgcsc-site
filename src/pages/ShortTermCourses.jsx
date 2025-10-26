export default function ShortTermCourses() {
  const courses = [
    {
      title: "Diploma in Computer Applications (DCA)",
      duration: "6 Months",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
      desc: "Focused course teaching MS Office, Internet basics, and data management.",
    },
    {
      title: "Diploma in Desktop Publishing (DDTP)",
      duration: "6 Months",
      image: "https://images.unsplash.com/photo-1603575448364-bc0b6a4a4561?auto=format&fit=crop&w=800&q=80",
      desc: "Master Photoshop, CorelDRAW, and Illustrator for creative digital design.",
    },
  ];

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold mb-5">Short Term Courses (6 Months)</h2>
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
