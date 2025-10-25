import { useEffect, useState } from "react";
import API from "../api/api";

export default function Gallery() {
  const [gallery, setGallery] = useState([]);

  const fallbackData = [
    {
      _id: "1",
      title: "Computer Lab Session",
      image:
        "https://images.unsplash.com/photo-1581093588401-22f94d5b62f4?auto=format&fit=crop&w=800&q=80",
    },
    {
      _id: "2",
      title: "Students Receiving Certificates",
      image:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    },
    {
      _id: "3",
      title: "Programming Class",
      image:
        "https://images.unsplash.com/photo-1584697964193-d99e5e4e1b0d?auto=format&fit=crop&w=800&q=80",
    },
    {
      _id: "4",
      title: "Annual Function",
      image:
        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80",
    },
    {
      _id: "5",
      title: "Tally & Accounting Workshop",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    },
    {
      _id: "6",
      title: "Practical Computer Training",
      image:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    },
  ];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await API.get("/gallery");
        // Use fallback if response empty or invalid
        if (!res.data || res.data.length === 0) {
          console.warn("Gallery empty — using fallback images.");
          setGallery(fallbackData);
        } else {
          setGallery(res.data);
        }
      } catch (err) {
        console.error("Error fetching gallery, showing fallback:", err);
        setGallery(fallbackData);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4 fw-bold text-primary">Gallery</h1>
      <p className="text-center text-muted mb-5">
        A glimpse into our institute — where learning meets excellence.
      </p>

      <div className="row g-4">
        {gallery.length === 0 ? (
          <p className="text-center text-secondary">Loading gallery...</p>
        ) : (
          gallery.map((item) => (
            <div className="col-sm-6 col-md-4 col-lg-3" key={item._id}>
              <div
                className="card border-0 shadow-sm overflow-hidden position-relative"
                style={{ borderRadius: "10px" }}
              >
                <img
                  src={
                    item.image.startsWith("http")
                      ? item.image
                      : `http://localhost:5000/uploads/${item.image}`
                  }
                  alt={item.title}
                  className="card-img-top"
                  style={{
                    height: "220px",
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                  onError={(e) => {
                    // In case local image fails
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <div className="card-body text-center bg-light">
                  <h6 className="fw-semibold text-dark mb-0">{item.title}</h6>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
