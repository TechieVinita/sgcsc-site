import Hero from '../components/HeroSection';

export default function Home() {
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
    </div>
  );
}
