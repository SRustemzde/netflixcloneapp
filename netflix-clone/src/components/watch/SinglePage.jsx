// src/components/watch/SinglePage.jsx

import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import apiService from "../../services/api"; // API servisimizi import ediyoruz
import "./style.css"; // Mevcut stil dosyası

export const SinglePage = () => {
  const params = useParams(); // URL'den parametreleri al
  // Route yapısına göre parametreleri belirle
  const source = params.source || 'content'; // Default 'content' if no source
  const id = params.id;
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedContent, setRelatedContent] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const videoRef = useRef(null);
  const trailerRef = useRef(null);

  // Artık statik URL kullanmıyoruz, sadece varsayılan resim için

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsPlaying(false); // Sayfa değiştiğinde videoyu durdur (eğer bir önceki açıksa)
    setLoading(true);
    setError(null);

    const fetchContentDetails = async () => {
      try {
        console.log(`Fetching content for source: ${source}, id: ${id}`);
        
        let fetchedItem;
        if (source === "content" || !source) {
          // New format: /singlePage/content/:id - fetch from videos database
          fetchedItem = await apiService.getContentById(id);
        } else {
          // Old format: /singlePage/:source/:id - fetch by source
          fetchedItem = await apiService.getContentBySource(source, parseInt(id));
        }

        if (fetchedItem) {
          // Handle response format (might be wrapped in success/data)
          const movieData = fetchedItem.success ? fetchedItem.data : fetchedItem;
          
          setItem({
            ...movieData,
            cover_image_url: movieData.cover_image_url || "/images/home1.jpg",
            video_url: movieData.video_url || null,
            trailer_url: movieData.trailer_url || null,
          });

          // Check if movie is in favorites
          try {
            const watchlist = await apiService.getWatchlist();
            const isInWatchlist = watchlist.some(item => item.content && item.content.id === movieData.id);
            setIsFavorite(isInWatchlist);
          } catch (error) {
            console.error('Error checking favorite status:', error);
          }

          // Fetch related content based on similar tags/genres
          try {
            const allContentResponse = await apiService.getAllContent({ limit: 20 });
            if (allContentResponse.success && allContentResponse.data) {
              const allContent = allContentResponse.data;
              const currentTags = movieData.tags || [];
              
              // Find movies with similar tags
              const relatedMovies = allContent
                .filter(movie => {
                  if (movie.id === movieData.id) return false;
                  if (!movie.tags || !Array.isArray(movie.tags)) return false;
                  
                  // Check if any tags match
                  return movie.tags.some(tag => currentTags.includes(tag));
                })
                .slice(0, 4);
              
              // If not enough similar movies, add some random ones
              if (relatedMovies.length < 4) {
                const randomMovies = allContent
                  .filter(movie => 
                    movie.id !== movieData.id && 
                    !relatedMovies.some(rel => rel.id === movie.id)
                  )
                  .slice(0, 4 - relatedMovies.length);
                
                relatedMovies.push(...randomMovies);
              }
              
              setRelatedContent(relatedMovies);
            }
          } catch (relatedError) {
            console.error("Error fetching related content:", relatedError);
            setRelatedContent([]);
          }
        } else {
          setError("Content not found.");
        }
      } catch (err) {
        console.error("Error fetching content details:", err);
        setError(err.message || "Failed to load content details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchContentDetails();
    } else {
      setError("Invalid content identifier.");
      setLoading(false);
    }
  }, [source, id, params]); // Dependencies for URL changes

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current
          .play()
          .catch((e) => console.error("Video play error:", e));
      }
      setIsPlaying(!isPlaying);
    } else if (item && item.video_url) {
      setIsPlaying(true);
    }
  };

  const toggleTrailer = () => {
    if (item && item.trailer_url) {
      setIsTrailerPlaying(!isTrailerPlaying);
      // Close main video if playing
      if (isPlaying) {
        setIsPlaying(false);
      }
    }
  };

  const goBack = () => {
    navigate(-1); // Bir önceki sayfaya git
  };

  const handleFavoriteToggle = async () => {
    if (!item) return;
    
    try {
      setIsLoadingFavorite(true);
      
      if (isFavorite) {
        console.log('🗑️ Removing from watchlist...');
        const result = await apiService.removeFromWatchlist(item.id);
        console.log('Remove result:', result);
        setIsFavorite(false);
      } else {
        console.log('➕ Adding to watchlist...');
        const result = await apiService.addToWatchlist(item.id);
        console.log('Add result:', result);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('❌ Error toggling favorite:', error);
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  if (loading) {
    return (
      <div
        className="loading-container"
        style={{ color: "#fff", textAlign: "center", paddingTop: "100px" }}
      >
        <div className="spinner"></div>
        <p>Loading content details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="error-container"
        style={{ color: "#fff", textAlign: "center", paddingTop: "100px" }}
      >
        <h2>Error</h2>
        <p>{error}</p>
        <button
          onClick={goBack}
          className="back-button"
          style={{
            padding: "10px 20px",
            background: "#e50914",
            border: "none",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!item) {
    return (
      <div
        className="not-found"
        style={{ color: "#fff", textAlign: "center", paddingTop: "100px" }}
      >
        <h2>Content Not Found</h2>
        <p>The movie or TV show you are looking for is not available.</p>
        <button
          onClick={goBack}
          className="back-button"
          style={{
            padding: "10px 20px",
            background: "#e50914",
            border: "none",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="single-page">
      {/* Trailer Section at the Top */}
      {item.trailer_url && (
        <div className="top-trailer-section">
          <div className="trailer-container">
            <iframe
              width="100%"
              height="400"
              src={`${item.trailer_url}?rel=0&modestbranding=1`}
              title={`${item.title} - Official Trailer`}
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="trailer-info">
            <h3>🎬 Official Trailer</h3>
            <p>Watch the official trailer for {item.title}</p>
          </div>
        </div>
      )}

      <div
        className="video-background"
        style={{
          backgroundImage: item.cover_image_url
            ? `url(${item.cover_image_url})`
            : "none",
          backgroundColor: item.cover_image_url ? "transparent" : "#101020", // Kapak resmi yoksa koyu bir arka plan
        }}
      >
        <div className="overlay"></div>
        <div className="content-header">
          <h1>{item.title}</h1>
          <div className="meta-details">
            {item.rating && (
              <div className="rating">
                <span className="stars">★</span> {item.rating.toFixed(1)}
              </div>
            )}
            {item.duration && (
              <div className="time-info">
                <span>{item.duration}</span>
              </div>
            )}
            {item.release_date && (
              <div className="date-info">
                <span>{item.release_date}</span>
              </div>
            )}
          </div>
          {item.categories && item.categories.length > 0 && (
            <div className="genre-badge">
              {item.categories
                .map((cat) => cat.name)
                .slice(0, 3)
                .join(", ")}
            </div>
          )}
          <div className="action-buttons">
            {item.trailer_url && (
              <button className="play-button trailer-btn" onClick={toggleTrailer}>
                <i
                  className={
                    isTrailerPlaying && trailerRef.current && !trailerRef.current.paused
                      ? "fas fa-pause"
                      : "fas fa-play"
                  }
                ></i>
                {isTrailerPlaying && trailerRef.current && !trailerRef.current.paused
                  ? "Pause Trailer"
                  : "Play Trailer"}
              </button>
            )}
            {item.video_url && (
              <button className="play-button movie-btn" onClick={togglePlay}>
                <i
                  className={
                    isPlaying && videoRef.current && !videoRef.current.paused
                      ? "fas fa-pause"
                      : "fas fa-play"
                  }
                ></i>
                {isPlaying && videoRef.current && !videoRef.current.paused
                  ? "Pause Movie"
                  : "Watch Movie"}
              </button>
            )}
            <button 
              className={`add-button ${isFavorite ? 'added' : ''}`}
              onClick={handleFavoriteToggle}
              disabled={isLoadingFavorite}
              title={isFavorite ? 'Remove from My List' : 'Add to My List'}
            >
              <i className={`${isLoadingFavorite ? 'fa-spin fa-spinner' : (isFavorite ? 'fas fa-check' : 'fas fa-plus')}`}></i>
              {isFavorite ? 'In My List' : 'Add to List'}
            </button>
          </div>
        </div>
      </div>

      {isTrailerPlaying && item.trailer_url && (
        <div className="video-player trailer-player">
          <div className="youtube-container">
            <iframe
              width="100%"
              height="600"
              src={`${item.trailer_url}?autoplay=1&rel=0`}
              title={`${item.title} - Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <button 
              className="close-video-btn"
              onClick={() => setIsTrailerPlaying(false)}
              title="Close Trailer"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}

      {isPlaying && item.video_url && (
        <div className="video-player movie-player">
          <video
            ref={videoRef}
            key={item.video_url}
            autoPlay
            controls
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          >
            <source src={item.video_url} type="video/mp4" />
            Your browser does not support video playback.
          </video>
        </div>
      )}

      <div className="content-details">
        <div className="synopsis">
          <h3>Synopsis</h3>
          <p>{item.description || "No synopsis available for this content."}</p>
        </div>

        <div className="movie-info-grid">
          {item.starring && item.starring.length > 0 && (
            <div className="info-section cast">
              <h3>Cast</h3>
              <p>
                {Array.isArray(item.starring)
                  ? item.starring.join(", ")
                  : item.starring}
              </p>
            </div>
          )}

          {item.director && (
            <div className="info-section director">
              <h3>Director</h3>
              <p>{item.director}</p>
            </div>
          )}

          {item.language && (
            <div className="info-section language">
              <h3>Language</h3>
              <p>{item.language}</p>
            </div>
          )}

          {item.country && (
            <div className="info-section country">
              <h3>Country</h3>
              <p>{item.country}</p>
            </div>
          )}

          {item.content_type && (
            <div className="info-section type">
              <h3>Type</h3>
              <p>{item.content_type === "TV_SHOW" ? "TV Show" : "Movie"}</p>
            </div>
          )}

          {item.release_date && (
            <div className="info-section release">
              <h3>Release Date</h3>
              <p>{new Date(item.release_date).toLocaleDateString()}</p>
            </div>
          )}
        </div>

        {item.tags && item.tags.length > 0 && (
          <div className="tags-section">
            <h3>Genres & Tags</h3>
            <div className="tags-list">
              {item.tags.map((tag, index) => (
                <span key={index} className="tag-badge">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {relatedContent.length > 0 && (
        <div className="related-content">
          <h2>Similar Content</h2>
          <div className="related-grid">
            {relatedContent.map((relatedItem) => (
              <Link
                to={`/singlePage/content/${relatedItem.id}`}
                className="related-item"
                key={relatedItem.id}
              >
                <div className="related-poster">
                  {(relatedItem.thumbnail_url || relatedItem.cover_image_url) ? (
                    <img
                      src={relatedItem.thumbnail_url || relatedItem.cover_image_url}
                      alt={relatedItem.title}
                    />
                  ) : (
                    <div className="placeholder-image"></div>
                  )}
                  <div className="poster-overlay">
                    <i className="fas fa-play"></i>
                  </div>
                </div>
                <h4>{relatedItem.title}</h4>
                <div className="related-meta">
                  {relatedItem.rating && (
                    <span>{relatedItem.rating.toFixed(1)} ★</span>
                  )}
                  {relatedItem.duration && <span>{relatedItem.duration}</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      <button onClick={goBack} className="back-button-fixed">
        <i className="fas fa-arrow-left"></i> Go Back
      </button>
    </div>
  );
};
