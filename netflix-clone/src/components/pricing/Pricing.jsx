import React, { useState, useEffect } from "react";
import "./Pricing.css";

const Pricing = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // FAQ items for the pricing page
  const faqItems = [
    {
      question: "Can I change my plan later?",
      answer:
        "Yes, you can upgrade or downgrade your subscription plan at any time. Changes to your subscription will take effect immediately, and you will be charged or credited the prorated difference.",
    },
    {
      question: "How does the billing cycle work?",
      answer:
        "Your subscription begins the day you sign up and continues for the duration of your billing cycle (monthly or annually). You will be automatically billed at the beginning of each billing cycle unless you cancel your subscription.",
    },
    {
      question: "Are there any hidden fees?",
      answer:
        "No, there are no hidden fees. The price displayed for each plan is all-inclusive. However, applicable taxes may be added based on your location.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and direct debit in select regions. For annual subscriptions, we also offer payment by bank transfer.",
    },
    {
      question: "How secure is my payment information?",
      answer:
        "Your payment information is securely processed and encrypted using industry-standard SSL technology. We do not store your credit card details on our servers.",
    },
  ];

  // Plans data
  const plans = [
    {
      id: 1,
      name: "Basic",
      price: "7.99",
      features: [
        "Watch on 1 screen at a time",
        "720p HD available",
        "Unlimited movies and TV shows",
        "Watch on your laptop, TV, phone or tablet",
        "Cancel anytime",
      ],
      recommended: false,
    },
    {
      id: 2,
      name: "Standard",
      price: "12.99",
      features: [
        "Watch on 2 screens at a time",
        "Full HD (1080p) available",
        "Unlimited movies and TV shows",
        "Watch on your laptop, TV, phone or tablet",
        "Cancel anytime",
        "Download on 2 devices",
      ],
      recommended: true,
    },
    {
      id: 3,
      name: "Premium",
      price: "17.99",
      features: [
        "Watch on 4 screens at a time",
        "Ultra HD (4K) and HDR available",
        "Unlimited movies and TV shows",
        "Watch on your laptop, TV, phone or tablet",
        "Cancel anytime",
        "Download on 4 devices",
      ],
      recommended: false,
    },
  ];

  // Toggle FAQ answer
  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Handle subscribe button click
  const handleSubscribe = (plan) => {
    setSelectedPlan(plan);
    setShowConfirmModal(true);
  };

  // Confirm subscription
  const confirmSubscription = () => {
    if (selectedPlan) {
      // Save subscription to localStorage
      localStorage.setItem('userSubscription', JSON.stringify({
        plan: selectedPlan.name,
        price: selectedPlan.price,
        subscribedAt: new Date().toISOString()
      }));
      
      // Dispatch custom event to notify header
      window.dispatchEvent(new CustomEvent('subscriptionChanged', {
        detail: { plan: selectedPlan.name }
      }));
      
      alert(`Successfully subscribed to ${selectedPlan.name} plan!`);
    }
    setShowConfirmModal(false);
    setSelectedPlan(null);
  };

  // Cancel subscription confirmation
  const cancelSubscription = () => {
    setShowConfirmModal(false);
    setSelectedPlan(null);
  };

  // Set animation delay on features list items
  useEffect(() => {
    const featureItems = document.querySelectorAll(".features li");
    featureItems.forEach((item, index) => {
      item.style.setProperty("--i", index);
    });

    // Set loaded state for animations
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="pricing">
      {/* Background orbs for decoration */}
      <div className="pricing-orb pricing-orb-1"></div>
      <div className="pricing-orb pricing-orb-2"></div>

      <div className="container">
        <div className="pricing-header">
          <h1>Choose the plan that's right for you</h1>
          <p>
            Flexible plans for every budget. Cancel anytime. All plans include
            unlimited movies and TV shows.
          </p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card ${
                plan.recommended ? "recommended" : ""
              }`}
            >
              {plan.recommended && (
                <div className="recommended-badge">
                  <i className="fas fa-crown"></i> Most Popular
                </div>
              )}
              <div className="pricing-card-header">
                <h2>{plan.name}</h2>
                <div className="price">
                  <span className="currency">$</span>
                  <span className="amount">{plan.price}</span>
                  <span className="period">/month</span>
                </div>
              </div>
              <div className="pricing-card-body">
                <ul className="features">
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <i className="fas fa-check"></i>
                      {feature}
                      {index === 0 && plan.name === "Premium" && (
                        <span className="feature-tag">Best Value</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pricing-card-footer">
                <button 
                  className="subscribe-btn"
                  onClick={() => handleSubscribe(plan)}
                >
                  Subscribe Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Updated "Every Plan Includes" Section to match screenshot */}
        <div className="additional-features">
          <h2>Every plan includes</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-tv"></i>
              </div>
              <div className="feature-content">
                <h3>Watch Anywhere</h3>
                <p>
                  Stream on your phone, tablet, laptop, TV, or game console.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-download"></i>
              </div>
              <div className="feature-content">
                <h3>Download & Go</h3>
                <p>Save your favorites and watch offline on the mobile app.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-calendar-times"></i>
              </div>
              <div className="feature-content">
                <h3>Cancel Anytime</h3>
                <p>
                  Flexible plans with no long-term contracts or commitments.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-film"></i>
              </div>
              <div className="feature-content">
                <h3>Exclusive Content</h3>
                <p>
                  Access to original shows and movies you can't find anywhere
                  else.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          {faqItems.map((faqItem, index) => (
            <div
              key={index}
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
            >
              <div className="faq-question" onClick={() => toggleFaq(index)}>
                <h3>{faqItem.question}</h3>
                <div className="faq-toggle">
                  <i className="fas fa-plus"></i>
                </div>
              </div>
              <div className="faq-answer">
                <p>{faqItem.answer}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trial Banner */}
        <div className="trial-banner">
          <h2>Start your free 30-day trial today</h2>
          <p>
            Try all features risk-free for 30 days. No credit card required.
          </p>
          <button 
            className="trial-btn"
            onClick={() => handleSubscribe({ name: 'Trial', price: '0.00', features: ['30-day free trial', 'Access to all content', 'Cancel anytime'] })}
          >
            Start Free Trial
          </button>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && selectedPlan && (
          <div className="modal-overlay">
            <div className="confirmation-modal">
              <div className="modal-header">
                <h3>Confirm Subscription</h3>
                <button 
                  className="modal-close"
                  onClick={cancelSubscription}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="modal-body">
                <div className="plan-summary">
                  <div className="plan-icon">
                    <i className="fas fa-crown"></i>
                  </div>
                  <h4>{selectedPlan.name} Plan</h4>
                  <div className="plan-price">
                    <span className="currency">$</span>
                    <span className="amount">{selectedPlan.price}</span>
                    <span className="period">/month</span>
                  </div>
                </div>
                
                <p className="confirmation-text">
                  Are you sure you want to subscribe to the <strong>{selectedPlan.name}</strong> plan for <strong>${selectedPlan.price}/month</strong>?
                </p>
                
                <div className="plan-features-summary">
                  <h5>This plan includes:</h5>
                  <ul>
                    {selectedPlan.features.slice(0, 3).map((feature, index) => (
                      <li key={index}>
                        <i className="fas fa-check"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  className="btn-cancel"
                  onClick={cancelSubscription}
                >
                  Cancel
                </button>
                <button 
                  className="btn-confirm"
                  onClick={confirmSubscription}
                >
                  Yes, Subscribe Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Pricing;
