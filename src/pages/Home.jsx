// src/pages/Home.jsx
import React, { useRef } from 'react';
import Hero from '../components/HeroSection';
import homeImg from "../assets/images/home-page-img.png";

/**
 * NOTE:
 * - The local sample image you uploaded is available at:
 *   /mnt/data/58e83842-f724-41ef-b678-0d3ad1e30ed8.png
 *
 *   When you deploy or serve the app, you should move images into your public/uploads
 *   folder (or a CDN) and update the URLs. For local dev we use the path above.
 */

const DEV_UPLOADED_IMAGE = '/mnt/data/58e83842-f724-41ef-b678-0d3ad1e30ed8.png';

export default function Home() {
  // Refs for scrollable sections
  const recentRef = useRef(null);
  const certifiedRef = useRef(null);
  const membersRef = useRef(null);
  const affiliationRef = useRef(null);

  // Scroll function for carousels
  const scroll = (ref, direction) => {
    const { current } = ref;
    if (current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

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
              <strong>SHREE GANPATI COMPUTER AND STUDY CENTRE</strong> — An Autonomous Regd. Under the Public Trust Act 1882 Govt. of India.
            </p>
            <p>
              Registered Under NITI Aayog & Ministry of MSME Govt. of India. An ISO 9001:2015 Certified Organization.
            </p>
          </div>
          <div className="col-md-6 text-center">
            <img
              src={homeImg}
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

      {/* Reusable Carousel Sections */}
      {renderCarouselSection("Recent Join Students", recentRef, scroll, [
        { name: "Rahul Sharma", course: "Joined ADCA course" },
        { name: "Anjali Verma", course: "Joined DCA course" },
        { name: "Vikram Singh", course: "Joined MCA course" },
        { name: "Pooja Gupta", course: "Joined PDCA course" },
        { name: "Amit Yadav", course: "Joined CCC course" },
        { name: "Kiran Das", course: "Joined DIT course" },
      ])}

      {renderCarouselSection("Certified Students", certifiedRef, scroll, [
        { name: "Rakesh Kumar", course: "Certified in ADIT" },
        { name: "Neha Patel", course: "Certified in DOAP" },
        { name: "Amit Joshi", course: "Certified in DSPP" },
        { name: "Sonia Rao", course: "Certified in ADCP" },
        { name: "Rohit Mehta", course: "Certified in DTP" },
        { name: "Meena Sharma", course: "Certified in DCA" },
      ])}

      {renderCarouselSection("Our Institute Members", membersRef, scroll, [
        { name: "Dr. Ashok Singh", course: "Director" },
        { name: "Mrs. Rekha Sharma", course: "Course Coordinator" },
        { name: "Mr. Manoj Verma", course: "Head Trainer" },
        { name: "Ms. Priya Tiwari", course: "Admin Officer" },
        { name: "Mr. Ravi Sahu", course: "Exam Controller" },
        { name: "Ms. Kavita Rao", course: "HR Executive" },
      ])}

      {/* -------------------------
          CHANGED: Our Affiliations
         ------------------------- */}
      <section className="container py-5">
        <h3 className="fw-bold text-center mb-4">Our Affiliations</h3>

        <div className="position-relative">
          {/* Left Button */}
          <button
            className="btn btn-outline-primary position-absolute top-50 start-0 translate-middle-y"
            style={{ zIndex: 5 }}
            onClick={() => scroll(affiliationRef, 'left')}
            aria-label="Scroll left"
          >
            &lt;
          </button>

          {/* Cards Container */}
          <div
            ref={affiliationRef}
            className="d-flex overflow-auto gap-3 px-5"
            style={{
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none'
            }}
            aria-label="Affiliations carousel"
          >
            {/*
              Using the uploaded file path for demo. Replace these URLs with real hosted images
              when moving to production (e.g., /uploads/aff1.jpg or CDN URLs).
            */}
            {[
              {
                name: 'ABC Institute',
                subtitle: 'Partner Institution',
                img: DEV_UPLOADED_IMAGE,
              },
              {
                name: 'XYZ University',
                subtitle: 'Accredited University',
                img: DEV_UPLOADED_IMAGE,
              },
              {
                name: 'LMN Education Board',
                subtitle: 'Affiliated Board',
                img: DEV_UPLOADED_IMAGE,
              },
              {
                name: 'PQR Academy',
                subtitle: 'Collaborating Academy',
                img: DEV_UPLOADED_IMAGE,
              },
              {
                name: 'EduLink India',
                subtitle: 'Training Partner',
                img: DEV_UPLOADED_IMAGE,
              },
              {
                name: 'TechBridge Global',
                subtitle: 'IT Associate',
                img: DEV_UPLOADED_IMAGE,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="card border-0 shadow-sm text-center"
                style={{
                  minWidth: 220,
                  maxWidth: 220,
                  height: 300,
                  flexShrink: 0,
                  borderRadius: 12,
                }}
              >
                {/* Clicking the image opens the original file in a new tab for full-screen view */}
                <a
                  href={item.img}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Open ${item.name} image in new tab`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div
                    style={{
                      height: 140,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingTop: 16,
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      loading="lazy"
                      style={{
                        width: 110,
                        height: 110,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                        border: '6px solid #fff',
                      }}
                    />
                  </div>

                  <div className="card-body p-3 pt-2">
                    <h6 className="card-title fw-bold mb-1">{item.name}</h6>
                    <p className="card-text small text-muted mb-0">{item.subtitle}</p>
                  </div>
                </a>
              </div>
            ))}
          </div>

          {/* Right Button */}
          <button
            className="btn btn-outline-primary position-absolute top-50 end-0 translate-middle-y"
            style={{ zIndex: 5 }}
            onClick={() => scroll(affiliationRef, 'right')}
            aria-label="Scroll right"
          >
            &gt;
          </button>
        </div>
      </section>

      {/* End of Affiliations */}

    </div>
  );
}

// --- Reusable Carousel Section Component (unchanged) ---
function renderCarouselSection(title, ref, scroll, items) {
  return (
    <section className="container py-5">
      <h3 className="fw-bold text-center mb-4">{title}</h3>
      <div className="position-relative">
        {/* Left Button */}
        <button
          className="btn btn-outline-primary position-absolute top-50 start-0 translate-middle-y"
          onClick={() => scroll(ref, 'left')}
          aria-label={`Scroll ${title} left`}
        >
          &lt;
        </button>

        {/* Cards Container */}
        <div
          ref={ref}
          className="d-flex overflow-auto gap-3 px-5"
          style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none' }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="card border-0 shadow-sm text-center"
              style={{
                minWidth: '180px',
                maxWidth: '180px',
                height: '230px',
                flexShrink: 0,
                borderRadius: 10,
              }}
            >
              <img
                src={`https://picsum.photos/seed/${encodeURIComponent(item.name)}/150/150`}
                alt={item.name}
                className="card-img-top rounded-circle mx-auto mt-3"
                style={{ width: '90px', height: '90px', objectFit: 'cover' }}
                loading="lazy"
              />
              <div className="card-body p-2">
                <h6 className="card-title fw-bold mb-1">{item.name}</h6>
                <p className="card-text small text-muted">{item.course}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Button */}
        <button
          className="btn btn-outline-primary position-absolute top-50 end-0 translate-middle-y"
          onClick={() => scroll(ref, 'right')}
          aria-label={`Scroll ${title} right`}
        >
          &gt;
        </button>
      </div>
    </section>
  );
}
