import Hero from '../components/HeroSection';

export default function Home() {
  const recentStudents = [
    { name: "Rahul Sharma", img: "https://via.placeholder.com/150", desc: "Joined ADCA course" },
    { name: "Anjali Verma", img: "https://via.placeholder.com/150", desc: "Joined DCA course" },
    { name: "Vikram Singh", img: "https://via.placeholder.com/150", desc: "Joined MCA course" },
    { name: "Pooja Gupta", img: "https://via.placeholder.com/150", desc: "Joined PDCA course" },
  ];

  const certifiedStudents = [
    { name: "Rakesh Kumar", img: "https://via.placeholder.com/150", desc: "Certified in ADIT" },
    { name: "Neha Patel", img: "https://via.placeholder.com/150", desc: "Certified in DOAP" },
    { name: "Amit Joshi", img: "https://via.placeholder.com/150", desc: "Certified in DSPP" },
    { name: "Sonia Rao", img: "https://via.placeholder.com/150", desc: "Certified in ADCP" },
  ];

  const instituteMembers = [
    { name: "Dr. Ashok Singh", img: "https://via.placeholder.com/150", desc: "Director" },
    { name: "Mrs. Rekha Sharma", img: "https://via.placeholder.com/150", desc: "Course Coordinator" },
    { name: "Mr. Manoj Verma", img: "https://via.placeholder.com/150", desc: "Head Trainer" },
    { name: "Ms. Priya Tiwari", img: "https://via.placeholder.com/150", desc: "Admin Officer" },
  ];

  const affiliations = [
    { name: "ABC Institute", img: "https://via.placeholder.com/150", desc: "Partner Institution" },
    { name: "XYZ University", img: "https://via.placeholder.com/150", desc: "Accredited University" },
    { name: "LMN Education Board", img: "https://via.placeholder.com/150", desc: "Affiliated Board" },
    { name: "PQR Academy", img: "https://via.placeholder.com/150", desc: "Collaborating Academy" },
  ];

  const renderCardSection = (title, data) => (
    <section className="container py-5">
      <h3 className="text-center fw-bold mb-4">{title}</h3>
      <div className="row text-center">
        {data.map((item, index) => (
          <div className="col-sm-6 col-md-3 mb-4" key={index}>
            <div className="card border-0 shadow-sm h-100">
              <img
                src={item.img}
                alt={item.name}
                className="card-img-top"
                style={{ borderRadius: "10px", height: "180px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h6 className="fw-semibold">{item.name}</h6>
                <p className="text-muted small">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <section className="container mt-5">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h2 className="fw-bold mb-3">About SGCSC</h2>
            <p className="lead">
              SGCSC is your premier learning center, offering professional courses designed to enhance skills, boost career growth, and empower you for success.
            </p>
            <p>
              Our courses are carefully curated with industry experts to ensure hands-on learning and real-world application.
            </p>
          </div>
          <div className="col-md-6 text-center">
            <img
              src="/images/about-illustration.png"
              alt="About SGCSC"
              className="img-fluid rounded shadow"
            />
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="bg-light py-5 mt-5">
        <div className="container">
          <h3 className="text-center fw-bold mb-4">Why Choose Us</h3>
          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <div className="card border-0 shadow h-100">
                <div className="card-body">
                  <i className="bi bi-award fs-1 text-primary mb-3"></i>
                  <h5 className="card-title fw-bold">Expert Instructors</h5>
                  <p className="card-text">Learn from experienced professionals with real-world expertise.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card border-0 shadow h-100">
                <div className="card-body">
                  <i className="bi bi-people fs-1 text-primary mb-3"></i>
                  <h5 className="card-title fw-bold">Interactive Learning</h5>
                  <p className="card-text">Engage in hands-on sessions, projects, and practical training.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card border-0 shadow h-100">
                <div className="card-body">
                  <i className="bi bi-graph-up fs-1 text-primary mb-3"></i>
                  <h5 className="card-title fw-bold">Career Growth</h5>
                  <p className="card-text">Our courses are designed to boost employability and career advancement.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Sections with Dummy Images and Text */}
      {renderCardSection("Recent Join Students", recentStudents)}
      {renderCardSection("Certified Students", certifiedStudents)}
      {renderCardSection("Our Institute Members", instituteMembers)}
      {renderCardSection("Our Affiliations", affiliations)}
    </div>
  );
}
