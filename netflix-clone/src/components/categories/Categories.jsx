import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import apiService from "../../services/api";
import "./Categories.css";

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

const Categories = () => {
  const { categoryName } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [categoryIcon, setCategoryIcon] = useState("");
  const [sortMethod, setSortMethod] = useState("popular");
  const [error, setError] = useState("");

  // All available categories
  const categoryIcons = {
    action: "fa-bomb",
    comedy: "fa-laugh",
    drama: "fa-theater-masks",
    "sci-fi": "fa-robot",
    romance: "fa-heart",
    documentary: "fa-film",
    animation: "fa-dragon",
    thriller: "fa-skull",
    crime: "fa-fingerprint",
    adventure: "fa-mountain",
    horror: "fa-ghost",
    fantasy: "fa-magic",
    mystery: "fa-search",
  };

  // Format category name for display
  const formatCategoryName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortMethod(e.target.value);

    // Sort movies based on selected method
    let sortedMovies = [...movies];

    switch (e.target.value) {
      case "rating":
        sortedMovies.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "recent":
        // Sort by release date or creation date
        sortedMovies.sort((a, b) => {
          const dateA = new Date(a.release_date || a.created_at || 0);
          const dateB = new Date(b.release_date || b.created_at || 0);
          return dateB - dateA;
        });
        break;
      default: // popular
        // Keep original order which is assumed to be by popularity
        break;
    }

    setMovies(sortedMovies);
  };

  useEffect(() => {
    const fetchCategoryMovies = async () => {
      try {
        setLoading(true);
        setError("");
        setSortMethod("popular"); // Reset sort method on category change

        console.log(`Fetching movies for category: ${categoryName}`);

        // Fetch all movies from videos database
        const response = await apiService.getAllContent({ limit: 50 });

        if (response.success && response.data) {
          const allMovies = response.data;
          
          // Filter movies by category (genre)
          const categoryLower = categoryName.toLowerCase();
          const filtered = allMovies.filter((movie) => {
            if (!movie.tags || !Array.isArray(movie.tags)) return false;
            return movie.tags.some(tag => tag.toLowerCase() === categoryLower);
          });

          // Set category title and icon
          setCategoryTitle(formatCategoryName(categoryName));
          setCategoryIcon(categoryIcons[categoryLower] || "fa-film");

          // Set filtered movies
          setMovies(filtered);
        } else {
          setError("Failed to fetch category data");
        }

        console.log(`Category data loaded successfully for ${categoryName}`);
      } catch (err) {
        console.error("Error fetching category data:", err);
        setError("Failed to load category data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryMovies();
  }, [categoryName]);

  return (
    <div className="category-page">
      <div className="category-hero">
        <div className="category-overlay"></div>
        <div className="category-info">
          <div className="category-icon">
            <i className={`fas ${categoryIcon}`}></i>
          </div>
          <h1>{categoryTitle} Movies & Shows</h1>
          <p>Explore our collection of {categoryTitle.toLowerCase()} content</p>
        </div>
      </div>

      <div className="container">
        {/* Error State */}
        {error && (
          <div className="error-container">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading {categoryTitle} content...</p>
          </div>
        ) : (
          <>
            <div className="category-results">
              <div className="results-header">
                <h2>
                  <span>{movies.length}</span>{" "}
                  {movies.length === 1 ? "title" : "titles"} found
                </h2>
                <div className="filter-options">
                  <select value={sortMethod} onChange={handleSortChange}>
                    <option value="popular">Most Popular</option>
                    <option value="recent">Recently Added</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              {movies.length > 0 ? (
                <div className="movie-grid">
                  {movies.map((movie) => (
                    <div
                      className="movie-card"
                      key={`${movie.id}-${movie.title}`}
                    >
                      <Link to={`/singlePage/content/${movie.id}`}>
                        <div className="movie-poster">
                          {movie.cover_image_url ? (
                            <img 
                              src={movie.cover_image_url} 
                              alt={movie.title}
                              onError={(e) => { e.target.src = "/images/home1.jpg"; }}
                            />
                          ) : (
                            <div className="no-poster">
                              <i className="fas fa-film"></i>
                            </div>
                          )}
                          <div className="movie-overlay">
                            <div className="movie-actions">
                              <button className="play-btn">
                                <i className="fas fa-play"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                        <AddToListButton movieId={movie.id} />
                        <div className="movie-info">
                          <h3>{movie.title}</h3>
                          <div className="movie-meta">
                            {movie.rating && (
                              <span className="rating">
                                <i className="fas fa-star"></i> {movie.rating}
                              </span>
                            )}
                            <span className="time">{movie.duration || "N/A"}</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-category">
                  <div className="empty-icon">
                    <i className="fas fa-film"></i>
                  </div>
                  <h2>No {categoryTitle} content found</h2>
                  <p>
                    We couldn't find any {categoryTitle.toLowerCase()} movies or
                    shows in our database.
                  </p>
                  <Link to="/" className="browse-btn">
                    Browse All Content
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Categories;
