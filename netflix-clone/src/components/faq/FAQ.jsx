import React, { useEffect, useState } from "react";
import "./FAQ.css";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Animation for section visibility
    const sections = document.querySelectorAll(".section-animated");

    // First make sections visible with a small delay for initial rendering
    setTimeout(() => {
      sections.forEach((section, index) => {
        setTimeout(() => {
          section.classList.add("section-visible");
        }, index * 100); // Stagger the animations
      });
    }, 300);

    // Also use IntersectionObserver for scrolling animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("section-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  const toggleAccordion = (index) => {
    // Close any open accordion first for smoother transition
    if (activeIndex !== null && activeIndex !== index) {
      setActiveIndex(null);
      // Small timeout to allow for closing animation before opening the new one
      setTimeout(() => {
        setActiveIndex(index);
      }, 100);
    } else {
      setActiveIndex(activeIndex === index ? null : index);
    }
  };

  const faqData = [
    {
      category: "Subscription & Billing",
      questions: [
        {
          question: "What subscription plans do you offer?",
          answer:
            "We offer three subscription tiers: Basic (SD streaming on 1 device), Standard (HD streaming on 2 devices), and Premium (4K streaming on up to 4 devices simultaneously). Visit our Pricing page for current rates and special offers.",
        },
        {
          question: "How will I be billed?",
          answer:
            "Your subscription fee will be charged to your selected payment method on the same day each month. You can view your billing date and payment history in your Account settings.",
        },
        {
          question: "Can I cancel my subscription anytime?",
          answer:
            "Yes! You can cancel your subscription at any time through your Account settings. Your access will continue until the end of your current billing period, and you won't be charged again.",
        },
        {
          question: "Do you offer a free trial?",
          answer:
            "Yes, new members can enjoy a 14-day free trial. You'll need to provide payment details when signing up, but you won't be charged unless you continue after the trial period.",
        },
      ],
    },
    {
      category: "Streaming & Content",
      questions: [
        {
          question: "What devices can I watch on?",
          answer:
            "You can stream our content on smart TVs, game consoles, streaming media players (like Roku, Apple TV, and Chromecast), smartphones, tablets, computers, and laptops with a compatible browser.",
        },
        {
          question: "Can I download movies to watch offline?",
          answer:
            "Yes, with our Standard and Premium plans, you can download select movies and shows to watch offline on the mobile app. Look for the download icon on titles that support this feature.",
        },
        {
          question: "How often do you add new movies?",
          answer:
            "We update our library weekly with new releases, classics, and exclusive content. Follow our social media channels for announcements about upcoming titles.",
        },
        {
          question: "What video quality do you offer?",
          answer:
            "Depending on your subscription plan and internet connection, you can stream in SD (480p), HD (720p and 1080p), and 4K Ultra HD with HDR. You can adjust quality settings in your account preferences.",
        },
      ],
    },
    {
      category: "Account Management",
      questions: [
        {
          question: "How do I reset my password?",
          answer:
            "Click the 'Forgot Password' link on the login page, enter your email address, and follow the instructions sent to your email to create a new password.",
        },
        {
          question: "Can I share my account with family?",
          answer:
            "Yes, our Standard and Premium plans allow multiple simultaneous streams and user profiles. Each profile gets personalized recommendations and viewing history, but all profiles share the same account credentials.",
        },
        {
          question: "How do I update my payment information?",
          answer:
            "Go to Account > Billing Details to update your payment method, billing address, or other payment information.",
        },
        {
          question: "Can I change my email address?",
          answer:
            "Yes, you can update your email address in Account > Personal Information. For security, you'll need to verify the change through a confirmation link sent to your new email.",
        },
      ],
    },
    {
      category: "Technical Support",
      questions: [
        {
          question: "What internet speed do I need for streaming?",
          answer:
            "We recommend at least 5 Mbps for HD streaming and 25 Mbps for 4K streaming. You can check your connection speed in the app settings or through our website.",
        },
        {
          question: "What should I do if I'm experiencing buffering?",
          answer:
            "First, check your internet connection speed. Try closing other applications using bandwidth, connect to a wired network instead of Wi-Fi if possible, or lower the video quality in your settings. If problems persist, try restarting your device or router.",
        },
        {
          question: "The app is crashing. What should I do?",
          answer:
            "Make sure your app is updated to the latest version. Try closing and reopening the app, or restart your device. If the issue continues, try uninstalling and reinstalling the app.",
        },
        {
          question: "How do I enable or disable subtitles?",
          answer:
            "While watching a video, click or tap on the screen and select the subtitle icon. You can choose from available languages or turn subtitles off. You can also set default subtitle preferences in your account settings.",
        },
      ],
    },
    {
      category: "Content & Recommendations",
      questions: [
        {
          question: "How does your recommendation system work?",
          answer:
            "Our recommendation system analyzes your viewing history, ratings, searches, and preferences to suggest content you might enjoy. The more you watch and interact with the platform, the more personalized your recommendations become.",
        },
        {
          question: "Can I request specific movies to be added?",
          answer:
            "Yes! We welcome your suggestions. You can submit content requests through the 'Request a Title' feature in the app or website, or contact our Customer Support team.",
        },
        {
          question: "How do I rate movies and shows?",
          answer:
            "After watching content, you can rate it by selecting the star rating on the title's details page. Your ratings help us improve your recommendations.",
        },
        {
          question: "How do I add titles to My List?",
          answer:
            "Click or tap the '+' button on any title card or details page to add it to your list. You can access your list anytime from the main navigation menu.",
        },
      ],
    },
  ];

  return (
    <>
      <section className="faq-hero">
        <div className="container">
          <div className="faq-hero-content">
            <h1>Frequently Asked Questions</h1>
            <p>Find answers to common questions about our streaming service</p>
          </div>
        </div>
      </section>

      <section className="faq-content">
        <div className="container">
          <div className="faq-search section-animated">
            <div className="search-container">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Search frequently asked questions..."
                className="search-input"
              />
              <button className="search-button">Search</button>
            </div>
          </div>

          <div className="faq-navigation section-animated">
            <h2>Browse by Category</h2>
            <div className="category-tabs">
              <button
                className={`category-tab ${
                  activeCategory === null ? "active" : ""
                }`}
                onClick={() => setActiveCategory(null)}
              >
                All Categories
              </button>
              {faqData.map((category, index) => (
                <button
                  key={index}
                  className={`category-tab ${
                    activeCategory === index ? "active" : ""
                  }`}
                  onClick={() => setActiveCategory(index)}
                >
                  {category.category}
                </button>
              ))}
            </div>
          </div>

          <div className="faq-wrapper">
            {faqData
              .filter(
                (_, categoryIndex) =>
                  activeCategory === null || activeCategory === categoryIndex
              )
              .map((category, categoryIndex) => {
                // Adjust the categoryIndex to match the original array when filtering
                const originalIndex =
                  activeCategory === null ? categoryIndex : activeCategory;

                return (
                  <div
                    key={originalIndex}
                    className="faq-category section-animated"
                  >
                    <h2>{category.category}</h2>
                    <div className="accordion">
                      {category.questions.map((item, questionIndex) => (
                        <div
                          key={questionIndex}
                          className={`accordion-item ${
                            activeIndex === `${originalIndex}-${questionIndex}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div
                            className="accordion-header"
                            onClick={() =>
                              toggleAccordion(
                                `${originalIndex}-${questionIndex}`
                              )
                            }
                          >
                            <h3>{item.question}</h3>
                            <div className="accordion-icon">
                              <i
                                className={`fas ${
                                  activeIndex ===
                                  `${originalIndex}-${questionIndex}`
                                    ? "fa-minus"
                                    : "fa-plus"
                                }`}
                              ></i>
                            </div>
                          </div>
                          <div
                            className={`accordion-content ${
                              activeIndex ===
                              `${originalIndex}-${questionIndex}`
                                ? "show"
                                : ""
                            }`}
                          >
                            <p>{item.answer}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="contact-support section-animated">
            <h2>Still Have Questions?</h2>
            <p>
              Our customer support team is here to help with any questions not
              answered here.
            </p>
            <div className="support-options">
              <a href="/contact" className="support-option">
                <div className="support-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <h3>Email Support</h3>
                <p>Get a response within 24 hours</p>
              </a>
              <div className="support-option">
                <div className="support-icon">
                  <i className="fas fa-comments"></i>
                </div>
                <h3>Live Chat</h3>
                <p>Available 9am-10pm daily</p>
              </div>
              <div className="support-option">
                <div className="support-icon">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <h3>Phone Support</h3>
                <p>Call us at 1-800-MOVIES</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQ;
