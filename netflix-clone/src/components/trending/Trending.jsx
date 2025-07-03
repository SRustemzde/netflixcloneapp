// src/components/trending/Trending.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiService from "../../services/api";
import "./trending.css";

const AddToListButton = ({ movieId, className = "" }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);

  // Check if movie is in watchlist on mount
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const watchlist = await apiService.getWatchlist();
        const isInWatchlist = watchlist.some(item => item.content.id === movieId);
        setIsFavorite(isInWatchlist);
      } catch (error) {
        console.error('Error checking watchlist status:', error);
      }
    };

    checkFavoriteStatus();
  }, [movieId]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setIsLoadingFavorite(true);
      
      if (isFavorite) {
        await apiService.removeFromWatchlist(movieId);
        setIsFavorite(false);
      } else {
        await apiService.addToWatchlist(movieId);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  return (
    <button 
      className={`btn-add-to-list ${isFavorite ? 'added' : ''} ${className}`}
      onClick={handleToggle}
      disabled={isLoadingFavorite}
      title={isFavorite ? 'Remove from My List' : 'Add to My List'}
    >
      <i className={`${isLoadingFavorite ? 'fa-spin fa-spinner' : (isFavorite ? 'fas fa-check' : 'fas fa-plus')}`}></i>
    </button>
  );
};

const TrendingMovieCard = ({ movie, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="trending-movie-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="trending-movie-poster">
        <img 
          src={movie.cover_image_url || "/images/home1.jpg"} 
          alt={movie.title} 
          loading="lazy"
          onError={(e) => { e.target.src = "/images/home1.jpg"; }}
        />
        <div className="trending-movie-overlay"></div>
        
        {movie.rating && (
          <div className="trending-movie-rating">
            <i className="fas fa-star"></i>
            <span>{movie.rating}</span>
          </div>
        )}

        <div className="trending-movie-rank">
          #{index + 1}
        </div>
        <AddToListButton movieId={movie.id} />
      </div>

      <div className={`trending-movie-content ${isHovered ? "hovered" : ""}`}>
        <h3 className="trending-movie-title">{movie.title}</h3>
        
        <div className="trending-movie-meta">
          <span className="trending-movie-year">{movie.release_date?.split('-')[0] || "2024"}</span>
          <span className="trending-movie-dot"></span>
          <span className="trending-movie-duration">{movie.duration || "N/A"}</span>
        </div>

        {movie.tags && movie.tags.length > 0 && (
          <div className="trending-movie-tags">
            {movie.tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="trending-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="trending-movie-description">
          {movie.description?.substring(0, 100) || "Exciting content awaits you..."}
          {movie.description && movie.description.length > 100 && "..."}
        </div>

        <div className="trending-movie-actions">
          <Link to={`/singlePage/content/${movie.id}`} className="trending-btn-watch">
            <i className="fas fa-play"></i>
            <span>Watch Now</span>
          </Link>
          <button className="trending-btn-info">
            <i className="fas fa-info-circle"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export const Trending = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [randomMovies, setRandomMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all movies from videos database
        const response = await apiService.getAllContent({ limit: 50 });

        if (response && response.success && response.data) {
          const allMovies = response.data;
          
          // Filter trending movies
          const trending = allMovies.filter(movie => movie.trending);
          
          // Get random movies if not enough trending
          const nonTrending = allMovies.filter(movie => !movie.trending);
          const shuffledRandom = nonTrending.sort(() => 0.5 - Math.random());
          
          // Combine trending + random to get 12 movies total
          const combinedMovies = [
            ...trending,
            ...shuffledRandom.slice(0, Math.max(0, 12 - trending.length))
          ].slice(0, 12);
          
          setTrendingMovies(trending.slice(0, 6));
          setRandomMovies(combinedMovies);
        } else {
          setError("Failed to fetch movies data");
        }
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError(err.message || "Failed to fetch movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="trending-page-container">
        <div className="trending-loading">
          <div className="trending-spinner"></div>
          <h2>Loading Amazing Movies...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trending-page-container">
        <div className="trending-error">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="trending-retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="trending-page-container">
      {/* Hero Section */}
      <section className="trending-hero">
        <div className="trending-hero-content">
          <h1 className="trending-hero-title">
            Discover Amazing Movies
          </h1>
          <p className="trending-hero-subtitle">
            Trending films and hidden gems from our collection
          </p>
        </div>
        <div className="trending-hero-bg"></div>
      </section>

      {/* Trending Movies Section */}
      {trendingMovies.length > 0 && (
        <section className="trending-section">
          <div className="trending-container">
            <div className="trending-header">
              <h2 className="trending-section-title">
                <i className="fas fa-fire"></i>
                Trending Now
              </h2>
              <p className="trending-section-subtitle">
                {trendingMovies.length} most popular movies right now
              </p>
            </div>
            
            <div className="trending-grid">
              {trendingMovies.map((movie, index) => (
                <TrendingMovieCard 
                  key={movie.id} 
                  movie={movie} 
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Random Movies Section */}
      <section className="trending-section">
        <div className="trending-container">
          <div className="trending-header">
            <h2 className="trending-section-title">
              <i className="fas fa-star"></i>
              Recommended for You
            </h2>
            <p className="trending-section-subtitle">
              Handpicked movies from our collection
            </p>
          </div>
          
          <div className="trending-grid">
            {randomMovies.map((movie, index) => (
              <TrendingMovieCard 
                key={movie.id} 
                movie={movie} 
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="trending-cta">
        <div className="trending-container">
          <h2>Want to see more?</h2>
          <p>Explore our complete movie collection</p>
          <Link to="/movies" className="trending-cta-btn">
            <i className="fas fa-film"></i>
            Browse All Movies
          </Link>
        </div>
      </section>
    </div>
  );
};
