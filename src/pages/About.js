import React from 'react';
import Hero from '../components/HeroSection'; // optional hero banner

export default function About() {
  return (
    <div>
      {/* Optional Hero Section */}
      <Hero title="About Us" subtitle="Learn more about SGCSC" />

      <div className="container my-5">
        <h2 className="fw-bold mb-3">About SGCSC</h2>
        <p>
          SHREE GANPATO COMPUTER AND STUDY CENTRE (SGCSC) is dedicated to
          providing high-quality professional courses to enhance your skills
          and boost your career growth. Our mission is to make learning
          accessible, practical, and career-oriented.
        </p>

        <h3 className="fw-semibold mt-4">Our Vision</h3>
        <p>
          To be the most trusted educational center in our region, empowering
          students and professionals with the knowledge and skills to excel
          in their careers.
        </p>

        <h3 className="fw-semibold mt-4">Our Mission</h3>
        <ul>
          <li>Provide quality education and professional training.</li>
          <li>Equip students with practical skills for employment.</li>
          <li>Create a supportive and innovative learning environment.</li>
          <li>Continuously improve our courses and teaching methods.</li>
        </ul>

        <h3 className="fw-semibold mt-4">Why Choose Us?</h3>
        <ul>
          <li>Experienced trainers and faculty.</li>
          <li>Hands-on practical training.</li>
          <li>Wide range of professional courses.</li>
          <li>Support for career development and placements.</li>
        </ul>
      </div>
    </div>
  );
}
