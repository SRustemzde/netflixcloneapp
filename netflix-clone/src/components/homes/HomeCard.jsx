// src/components/homes/HomeCard.jsx

import React from "react";
import { Link } from "react-router-dom";
// Bu component'in kendi CSS'i yok, App.css veya home.css'ten stil alıyor olabilir.

export const HomeCard = ({ item }) => {
  const {
    id, // Backend'den gelen string ObjectId (global ID)
    cover_image_url,
    title,
    rating,
    duration,
    description,
    starring,
    categories, // [{name: "Action"}, ...] formatında
    tags,
    // video_url, // Hero card'da doğrudan video oynatma yok, singlePage'e yönlendiriyor
    source_name, // İçeriğin orijinal dummyData kaynağı
    source_id, // İçeriğin o kaynaktaki orijinal integer ID'si
  } = item || {};

  const coverImageUrlResolved = cover_image_url
    ? cover_image_url.startsWith("/static/")
      ? "/images/home1.jpg" // Static path varsa varsayılan resim kullan
      : cover_image_url
    : "/images/home1.jpg"; // Varsayılan hero kapak

  // SinglePage'e yönlendirirken videos database'den gelen global id kullanılmalı
  const singlePageLink = `/singlePage/content/${id}`;

  const renderParticles = () => {
    const particles = [];
    for (let i = 0; i < 10; i++) {
      const style = {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 10 + 8}s`,
        animationDelay: `${Math.random() * 3}s`,
        width: `${Math.random() * 4 + 2}px`,
        height: `${Math.random() * 4 + 2}px`,
        opacity: Math.random() * 0.4 + 0.2,
      };
      particles.push(<div key={i} className="particle" style={style}></div>);
    }
    return particles;
  };

  const tagList = Array.isArray(tags)
    ? tags
    : typeof tags === "string"
    ? tags.split(", ").map((t) => t.trim())
    : [];
  const genreListString = Array.isArray(categories)
    ? categories.map((c) => c.name).join(", ")
    : "";

  return (
    <div className="box">
      {" "}
      {/* Bu .box Home.css içinde tanımlı */}
      <div className="coverImage">
        <img
          src={coverImageUrlResolved}
          alt={title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/home1.jpg";
          }}
        />
      </div>
      <div className="particles">{renderParticles()}</div>
      <div className="content flex">
        <div className="details row">
          <h1>{title}</h1>
          <div className="rating flex">
            {rating != null && ( // rating 0 olabilir, o yüzden null kontrolü
              <>
                <div className="stars">
                  {[...Array(Math.floor(rating))].map((_, i) => (
                    <i key={`star-${i}`} className="fa fa-star"></i>
                  ))}
                  {rating % 1 >= 0.5 && <i className="fa fa-star-half-alt"></i>}
                  {[...Array(5 - Math.ceil(rating))].map((_, i) => (
                    <i key={`empty-star-${i}`} className="far fa-star"></i>
                  ))}
                </div>
                <label>{rating.toFixed(1)}</label>
              </>
            )}
            {/* GP etiketi kaldırıldı, yerine duration gösterilebilir */}
            {duration && <label>{duration}</label>}
          </div>
          <p className="movie-description">{description}</p>
          <div className="movie-metadata">
            <div className="metadata-badge">
              <i className="fas fa-film"></i>
              <span>HD</span> {/* Varsayılan, API'den gelmiyorsa */}
            </div>
            <div className="metadata-badge">
              <i className="fas fa-closed-captioning"></i>
              <span>Subtitles</span> {/* Varsayılan */}
            </div>
            {tagList.slice(0, 2).map((tag, index) => (
              <div key={index} className="metadata-badge">
                <i className="fas fa-tag"></i>
                <span>{tag}</span>
              </div>
            ))}
          </div>
          <div className="cast">
            {starring && starring.length > 0 && (
              <h4>
                <span>Starring: </span>
                {Array.isArray(starring) ? starring.join(", ") : starring}
              </h4>
            )}
            {genreListString && (
              <h4>
                <span>Genres: </span>
                {genreListString}
              </h4>
            )}
          </div>
          <Link to={singlePageLink}>
            <button className="primary-btn">
              <i className="fas fa-play"></i>WATCH NOW
            </button>
          </Link>
        </div>
        <div className="playButton row">
          <Link to={singlePageLink}>
            <button>
              <div className="img">
                {/* Bu resimlerin public klasöründe olduğundan emin olun */}
                <img src="/images/play-button.png" alt="Play" />
                <img src="/images/play.png" alt="Play" className="change" />
              </div>
              WATCH TRAILER
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
