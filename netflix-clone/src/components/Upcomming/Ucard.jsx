// src/components/Upcomming/Ucard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Ucard.css";

export const Ucard = ({ item, isHovered }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Backend'den gelen alan adlarını kullanıyoruz
  const {
    id, // Backend'den gelen string ObjectId
    cover_image_url,
    title,
    duration,
    rating,
    categories, // [{name: "Action"}, ...] formatında liste
    source_name, // İçeriğin orijinal kaynağı
    source_id, // İçeriğin o kaynaktaki orijinal integer ID'si
  } = item || {};

  const imageUrl = cover_image_url
    ? cover_image_url.startsWith("/static/")
      ? "/images/home1.jpg" // Static path varsa varsayılan resim
      : cover_image_url // Tam URL ise (Cloudinary vb.)
    : "/images/home1.jpg"; // Varsayılan kapak resmi

  // Genres listesini oluştur
  const genresList = Array.isArray(categories)
    ? categories.map((cat) => typeof cat === 'string' ? cat : cat.name)
    : [];

  // SinglePage linki için videos database'den gelen global id kullan
  const linkTo = `/singlePage/content/${id}`;

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e) => {
    if (!imageError) {
      setImageError(true);
      e.target.src = "/images/home1.jpg";
    }
  };

  return (
    <div className={`ucard ${isHovered ? "ucard--hovered" : ""}`}>
      <div className="ucard__container">
        {/* Image Container */}
        <div className="ucard__image-container">
          <div
            className={`ucard__image-wrapper ${imageLoaded ? "loaded" : ""}`}
          >
            <img
              src={imageUrl}
              alt={title}
              className="ucard__image"
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
            {!imageLoaded && (
              <div className="ucard__image-skeleton">
                <div className="ucard__skeleton-shimmer"></div>
              </div>
            )}
          </div>

          {/* Quality Badge */}
          <div className="ucard__quality-badge">4K</div>

          {/* Rating Badge */}
          {rating && (
            <div className="ucard__rating-badge">
              <svg
                className="ucard__star-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>{rating.toFixed(1)}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="ucard__action-buttons">
            <button className="ucard__action-btn" aria-label="Add to favorites">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
            <button className="ucard__action-btn" aria-label="Add to watchlist">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            </button>
            <button className="ucard__action-btn" aria-label="More information">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </button>
          </div>

          {/* Play Overlay */}
          <div className="ucard__play-overlay">
            <div className="ucard__play-button">
              <svg
                className="ucard__play-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* Gradient Overlay */}
          <div className="ucard__gradient-overlay"></div>
        </div>

        {/* Content */}
        <div className="ucard__content">
          <div className="ucard__header">
            <h3 className="ucard__title" title={title}>
              {title}
            </h3>

            {/* Meta Information */}
            <div className="ucard__meta">
              {duration && (
                <div className="ucard__duration">
                  <svg
                    className="ucard__clock-icon"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z" />
                  </svg>
                  <span>{duration}</span>
                </div>
              )}

              {genresList.length > 0 && (
                <div className="ucard__genres">
                  {genresList.slice(0, 2).map((genre, i) => (
                    <span key={i} className="ucard__genre-tag">
                      {genre}
                    </span>
                  ))}
                  {genresList.length > 2 && (
                    <span className="ucard__genre-more">
                      +{genresList.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Watch Button */}
          <Link to={linkTo} className="ucard__watch-link">
            <button className="ucard__watch-btn">
              <svg
                className="ucard__watch-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Watch Now</span>
              <div className="ucard__btn-shimmer"></div>
            </button>
          </Link>
        </div>

        {/* Hover Effects */}
        <div className="ucard__glow-effect"></div>
      </div>
    </div>
  );
};
