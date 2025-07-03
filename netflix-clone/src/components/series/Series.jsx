import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiService from "../../services/api";
import "./series.css";

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

const Series = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [allSeries, setAllSeries] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch series data from videos database
  useEffect(() => {
    const fetchSeriesData = async () => {
      try {
        setIsLoading(true);
        setError("");

        console.log("Fetching series data...");

        // Fetch all movies from videos database (series page will show all films)
        const allResponse = await apiService.getAllContent({ limit: 50 });

        if (allResponse.success && allResponse.data) {
          setAllSeries(allResponse.data);
          
          // Extract unique genres from tags
          const uniqueGenres = new Set();
          allResponse.data.forEach((movie) => {
            if (movie.tags && Array.isArray(movie.tags)) {
              movie.tags.forEach((genre) => {
                // Safe check for genre value
                if (genre && typeof genre === 'string' && genre.trim()) {
                  uniqueGenres.add(genre.trim());
                }
              });
            }
          });
          setGenres(["All", ...Array.from(uniqueGenres)]);
        }

        console.log("Series data loaded successfully");
      } catch (err) {
        console.error("Error fetching series data:", err);
        setError("Failed to load series data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeriesData();
  }, []);

  // Filter series based on active category
  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredSeries(allSeries);
    } else {
      setFilteredSeries(
        allSeries.filter((movie) => {
          if (!movie.tags || !Array.isArray(movie.tags)) return false;
          return movie.tags.some(tag => 
            tag && typeof tag === 'string' && tag.toLowerCase() === activeCategory.toLowerCase()
          );
        })
      );
    }
  }, [activeCategory, allSeries]);


  return (
    <div className="series-page">
      <div className="hero-banner">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>TV Shows</h1>
          <p>Discover the best TV series from around the world</p>
        </div>
      </div>

      <div className="series-container">
        {/* Error State */}
        {error && (
          <div className="error-container">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        )}

        <div className="genre-filter">
          <h3>Browse by Genre</h3>
          <div className="genre-tabs">
            {genres.map((genre, index) => {
              // Safe check for genre
              const safeGenre = genre && typeof genre === 'string' ? genre : '';
              const safeActiveCategory = activeCategory && typeof activeCategory === 'string' ? activeCategory : '';
              
              return (
                <button
                  key={index}
                  className={
                    safeActiveCategory.toLowerCase() === safeGenre.toLowerCase()
                      ? "active"
                      : ""
                  }
                  onClick={() => setActiveCategory(safeGenre.toLowerCase())}
                >
                  {safeGenre}
                </button>
              );
            })}
          </div>
        </div>

        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading amazing content...</p>
          </div>
        ) : (
          <>
            <div className="featured-series">
              <h2>Featured Content</h2>
              <div className="featured-grid">
                {filteredSeries.slice(0, 3).map((movie) => (
                  <div
                    className="featured-card"
                    key={`featured-${movie.id}`}
                  >
                    <div className="featured-image">
                      <img 
                        src={movie.cover_image_url || "/images/home1.jpg"} 
                        alt={movie.title}
                        onError={(e) => { e.target.src = "/images/home1.jpg"; }}
                      />
                      <div className="overlay-gradient"></div>
                      <div className="featured-info">
                        <h3>{movie.title}</h3>
                        <div className="meta-info">
                          {movie.rating && (
                            <span className="rating">{movie.rating}</span>
                          )}
                          <span className="duration">{movie.duration || "N/A"}</span>
                          {movie.release_date && (
                            <span className="year">
                              {movie.release_date.split("-")[0]}
                            </span>
                          )}
                        </div>
                        <p className="description">
                          {movie.description
                            ? `${movie.description.substring(0, 120)}...`
                            : "No description available."}
                        </p>
                        <div className="action-buttons">
                          <Link
                            to={`/singlePage/content/${movie.id}`}
                            className="btn-watch"
                          >
                            <i className="fas fa-play"></i> Watch Now
                          </Link>
                        </div>
                      </div>
                    </div>
                    <AddToListButton movieId={movie.id} />
                  </div>
                ))}
              </div>
            </div>

            <div className="series-grid">
              <h2>
                All {activeCategory !== "all" ? activeCategory : ""} Content
              </h2>
              <div className="grid-container">
                {filteredSeries.map((movie) => (
                  <div className="series-card" key={`grid-${movie.id}`}>
                    <div className="card-image">
                      <img 
                        src={movie.cover_image_url || "/images/home1.jpg"} 
                        alt={movie.title}
                        onError={(e) => { e.target.src = "/images/home1.jpg"; }}
                      />
                      <div className="card-overlay">
                        <div className="card-buttons">
                          <Link
                            to={`/singlePage/content/${movie.id}`}
                            className="btn-play"
                          >
                            <i className="fas fa-play"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <AddToListButton movieId={movie.id} />
                    <div className="card-info">
                      <h4>{movie.title}</h4>
                      <div className="info-meta">
                        {movie.rating && (
                          <span className="rating">{movie.rating}</span>
                        )}
                        <span className="duration">{movie.duration || "N/A"}</span>
                      </div>
                      {movie.tags && movie.tags.length > 0 && (
                        <p className="genres">{movie.tags.slice(0, 2).join(", ")}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="subscription-banner">
          <div className="banner-content">
            <h2>Discover More Amazing Content</h2>
            <p>
              Explore our complete collection of movies and series
            </p>
            <Link to="/movies" className="btn-subscribe">
              View All Movies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Series;
