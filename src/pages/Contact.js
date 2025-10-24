import { useState } from 'react';
import API from '../utils/api';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/contact', { name, email, message });
      alert('Message sent!');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      alert('Error sending message');
    }
  };

  return (
    <div>
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <textarea placeholder="Message" value={message} onChange={e => setMessage(e.target.value)} required />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
