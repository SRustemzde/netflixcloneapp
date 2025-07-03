import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "feedback",
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({
    submitted: false,
    success: false,
    message: "",
  });

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      errors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Simulate form submission
    setSubmitStatus({
      submitted: true,
      success: true,
      message:
        "Thank you for your message! Our team will get back to you shortly.",
    });

    // In a real application, you would send the data to your backend here
    console.log("Form submitted with data:", formData);

    // Reset form after successful submission
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
      category: "feedback",
    });

    // Reset submission status after 5 seconds
    setTimeout(() => {
      setSubmitStatus({
        submitted: false,
        success: false,
        message: "",
      });
    }, 5000);
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <div className="contact-header-content">
          <h1>Contact Us</h1>
          <p>We're here to help and listen to your feedback</p>
        </div>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          <div className="contact-info-header">
            <h2>Get in Touch</h2>
            <p>
              Have questions or feedback? Our team is ready to assist you with
              any inquiries about our streaming service.
            </p>
          </div>

          <div className="contact-methods">
            <div className="contact-method">
              <div className="contact-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="contact-details">
                <h3>Email Us</h3>
                <p>support@purplestream.com</p>
                <p>For business inquiries: business@purplestream.com</p>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon">
                <i className="fas fa-phone-alt"></i>
              </div>
              <div className="contact-details">
                <h3>Call Us</h3>
                <p>+1 (555) 123-4567</p>
                <p>Mon-Fri: 9:00 AM - 8:00 PM</p>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon">
                <i className="fas fa-comments"></i>
              </div>
              <div className="contact-details">
                <h3>Live Chat</h3>
                <p>Available 24/7</p>
                <button className="chat-button">Start Chat</button>
              </div>
            </div>
          </div>

          <div className="social-media">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="#" className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-discord"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="contact-form-container">
          <div className="contact-form-header">
            <h2>Send Us a Message</h2>
            <p>We'd love to hear from you. Please fill out the form below.</p>
          </div>

          {submitStatus.submitted && (
            <div
              className={`form-submit-message ${
                submitStatus.success ? "success" : "error"
              }`}
            >
              <i
                className={
                  submitStatus.success
                    ? "fas fa-check-circle"
                    : "fas fa-exclamation-circle"
                }
              ></i>
              <p>{submitStatus.message}</p>
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className={formErrors.name ? "error" : ""}
              />
              {formErrors.name && (
                <span className="error-message">{formErrors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className={formErrors.email ? "error" : ""}
              />
              {formErrors.email && (
                <span className="error-message">{formErrors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="feedback">General Feedback</option>
                <option value="technical">Technical Support</option>
                <option value="billing">Billing Issues</option>
                <option value="content">Content Request</option>
                <option value="complaint">Complaint</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help you?"
                className={formErrors.subject ? "error" : ""}
              />
              {formErrors.subject && (
                <span className="error-message">{formErrors.subject}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Please provide as much detail as possible..."
                rows="6"
                className={formErrors.message ? "error" : ""}
              ></textarea>
              {formErrors.message && (
                <span className="error-message">{formErrors.message}</span>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button">
                Send Message
              </button>
            </div>
          </form>

          <div className="form-note">
            <p>
              <i className="fas fa-lock"></i> Your information is secure and
              will only be used to respond to your inquiry.
            </p>
          </div>
        </div>
      </div>

      <div className="faq-section">
        <div className="faq-header">
          <h2>Frequently Asked Questions</h2>
          <p>Find quick answers to common questions</p>
        </div>

        <div className="faq-items">
          <div className="faq-item">
            <h3>How can I reset my password?</h3>
            <p>
              You can reset your password by clicking on the "Forgot Password"
              link on the login page, or through your Account settings.
            </p>
          </div>

          <div className="faq-item">
            <h3>Why am I experiencing buffering issues?</h3>
            <p>
              Buffering can occur due to internet connection problems, device
              limitations, or high traffic on our servers. Try refreshing the
              page or checking your internet connection.
            </p>
          </div>

          <div className="faq-item">
            <h3>How do I update my payment method?</h3>
            <p>
              You can update your payment information in the "Account" section
              under "Billing Information".
            </p>
          </div>

          <div className="faq-item">
            <h3>Can I download content to watch offline?</h3>
            <p>
              Yes! Premium and Plus subscribers can download content for offline
              viewing on mobile devices through our app.
            </p>
          </div>
        </div>

        <div className="faq-more">
          <a href="/faq">
            View all FAQs <i className="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
