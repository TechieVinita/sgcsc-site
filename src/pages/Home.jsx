import React, { useEffect, useState } from "react";
import Hero from "../components/HeroSection";
import homeImg from "../assets/images/home-page-img.png";
import api from "../api/axiosInstance";
import "./Home.css";

/* =====================
   BASE URL (NO /api)
   ===================== */
const BACKEND_BASE_URL =
  process.env.REACT_APP_API_BASE_URL
    ? process.env.REACT_APP_API_BASE_URL.replace(/\/api\/?$/, "")
    : "http://localhost:5000";

/* =====================
   IMAGE RESOLVER
   ===================== */
const resolveImage = (img) => {
  if (!img) return "/images/no-image.png";

  if (img.startsWith("http")) return img;

  if (img.startsWith("/uploads")) {
    return `${BACKEND_BASE_URL}${img}`;
  }

  return `${BACKEND_BASE_URL}/uploads/${img}`;
};

/* =====================
   SAFE ARRAY EXTRACTOR
   ===================== */
const extractArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  return [];
};

export default function Home() {
  const [recentStudents, setRecentStudents] = useState([]);
  const [certifiedStudents, setCertifiedStudents] = useState([]);
  const [members, setMembers] = useState([]);
  const [affiliations, setAffiliations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* =====================
     FETCH HOME DATA
     ===================== */
  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const [
          recentRes,
          certifiedRes,
          membersRes,
          affRes,
        ] = await Promise.all([
          api.get("/students/recent-home"),
          api.get("/students/certified-home"),
          api.get("/members"),
          api.get("/gallery", { params: { category: "affiliation" } }),
        ]);

        if (!active) return;

        setRecentStudents(extractArray(recentRes.data));
        setCertifiedStudents(extractArray(certifiedRes.data));
        setMembers(extractArray(membersRes.data));
        setAffiliations(extractArray(affRes.data));
      } catch (err) {
        if (active) {
          setError(
            err?.response?.data?.message ||
              err.message ||
              "Failed to load home data"
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  /* =====================
     NORMALIZED ITEMS
     ===================== */
  const recentItems = recentStudents.slice(0, 5).map((s) => ({
    name: s.name,
    subtitle: "Joined course",
    img: resolveImage(s.photo),
  }));

  const certifiedItems = certifiedStudents.slice(0, 5).map((s) => ({
    name: s.name,
    subtitle: "Certified student",
    img: resolveImage(s.photo),
  }));

  const memberItems = members
    .filter((m) => m.isActive !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .slice(0, 5)
    .map((m) => ({
      name: m.name,
      subtitle: m.designation || "",
      img: resolveImage(m.photoUrl),
    }));

  const affiliationItems = affiliations.slice(0, 5).map((a) => ({
    id: a._id,
    name: a.title || "Affiliation",
    img: resolveImage(a.image),
  }));

  /* =====================
     GRID RENDERER
     ===================== */
  const renderGrid = (title, items, rounded = true) => {
    if (!items.length) return null;

    return (
      <section className="container py-5">
        <h3 className="fw-bold text-center mb-4">{title}</h3>

        <div className="row justify-content-center">
          {items.map((item, i) => (
            <div
              key={i}
              className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4 d-flex justify-content-center"
            >
              <div
                className="card border-0 shadow-sm text-center"
                style={{ width: 180 }}
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className={`card-img-top mx-auto mt-3 ${
                    rounded ? "rounded-circle" : ""
                  }`}
                  style={{
                    width: rounded ? 90 : "100%",
                    height: rounded ? 90 : 140,
                    objectFit: "cover",
                  }}
                />
                <div className="card-body p-2">
                  <h6 className="fw-bold mb-1">{item.name}</h6>
                  <p className="small text-muted mb-0">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  /* =====================
     RENDER
     ===================== */
  return (
    <div>
      <Hero />

      {/* About */}
      <section className="container mt-5">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h2 className="fw-bold mb-3">About SGCSC</h2>
            <p className="lead">
              <strong>SHREE GANPATI COMPUTER AND STUDY CENTRE</strong> —
              Autonomous Regd. Under Public Trust Act 1882.
            </p>
            <p>
              Registered Under NITI Aayog & Ministry of MSME Govt. of India.
              ISO 9001:2015 Certified Organization.
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

      {loading && (
        <div className="text-center text-muted mt-4">
          Loading content…
        </div>
      )}

      {error && (
        <div className="text-center text-danger mt-4">
          {error}
        </div>
      )}

      {renderGrid("Recent Join Students", recentItems)}
      {renderGrid("Certified Students", certifiedItems)}
      {renderGrid("Our Institute Members", memberItems)}
      {renderGrid("Our Affiliations", affiliationItems, false)}
    </div>
  );
}
