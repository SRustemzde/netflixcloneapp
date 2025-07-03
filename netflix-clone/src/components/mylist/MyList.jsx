import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiService from "../../services/api";
import "./mylist.css";

const MyList = () => {
  const [savedItems, setSavedItems] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("dateAdded"); // dateAdded, name, rating
  const [filterBy, setFilterBy] = useState("all"); // all, movies, shows
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user's watchlist from database
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        setIsLoading(true);
        setError("");

        console.log('📋 Fetching watchlist...');
        const response = await apiService.getWatchlist();
        console.log('📋 Watchlist response:', response);

        if (response && Array.isArray(response)) {
          // Transform API response to component state format
          const transformedItems = response.map((item) => ({
            id: item.content.id,
            name: item.content.title,
            title: item.content.title,
            cover: item.content.cover_image_url || "/images/home1.jpg",
            cover_image_url:
              item.content.cover_image_url || "/images/home1.jpg",
            rating: item.content.rating || 4.5,
            time: item.content.duration || "N/A",
            duration: item.content.duration || "N/A",
            desc: item.content.description || "No description available.",
            description:
              item.content.description || "No description available.",
            genres: item.content.tags
              ? item.content.tags.slice(0, 2).join(", ")
              : "Drama",
            tags: item.content.tags || [],
            dateAdded: new Date(item.added_at),
            isTVShow: item.content.content_type === "TV_SHOW",
            content_type: item.content.content_type || "MOVIE",
            source: "content", // Since we're using the videos database
            watchlist_id: item.id,
          }));

          setSavedItems(transformedItems);
        } else {
          setSavedItems([]);
        }
      } catch (err) {
        console.error("Error fetching watchlist:", err);
        setError("Failed to load your watchlist. Please try again.");
        setSavedItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  // Remove item from list
  const removeFromList = async (id) => {
    try {
      await apiService.removeFromWatchlist(id);
      setSavedItems(savedItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      // You might want to show a toast notification here
    }
  };

  // Handle sorting
  const sortItems = (items) => {
    switch (sortBy) {
      case "name":
        return [...items].sort((a, b) =>
          (a.name || a.title).localeCompare(b.name || b.title)
        );
      case "rating":
        return [...items].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "dateAdded":
      default:
        return [...items].sort(
          (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
        );
    }
  };

  // Handle filtering
  const filterItems = (items) => {
    switch (filterBy) {
      case "movies":
        return items.filter((item) => !item.isTVShow);
      case "shows":
        return items.filter((item) => item.isTVShow);
      case "all":
      default:
        return items;
    }
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Process items: filter then sort
  const processedItems = sortItems(filterItems(savedItems));

  // Check if list is empty based on current filters
  const isEmptyList = processedItems.length === 0;

  return (
    <div className="mylist-page">
      <div className="mylist-header">
        <div className="header-content">
          <h1>My List</h1>
          <p>Your personalized collection of movies and TV shows</p>
        </div>
      </div>

      <div className="mylist-container">
        {error && (
          <div className="error-state">
            <div className="error-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h3>Error Loading Watchlist</h3>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="retry-btn"
            >
              Try Again
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your list...</p>
          </div>
        ) : (
          !error && (
            <>
              <div className="mylist-controls">
                <div className="list-filters">
                  <div className="filter-group">
                    <label>Show:</label>
                    <select
                      value={filterBy}
                      onChange={(e) => setFilterBy(e.target.value)}
                    >
                      <option value="all">All Content</option>
                      <option value="movies">Movies Only</option>
                      <option value="shows">TV Shows Only</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>Sort By:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="dateAdded">Date Added</option>
                      <option value="name">Title</option>
                      <option value="rating">Rating</option>
                    </select>
                  </div>
                </div>

                <div className="view-toggle">
                  <button
                    className={viewMode === "grid" ? "active" : ""}
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid view"
                  >
                    <i className="fas fa-th"></i>
                  </button>
                  <button
                    className={viewMode === "list" ? "active" : ""}
                    onClick={() => setViewMode("list")}
                    aria-label="List view"
                  >
                    <i className="fas fa-list"></i>
                  </button>
                </div>
              </div>

              {isEmptyList ? (
                <div className="empty-list">
                  <div className="empty-icon">
                    <i className="fas fa-film"></i>
                  </div>
                  <h3>Your list is empty</h3>
                  <p>
                    {filterBy !== "all"
                      ? `No ${filterBy} found in your list.`
                      : "Start adding movies and TV shows to your list by clicking the '+' button when browsing content."}
                  </p>
                  <Link to="/" className="browse-btn">
                    Browse Content
                  </Link>
                </div>
              ) : (
                <div
                  className={`content-grid ${
                    viewMode === "list" ? "list-view" : "grid-view"
                  }`}
                >
                  {processedItems.map((item) => (
                    <div
                      className="list-item"
                      key={`${item.id}-${item.name || item.title}`}
                    >
                      <div className="item-poster">
                        <img
                          src={item.cover || item.cover_image_url}
                          alt={item.name || item.title}
                          onError={(e) => {
                            e.target.src = "/images/home1.jpg";
                          }}
                        />
                        <div className="item-overlay">
                          <div className="overlay-buttons">
                            <Link
                              to={`/singlePage/content/${item.id}`}
                              className="play-btn"
                            >
                              <i className="fas fa-play"></i>
                            </Link>
                            <button
                              className="remove-btn"
                              onClick={() => removeFromList(item.id)}
                              title="Remove from My List"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        </div>

                        {item.isTVShow && (
                          <div className="content-badge">
                            <span>TV</span>
                          </div>
                        )}
                      </div>

                      <div className="item-info">
                        <h3 className="item-title">
                          {item.name || item.title}
                        </h3>

                        <div className="meta-info">
                          {item.rating && (
                            <span className="item-rating">
                              <i className="fas fa-star"></i> {item.rating}
                            </span>
                          )}
                          <span className="item-duration">
                            {item.time || item.duration}
                          </span>
                          {item.genres && (
                            <span className="item-genre">{item.genres}</span>
                          )}
                        </div>

                        {viewMode === "list" && (
                          <p className="item-desc">
                            {(item.desc || item.description)?.substring(0, 120)}
                            ...
                          </p>
                        )}

                        <div className="item-footer">
                          <span className="added-date">
                            Added: {formatDate(item.dateAdded)}
                          </span>
                          <div className="action-btns">
                            <button
                              className="watch-later"
                              title="Move to watch later"
                            >
                              <i className="fas fa-clock"></i>
                            </button>
                            <button className="share-btn" title="Share">
                              <i className="fas fa-share-alt"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )
        )}
      </div>
    </div>
  );
};

export default MyList;
