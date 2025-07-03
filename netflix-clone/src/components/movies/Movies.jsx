import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiService from "../../services/api";
import "./Movies.css";

<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
></link>;

const MovieCard = ({ movie, index, isSpecial }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);

  // Extract tags as genres (limit to 2)
  const genres = Array.isArray(movie.tags) 
    ? movie.tags.slice(0, 2)
    : [];

  // Check if movie is in favorites on mount
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        console.log('🔍 Checking favorite status for movie:', movie.id);
        const watchlist = await apiService.getWatchlist();
        console.log('🔍 Current watchlist:', watchlist);
        const isInWatchlist = watchlist.some(item => item.content && item.content.id === movie.id);
        console.log('🔍 Is in watchlist:', isInWatchlist);
        setIsFavorite(isInWatchlist);
      } catch (error) {
        console.error('❌ Error checking favorite status:', error);
      }
    };

    checkFavoriteStatus();
  }, [movie.id]);

  // Handle favorite toggle
  const handleFavoriteToggle = async (e) => {
    e.preventDefault(); // Prevent navigation when clicking favorite button
    e.stopPropagation();
    
    console.log('🎬 Movie ID:', movie.id, 'Current favorite status:', isFavorite);
    
    try {
      setIsLoadingFavorite(true);
      
      if (isFavorite) {
        console.log('🗑️ Removing from watchlist...');
        const result = await apiService.removeFromWatchlist(movie.id);
        console.log('Remove result:', result);
        setIsFavorite(false);
      } else {
        console.log('➕ Adding to watchlist...');
        const result = await apiService.addToWatchlist(movie.id);
        console.log('Add result:', result);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('❌ Error toggling favorite:', error);
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  return (
    <div
      className={`movie-card ${isSpecial ? "movie-card-featured" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <div className="movie-poster">
        <img src={movie.cover_image_url || "/images/home1.jpg"} alt={movie.title} loading="lazy" 
             onError={(e) => { e.target.src = "/images/home1.jpg"; }} />
        <div className="movie-overlay"></div>

        {movie.rating && (
          <div className="movie-rating">
            <i className="fas fa-star"></i>
            <span>{movie.rating}</span>
          </div>
        )}

        {isSpecial && (
          <div className="movie-featured-badge">
            <i className="fas fa-crown"></i> Featured
          </div>
        )}
      </div>

      <div className={`movie-content ${isHovered ? "hovered" : ""}`}>
        <h3 className="movie-title">{movie.title}</h3>

        <div className="movie-meta">
          <span className="movie-year">{movie.release_date?.split('-')[0] || "2024"}</span>
          <span className="movie-dot"></span>
          <span className="movie-duration">{movie.duration || "N/A"}</span>
          <span className="movie-dot"></span>
          <span className="movie-type">{movie.content_type || "MOVIE"}</span>
        </div>

        {genres.length > 0 && (
          <div className="movie-genres">
            {genres.map((genre, i) => (
              <span key={i} className="genre-tag">
                {genre}
              </span>
            ))}
          </div>
        )}

        <div className="movie-description">
          {movie.description ||
            "A thrilling cinematic journey that will keep you on the edge of your seat."}
        </div>

        <div className="movie-actions">
          <Link to={`/singlePage/content/${movie.id}`} className="btn-watch">
            <i className="fas fa-play"></i>
            <span>Watch</span>
          </Link>

          <button 
            className={`btn-circle ${isFavorite ? 'added' : ''}`}
            onClick={handleFavoriteToggle}
            disabled={isLoadingFavorite}
            title={isFavorite ? 'Remove from My List' : 'Add to My List'}
          >
            <i className={`${isLoadingFavorite ? 'fa-spin fa-spinner' : (isFavorite ? 'fas fa-check' : 'fas fa-plus')}`}></i>
          </button>
        </div>
      </div>
    </div>
  );
};

const MovieSlider = ({ title, description, movies, category }) => {

  return (
    <section className="movie-slider">
      <div className="slider-header">
        <div className="slider-title">
          <h2>{title}</h2>
          {description && <p className="slider-description">{description}</p>}
        </div>
      </div>

      <div className="slider-content">
        {movies.map((movie, index) => (
          <MovieCard
            key={`${category}-${movie.id}`}
            movie={movie}
            index={index}
            isSpecial={index === 0}
          />
        ))}
      </div>
    </section>
  );
};

const SearchBox = () => {
  return (
    <div className="search-box">
      <i className="fas fa-search"></i>
      <input type="text" placeholder="Search for movies..." />
      <button>Search</button>
    </div>
  );
};

const Movies = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [moviesOnly, setMoviesOnly] = useState([]);
  const [seriesOnly, setSeriesOnly] = useState([]);
  const [error, setError] = useState("");

  // Fetch movies data
  useEffect(() => {
    const fetchMoviesData = async () => {
      try {
        setIsLoading(true);
        setError("");

        console.log("Fetching movies data...");

        // Fetch all movies from videos database
        const allResponse = await apiService.getAllContent({ limit: 50 });

        if (allResponse.success && allResponse.data) {
          setAllMovies(allResponse.data);
          
          // Filter featured movies
          const featured = allResponse.data.filter(movie => movie.featured);
          setFeaturedMovies(featured);
          
          // Filter movies only
          const movies = allResponse.data.filter(movie => movie.content_type === "movie");
          setMoviesOnly(movies);
          
          // Filter series only
          const series = allResponse.data.filter(movie => movie.content_type === "series");
          setSeriesOnly(series);
        }

        console.log("Movies data loaded successfully");
      } catch (err) {
        console.error("Error fetching movies data:", err);
        setError("Failed to load movies data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoviesData();
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="movies-container">
        <div className="loader-screen">
          <div className="loader-content">
            <div className="loader-icon">
              <div className="film-reel">
                <i className="fas fa-film"></i>
              </div>
            </div>
            <h2>By Rustemzade</h2>
            <p>
              Özgün tasarımdır. Tutorial kullanılmadığını da belirtmek isterim. ツ
            </p>
            <div className="loader-bar">
              <div className="loader-progress"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="movies-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>The Ultimate Movie Experience</h1>
          <p>
            Discover thousands of movies, from timeless classics to the latest
            blockbusters. Your perfect movie night starts here.
          </p>

          <SearchBox />

          <div className="hero-badges">
            <div className="hero-badge">
              <i className="fas fa-film"></i>
              <span>10,000+ Movies</span>
            </div>
            <div className="hero-badge">
              <i className="fas fa-star"></i>
              <span>Top Ratings</span>
            </div>
            <div className="hero-badge">
              <i className="fas fa-award"></i>
              <span>Award Winners</span>
            </div>
          </div>
        </div>

        <div className="hero-backdrop"></div>
      </section>

      {/* Category Tabs */}
      <div className="category-tabs">
        <button
          className={activeTab === "all" ? "active" : ""}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
        <button
          className={activeTab === "movies" ? "active" : ""}
          onClick={() => setActiveTab("movies")}
        >
          Movies
        </button>
        <button
          className={activeTab === "series" ? "active" : ""}
          onClick={() => setActiveTab("series")}
        >
          TV Series
        </button>
        <button
          className={activeTab === "animation" ? "active" : ""}
          onClick={() => setActiveTab("animation")}
        >
          Animation
        </button>
        <button
          className={activeTab === "documentary" ? "active" : ""}
          onClick={() => setActiveTab("documentary")}
        >
          Documentary
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      )}

      {/* Main Content */}
      <div className="movies-main">
        {activeTab === "all" && (
          <>
            <MovieSlider
              title="Featured Content"
              description="Hand-picked favorites just for you"
              movies={featuredMovies}
              category="featured"
            />

            <MovieSlider
              title="All Content"
              description="Explore our entire collection"
              movies={allMovies}
              category="all"
            />
          </>
        )}

        {activeTab === "movies" && (
          <MovieSlider
            title="Movies"
            description="Latest and greatest movies"
            movies={moviesOnly}
            category="movies"
          />
        )}

        {activeTab === "series" && (
          <MovieSlider
            title="TV Series"
            description="Binge-worthy series"
            movies={seriesOnly}
            category="series"
          />
        )}
      </div>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2>Get Notified About New Releases</h2>
          <p>
            Subscribe to our newsletter and never miss out on new movies and
            exclusive offers.
          </p>

          <div className="newsletter-form">
            <input type="email" placeholder="Your email address" />
            <button>Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Movies;
