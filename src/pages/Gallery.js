import { useEffect, useState } from 'react';
import API from '../utils/api';

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
    <div>
      <h1>Gallery</h1>
      {gallery.length === 0 && <p>No images yet.</p>}
      {gallery.map(item => (
        <div key={item._id} style={{ margin: '10px 0' }}>
          <h3>{item.title}</h3>
          <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.title} width="300" />
        </div>
      ))}
    </div>
  );
}
