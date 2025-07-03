// src/components/Upcomming/Upcomming.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { Ucard } from "./Ucard";
import apiService from "../../services/api";
import "./upcomming.css";

// Custom Arrow Components
const NextArrow = ({ onClick, className }) => (
  <button
    className={`upcomming__arrow upcomming__arrow--next ${className || ""}`}
    onClick={onClick}
    aria-label="Next slide"
  >
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
    </svg>
  </button>
);

const PrevArrow = ({ onClick, className }) => (
  <button
    className={`upcomming__arrow upcomming__arrow--prev ${className || ""}`}
    onClick={onClick}
    aria-label="Previous slide"
  >
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
    </svg>
  </button>
);

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="upcomming__loading">
    <div className="upcomming__loading-grid">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="upcomming__skeleton-card">
          <div className="upcomming__skeleton-image">
            <div className="upcomming__skeleton-shimmer"></div>
          </div>
          <div className="upcomming__skeleton-content">
            <div className="upcomming__skeleton-title"></div>
            <div className="upcomming__skeleton-meta"></div>
            <div className="upcomming__skeleton-button"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Error Component
const ErrorDisplay = ({ title, error }) => (
  <div className="upcomming__error">
    <div className="upcomming__error-icon">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
    </div>
    <h3 className="upcomming__error-title">Oops! Something went wrong</h3>
    <p className="upcomming__error-message">
      Error loading {title}: {error}
    </p>
    <button
      className="upcomming__error-retry"
      onClick={() => window.location.reload()}
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
      </svg>
      Try Again
    </button>
  </div>
);

// Empty State Component
const EmptyState = ({ title }) => (
  <div className="upcomming__empty">
    <div className="upcomming__empty-icon">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    </div>
    <h3 className="upcomming__empty-title">No Content Available</h3>
    <p className="upcomming__empty-message">
      No items to display for {title} at the moment.
    </p>
  </div>
);

export const Upcomming = ({ title = "Featured Content", fetchConfig }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const sectionRef = useRef(null);
  const sliderRef = useRef(null);

  // Intersection Observer for animations
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px 0px",
      }
    );

    observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, [isVisible]);

  // Fetch data
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(`Fetching content for ${title || 'Upcoming'}`);
        const params = fetchConfig?.params || { limit: 8 };
        const data = await apiService.getAllContent(params);

        console.log('API Response:', data);

        if (data && data.success && data.data) {
          console.log('Raw data:', data.data);
          // Map API data to component format
          const mappedItems = data.data.map((apiItem) => ({
            id: apiItem._id,
            title: apiItem.title,
            cover_image_url: apiItem.thumbnailUrl,
            rating: apiItem.rating,
            duration: apiItem.duration || "N/A",
            categories: apiItem.genre || [],
            source_name: "content",
            source_id: apiItem._id,
          }));

          console.log('Mapped items:', mappedItems);
          setItems(mappedItems);
        } else {
          console.log('No data or unsuccessful response:', data);
          setItems([]);
        }
      } catch (err) {
        console.error(`Error fetching ${title || 'content'}:`, err);
        setError(err.message || "Failed to fetch items.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [title, fetchConfig]);

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: items.length > 4,
    speed: 600,
    slidesToShow: Math.min(items.length, 4),
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: items.length > 1,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    pauseOnFocus: true,
    cssEase: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    dotsClass: "upcomming__dots",
    beforeChange: (current, next) => setActiveSlide(next),
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: Math.min(items.length, 3),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: Math.min(items.length, 2),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          centerMode: true,
          centerPadding: "40px",
        },
      },
    ],
  };

  const sectionId = `section-${(title || "content").replace(/\s+/g, "-").toLowerCase()}`;

  // Generate section badge color based on title
  const getSectionTheme = (title) => {
    const themes = {
      "coming soon": "orange",
      "new releases": "green",
      trending: "purple",
      "just for you": "blue",
      recommended: "pink",
    };

    const lowerTitle = (title || "").toLowerCase();
    for (const [key, theme] of Object.entries(themes)) {
      if (lowerTitle.includes(key)) return theme;
    }
    return "purple"; // default
  };

  const theme = getSectionTheme(title);

  return (
    <section
      id={sectionId}
      ref={sectionRef}
      className={`upcomming ${
        isVisible ? "upcomming--visible" : ""
      } upcomming--${theme}`}
    >
      {/* Background Effects */}
      <div className="upcomming__bg-effects">
        <div className="upcomming__bg-orb upcomming__bg-orb--1"></div>
        <div className="upcomming__bg-orb upcomming__bg-orb--2"></div>
        <div className="upcomming__bg-orb upcomming__bg-orb--3"></div>
      </div>

      {/* Animated Grid Pattern */}
      <div className="upcomming__grid-pattern"></div>

      <div className="upcomming__container">
        {/* Section Header */}
        <div className="upcomming__header">
          <div className="upcomming__title-wrapper">
            <div className="upcomming__badge">
              <span className="upcomming__badge-icon">
                {theme === "orange" && "🔥"}
                {theme === "green" && "✨"}
                {theme === "purple" && "📈"}
                {theme === "blue" && "💎"}
                {theme === "pink" && "❤️"}
              </span>
              <span className="upcomming__badge-text">
                {theme === "orange" && "Hot"}
                {theme === "green" && "Fresh"}
                {theme === "purple" && "Trending"}
                {theme === "blue" && "Curated"}
                {theme === "pink" && "Popular"}
              </span>
            </div>

            <h2 className="upcomming__title">
              <span className="upcomming__title-text">{title}</span>
              <div className="upcomming__title-underline"></div>
            </h2>

            <p className="upcomming__subtitle">
              {theme === "orange" && "Merakla beklenen yeni içerikler"}
              {theme === "green" && "En son eklenen taze içerikler"}
              {theme === "purple" && "Şu anda en çok izlenen içerikler"}
              {theme === "blue" && "Size özel seçilmiş kaliteli içerikler"}
              {theme === "pink" && "En beğenilen popüler içerikler"}
            </p>
          </div>

          {/* View All Button */}
          {!loading && !error && items.length > 0 && (
            <Link
              to={`/category/${fetchConfig?.params?.source_name || "all"}`}
              className="upcomming__view-all"
            >
              <span>View All</span>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              </svg>
              <div className="upcomming__view-all-shimmer"></div>
            </Link>
          )}
        </div>

        {/* Content Area */}
        <div className="upcomming__content">
          {loading && <LoadingSkeleton />}

          {error && <ErrorDisplay title={title} error={error} />}

          {!loading && !error && items.length === 0 && (
            <EmptyState title={title} />
          )}

          {!loading && !error && items.length > 0 && (
            <div className="upcomming__slider-wrapper">
              {/* Progress Indicator */}
              <div className="upcomming__progress">
                <div
                  className="upcomming__progress-bar"
                  style={{
                    width: `${
                      ((activeSlide + 1) /
                        Math.ceil(items.length / sliderSettings.slidesToShow)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>

              <Slider ref={sliderRef} {...sliderSettings}>
                {items.map((item, index) => (
                  <div key={item.id || index} className="upcomming__slide">
                    <Ucard item={item} />
                  </div>
                ))}
              </Slider>

              {/* Slide Counter */}
              <div className="upcomming__counter">
                <span className="upcomming__counter-current">
                  {activeSlide + 1}
                </span>
                <span className="upcomming__counter-separator">/</span>
                <span className="upcomming__counter-total">
                  {Math.ceil(items.length / sliderSettings.slidesToShow)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Dots (Custom) */}
        {!loading && !error && items.length > 4 && (
          <div className="upcomming__navigation">
            {[...Array(Math.ceil(items.length / 4))].map((_, index) => (
              <button
                key={index}
                className={`upcomming__nav-dot ${
                  activeSlide === index ? "active" : ""
                }`}
                onClick={() => sliderRef.current?.slickGoTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              >
                <div className="upcomming__nav-dot-inner"></div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
