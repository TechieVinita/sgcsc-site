import { useEffect, useState } from 'react';
import API from '../api/api';

export default function Gallery() {
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await API.get('/gallery');
        setGallery(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div className="container my-5">
      <h1 className="mb-4 text-center">Gallery</h1>
      <div className="row g-3">
        {gallery.length === 0 && <p className="text-center">No images yet.</p>}
        {gallery.map(item => (
          <div className="col-sm-6 col-md-4 col-lg-3" key={item._id}>
            <div className="card shadow-sm">
              <div className="position-relative overflow-hidden">
                <img 
                  src={`http://localhost:5000/uploads/${item.image}`} 
                  alt={item.title} 
                  className="card-img-top" 
                  style={{ height: '200px', objectFit: 'cover', transition: 'transform 0.3s' }}
                />
                <div 
                  className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-white"
                  style={{ backgroundColor: 'rgba(0,0,0,0.5)', opacity: 0, transition: 'opacity 0.3s' }}
                >
                  <h5 className="text-center">{item.title}</h5>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
