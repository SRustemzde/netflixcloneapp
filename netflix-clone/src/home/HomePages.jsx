import React, { useState, useEffect, useRef } from "react";
import "./HomePage.css";
import { Homes as HeroHomes } from "../components/homes/Homes";
import { Upcomming } from "../components/Upcomming/Upcomming";
import { Trending } from "../components/trending/Trending";


export const HomePages = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef([]);

  // Scroll effects and intersection observer
  useEffect(() => {

    const handleScroll = () => {
      const scrolled = window.scrollY;
      setShowScrollTop(scrolled > 500);
    };

    const observerOptions = {
      threshold: 0.3,
      rootMargin: "-10% 0px -10% 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sectionRefs.current.indexOf(entry.target);
          if (index !== -1) setActiveSection(index);
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (index) => {
    if (sectionRefs.current[index]) {
      sectionRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };


  return (
    <div className="homepage">
      {/* Fixed Background Elements */}
      <div className="fixed-background">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
      </div>

      {/* Trending Movies Section */}
      <Trending />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="scroll-top-btn"
          aria-label="Scroll to top"
        >
          ↑<div className="scroll-top-pulse"></div>
        </button>
      )}
    </div>
  );
};
