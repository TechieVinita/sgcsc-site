export default function CertificateCourses() {
  const courses = [
    {
      title: "Certificate in Computer Basics (CCB)",
      duration: "3 Months",
      image: "https://images.unsplash.com/photo-1549921296-3a6b0d6a51c5?auto=format&fit=crop&w=800&q=80",
      desc: "Perfect for beginners. Covers MS Office, typing, and basic digital literacy.",
    },
    {
      title: "Certificate in Internet & Email (CIE)",
      duration: "3 Months",
      image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=800&q=80",
      desc: "Learn internet usage, email communication, and online safety fundamentals.",
    },
  ];

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold mb-5">Certificate Courses (3 Months)</h2>
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
