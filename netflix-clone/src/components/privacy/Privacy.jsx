import React, { useEffect } from "react";
import "./Privacy.css";

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Animation for section visibility
    const sections = document.querySelectorAll('.section-animated');
    
    // First make sections visible with a small delay for initial rendering
    setTimeout(() => {
      sections.forEach((section, index) => {
        setTimeout(() => {
          section.classList.add('section-visible');
        }, index * 100); // Stagger the animations
      });
    }, 300);
    
    // Also use IntersectionObserver for scrolling animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
        }
      });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
      observer.observe(section);
    });
    
    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <>
      <section className="privacy-hero">
        <div className="container">
          <div className="privacy-hero-content">
            <h1>Privacy Policy</h1>
            <p>Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information.</p>
          </div>
        </div>
      </section>

      <section className="privacy-content">
        <div className="container">
          <div className="privacy-wrapper">
            
            <div className="privacy-section section-animated">
              <h2>Introduction</h2>
              <p>
                Welcome to our Privacy Policy. This policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our streaming service. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
              </p>
              <p>
                We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Last Updated" date of this Privacy Policy. You are encouraged to periodically review this Privacy Policy to stay informed of updates.
              </p>
            </div>
            
            <div className="privacy-section section-animated">
              <h2>Information We Collect</h2>
              <h3>Personal Data</h3>
              <p>
                When you register for an account, we may collect the following types of information:
              </p>
              <ul>
                <li>Name, email address, and contact details</li>
                <li>Billing and payment information</li>
                <li>Account credentials</li>
                <li>Profile information</li>
              </ul>
              
              <h3>Usage Data</h3>
              <p>
                We automatically collect certain information when you visit, use, or navigate our platform. This information does not reveal your specific identity but may include:
              </p>
              <ul>
                <li>Device and browser information</li>
                <li>IP address</li>
                <li>Content viewing history</li>
                <li>Search queries within our platform</li>
                <li>Features you use and the time spent on our platform</li>
              </ul>
            </div>
            
            <div className="privacy-section section-animated">
              <h2>How We Use Your Information</h2>
              <p>We may use the information we collect for various purposes, including:</p>
              <ul>
                <li>To provide and maintain our service</li>
                <li>To process your subscriptions and transactions</li>
                <li>To personalize your experience and deliver content recommendations</li>
                <li>To improve our website and service</li>
                <li>To send you updates, promotional materials, and other information</li>
                <li>To respond to your inquiries and provide customer support</li>
                <li>To detect, prevent, and address technical issues</li>
                <li>To comply with legal obligations</li>
              </ul>
            </div>
            
            <div className="privacy-section section-animated">
              <h2>Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to collect and store information when you use our service. Cookies are small files placed on your device that enable us to: remember your preferences, understand how you use our service, improve your user experience, and deliver relevant advertisements.
              </p>
              <p>
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
              </p>
            </div>
            
            <div className="privacy-section section-animated">
              <h2>Data Sharing and Disclosure</h2>
              <p>We may share your information in the following situations:</p>
              <ul>
                <li><strong>Service Providers:</strong> We may share your information with third-party vendors, service providers, and other partners who perform services on our behalf.</li>
                <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</li>
                <li><strong>Legal Requirements:</strong> We may disclose your information where required to do so by law or in response to valid requests by public authorities.</li>
                <li><strong>Protection:</strong> We may disclose your information to protect the rights, property, or safety of our company, our users, or others.</li>
              </ul>
            </div>
            
            <div className="privacy-section section-animated">
              <h2>Security of Your Information</h2>
              <p>
                We use administrative, technical, and physical security measures to protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
              </p>
            </div>
            
            <div className="privacy-section section-animated">
              <h2>Your Privacy Rights</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal information, such as:
              </p>
              <ul>
                <li>The right to access the personal information we have about you</li>
                <li>The right to request correction of inaccurate information</li>
                <li>The right to request deletion of your personal information</li>
                <li>The right to object to or restrict processing of your information</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent</li>
              </ul>
              <p>
                To exercise these rights, please contact us using the information provided in the "Contact Us" section.
              </p>
            </div>
            
            <div className="privacy-section section-animated">
              <h2>Children's Privacy</h2>
              <p>
                Our service is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we can take necessary actions.
              </p>
            </div>
            
            <div className="privacy-section section-animated">
              <h2>International Data Transfers</h2>
              <p>
                Your information may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction. If you are located outside the United States and choose to provide information to us, please note that we transfer the data to the United States and process it there.
              </p>
            </div>
            
            <div className="privacy-section section-animated">
              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="contact-details">
                <p><strong>Email:</strong> privacy@yourmoviestreamingsite.com</p>
                <p><strong>Address:</strong> 123 Movie Lane, Cinema City, CA 90210</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              </div>
            </div>
            
            <div className="privacy-section section-animated last-updated">
              <p>Last Updated: April 10, 2025</p>
            </div>
            
          </div>
        </div>
      </section>
    </>
  );
};

export default Privacy;