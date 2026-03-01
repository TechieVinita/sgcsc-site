// src/components/SocialStickyBar.jsx
import React, { useState, useEffect } from "react";
import { getSettings } from "../api/api";

export default function SocialStickyBar() {
  const [socialLinks, setSocialLinks] = useState({
    instagram: "",
    twitter: "",
    facebook: "",
    youtube: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      const settings = await getSettings();
      if (settings?.socialLinks) {
        setSocialLinks(settings.socialLinks);
      }
    } catch (err) {
      console.error("Error fetching social links:", err);
    } finally {
      setLoading(false);
    }
  };

  // Check if any social link is configured
  const hasSocialLinks =
    socialLinks.instagram ||
    socialLinks.twitter ||
    socialLinks.facebook ||
    socialLinks.youtube;

  if (loading || !hasSocialLinks) {
    return null;
  }

  return (
    <div className="social-sticky-bar">
      {/* Instagram */}
      {socialLinks.instagram && (
        <a
          href={socialLinks.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon instagram"
          aria-label="Instagram"
        >
          <i className="bi bi-instagram"></i>
        </a>
      )}

      {/* Twitter/X */}
      {socialLinks.twitter && (
        <a
          href={socialLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon twitter"
          aria-label="Twitter"
        >
          <i className="bi bi-twitter-x"></i>
        </a>
      )}

      {/* Facebook */}
      {socialLinks.facebook && (
        <a
          href={socialLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon facebook"
          aria-label="Facebook"
        >
          <i className="bi bi-facebook"></i>
        </a>
      )}

      {/* YouTube */}
      {socialLinks.youtube && (
        <a
          href={socialLinks.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon youtube"
          aria-label="YouTube"
        >
          <i className="bi bi-youtube"></i>
        </a>
      )}

      <style jsx>{`
        .social-sticky-bar {
          position: fixed;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          z-index: 1000;
          background: #fff;
          border-radius: 0 8px 8px 0;
          box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.15);
          overflow: hidden;
        }

        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 45px;
          color: #fff;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 1.2rem;
        }

        .social-icon:hover {
          width: 55px;
          filter: brightness(1.1);
        }

        .social-icon.instagram {
          background: linear-gradient(
            45deg,
            #f09433 0%,
            #e6683c 25%,
            #dc2743 50%,
            #cc2366 75%,
            #bc1888 100%
          );
        }

        .social-icon.twitter {
          background: #000;
        }

        .social-icon.facebook {
          background: #1877f2;
        }

        .social-icon.youtube {
          background: #ff0000;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .social-sticky-bar {
            left: 0;
            top: auto;
            bottom: 20px;
            transform: none;
            flex-direction: row;
            border-radius: 0 8px 8px 0;
          }

          .social-icon {
            width: 40px;
            height: 40px;
            font-size: 1rem;
          }

          .social-icon:hover {
            width: 45px;
          }
        }
      `}</style>
    </div>
  );
}
