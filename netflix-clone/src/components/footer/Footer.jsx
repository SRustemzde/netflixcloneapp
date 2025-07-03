import React from "react";
import "./footer.css";

export const Footer = () => {
  return (
    <>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>By Rustemzade</h3>
              <p>Premium viewing experience with the best movies and series.</p>
            </div>

            <div className="footer-links">
              <div className="footer-links-column">
                <h4>Explore</h4>
                <ul>
                  <li>
                    <a href="/">Home</a>
                  </li>
                  <li>
                    <a href="/movies">Movies</a>
                  </li>
                  <li>
                    <a href="/series">TV Shows</a>
                  </li>
                  <li>
                    <a href="/categories">Categories</a>
                  </li>
                </ul>
              </div>

              <div className="footer-links-column">
                <h4>Help</h4>
                <ul>
                  <li>
                    <a href="/account">My Account</a>
                  </li>
                  <li>
                    <a href="/faq">FAQ</a>
                  </li>
                  <li>
                    <a href="/contact">Contact Us</a>
                  </li>
                </ul>
              </div>

              <div className="footer-links-column">
                <h4>Legal</h4>
                <ul>
                  <li>
                    <a href="/privacy">Privacy Policy</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="app-download">
              <h4>Download Our App</h4>
              <div className="store-buttons">
                <a href="#" className="store-button app-store">
                  <i className="fab fa-apple"></i>
                  <div className="store-button-text">
                    <span className="small-text">Download on the</span>
                    <span className="big-text">App Store</span>
                  </div>
                </a>
                <a href="#" className="store-button play-store">
                  <i className="fab fa-google-play"></i>
                  <div className="store-button-text">
                    <span className="small-text">Get it on</span>
                    <span className="big-text">Google Play</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="social-and-copyright">
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
            </div>

            <div className="copyright">
              <p>
                &copy; 2025 By Rustemzade. All rights reserved. All videos and
                shows on this platform are trademarks of, and all related images
                and content are the property of, PurpleFlix Inc.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
