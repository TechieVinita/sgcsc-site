import { useState } from 'react';
import API from '../api/api';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/contact', { name, email, message });
      setStatus('Message sent successfully!');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setStatus('Error sending message');
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Contact Us</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          {status && <div className="alert alert-info">{status}</div>}
          <form onSubmit={handleSubmit} className="shadow-sm p-4 rounded bg-white">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input 
                type="text" 
                className="form-control" 
                id="name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input 
                type="email" 
                className="form-control" 
                id="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea 
                className="form-control" 
                id="message" 
                rows="5" 
                value={message} 
                onChange={e => setMessage(e.target.value)} 
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}
