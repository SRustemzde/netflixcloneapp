import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";
import apiService from "../../services/api";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("favorites");
  const [favorites, setFavorites] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);
  const [userProfile, setUserProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    avatar: "",
    phone: "",
    country: "",
    birthdate: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user data and profile information
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError("");
        
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/login");
          return;
        }

        console.log("Fetching user profile data...");
        const userResponse = await apiService.getCurrentUser();
        console.log("User profile data received:", userResponse);
        
        if (userResponse) {
          // Backend response is direct, not wrapped in success/data
          const user = userResponse;
          console.log("Mapping user profile data:", user);
          setUserProfile({
            firstName: user.first_name || "",
            lastName: user.last_name || "",
            email: user.email || "",
            username: user.username || "",
            avatar: user.avatar || "",
            phone: user.phone || "",
            country: user.country || "",
            birthdate: user.birthdate || ""
          });
        }

        // Fetch watchlist data
        try {
          const watchlistResponse = await apiService.getWatchlist();
          console.log("Watchlist response:", watchlistResponse);
          // API returns array directly, not wrapped in success/data
          if (Array.isArray(watchlistResponse)) {
            setFavorites(watchlistResponse);
          }
        } catch (watchlistErr) {
          console.error("Error fetching watchlist:", watchlistErr);
        }

        // Fetch watch history
        try {
          const historyResponse = await apiService.getWatchHistory();
          console.log("Watch history response:", historyResponse);
          // API returns array directly, not wrapped in success/data
          if (Array.isArray(historyResponse)) {
            setWatchHistory(historyResponse);
          }
        } catch (historyErr) {
          console.error("Error fetching watch history:", historyErr);
        }

      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data. Please try again.");
        
        if (err.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Helper function to generate random dates for watch history
  const randomDate = (start, end) => {
    const date = new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
    return date.toISOString().split("T")[0];
  };

  // Function to format date in a readable format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle removing a favorite
  const handleRemoveFavorite = async (id) => {
    try {
      // Remove from backend/localStorage
      await apiService.removeFromWatchlist(id);
      // Update local state
      setFavorites(favorites.filter((item) => {
        const content = item.content || item;
        return (content._id || content.id) !== id;
      }));
    } catch (err) {
      console.error("Error removing from favorites:", err);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>
            Manage your account, view your watch history, and access your
            favorite content
          </p>
        </div>

        <div className="profile-content">
          {/* Sidebar */}
          <div className="profile-sidebar">
            <div className="user-info">
              <div className="profile-picture">
                <img src="./images/avatar.png" alt="User Profile" />
              </div>
              <div className="user-details">
                <h2>{userProfile.firstName || userProfile.username} {userProfile.lastName}</h2>
                <p>{userProfile.email}</p>
                {userProfile.phone && <p><i className="fas fa-phone"></i> {userProfile.phone}</p>}
                {userProfile.country && <p><i className="fas fa-flag"></i> {userProfile.country}</p>}
                <div className="user-stats">
                  <div className="stat-item">
                    <span className="stat-value">{favorites.length}</span>
                    <span className="stat-label">Favorites</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{watchHistory.length}</span>
                    <span className="stat-label">Watched</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-nav">
              <ul>
                <li>
                  <a
                    href="#favorites"
                    className={activeTab === "favorites" ? "active" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("favorites");
                    }}
                  >
                    <i className="fas fa-heart"></i>
                    Favorites
                  </a>
                </li>
                <li>
                  <a
                    href="#history"
                    className={activeTab === "history" ? "active" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("history");
                    }}
                  >
                    <i className="fas fa-history"></i>
                    Watch History
                  </a>
                </li>
                <li>
                  <a
                    href="#settings"
                    className={activeTab === "settings" ? "active" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("settings");
                    }}
                  >
                    <i className="fas fa-cog"></i>
                    Account Settings
                  </a>
                </li>
                <li>
                  <a
                    href="#subscriptions"
                    className={activeTab === "subscriptions" ? "active" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("subscriptions");
                    }}
                  >
                    <i className="fas fa-credit-card"></i>
                    Subscription
                  </a>
                </li>
              </ul>

              <button className="logout-btn" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Sign Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="profile-main">
            {activeTab === "favorites" && (
              <div>
                <h2 className="section-title">
                  <i className="fas fa-heart"></i> My Favorites
                </h2>

                {loading ? (
                  <div className="loading-container">
                    <div className="loading-spinner">
                      <i className="fas fa-spinner fa-spin fa-2x"></i>
                    </div>
                    <p>Loading your favorites...</p>
                  </div>
                ) : favorites.length > 0 ? (
                  <div className="favorites-grid">
                    {favorites.map((item) => {
                      const content = item.content || item;
                      return (
                        <div className="favorite-item" key={content._id || content.id}>
                          <img 
                            src={content.thumbnailUrl || content.cover} 
                            alt={content.title || content.name}
                            onError={(e) => { e.target.src = "/images/home1.jpg"; }}
                          />
                          <div className="overlay">
                            <h4>{content.title || content.name}</h4>
                            {content.rating && (
                              <div className="rating">
                                <i className="fas fa-star"></i> {content.rating}
                              </div>
                            )}
                            {content.type && (
                              <div className="content-type">
                                <i className="fas fa-tag"></i> {content.type}
                              </div>
                            )}
                          </div>
                          <button
                            className="remove-favorite"
                            onClick={() => handleRemoveFavorite(content._id || content.id)}
                            aria-label="Remove from favorites"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p>You haven't added any favorites yet.</p>
                )}
              </div>
            )}

            {activeTab === "history" && (
              <div>
                <h2 className="section-title">
                  <i className="fas fa-history"></i> Watch History
                </h2>

                {loading ? (
                  <div className="loading-container">
                    <div className="loading-spinner">
                      <i className="fas fa-spinner fa-spin fa-2x"></i>
                    </div>
                    <p>Loading your watch history...</p>
                  </div>
                ) : watchHistory.length > 0 ? (
                  <div className="history-list">
                    {watchHistory.map((item) => {
                      const content = item.content || item;
                      return (
                        <div className="history-item" key={item._id || item.id}>
                          <div className="history-poster">
                            <img 
                              src={content.thumbnailUrl || content.cover} 
                              alt={content.title || content.name}
                              onError={(e) => { e.target.src = "/images/home1.jpg"; }}
                            />
                          </div>
                          <div className="history-details">
                            <h4>{content.title || content.name}</h4>
                            <div className="history-meta">
                              <div className="watch-date">
                                <i className="far fa-calendar-alt"></i>
                                {formatDate(item.watchedAt || item.watchDate || new Date().toISOString())}
                              </div>
                              <div className="progress">
                                <i className="fas fa-spinner"></i>
                                {item.progressPercentage || item.progress || 0}% completed
                              </div>
                              {content.type && (
                                <div className="content-type">
                                  <i className="fas fa-tag"></i> {content.type}
                                </div>
                              )}
                            </div>
                          </div>
                          <Link 
                            to={`/singlePage/content/${content._id || content.id}`}
                            className="continue-watching"
                          >
                            Continue Watching
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p>No watch history available.</p>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div>
                <h2 className="section-title">
                  <i className="fas fa-cog"></i> Account Settings
                </h2>
                <div className="settings-info">
                  <p>For detailed account settings, please visit the <Link to="/account" className="settings-link">Account Settings</Link> page.</p>
                  
                  <div className="quick-info">
                    <h3>Quick Profile Info</h3>
                    <div className="profile-info-grid">
                      <div className="info-item">
                        <label>Username:</label>
                        <span>{userProfile.username || "N/A"}</span>
                      </div>
                      <div className="info-item">
                        <label>Email:</label>
                        <span>{userProfile.email || "N/A"}</span>
                      </div>
                      <div className="info-item">
                        <label>Name:</label>
                        <span>{userProfile.firstName} {userProfile.lastName}</span>
                      </div>
                      {userProfile.phone && (
                        <div className="info-item">
                          <label>Phone:</label>
                          <span>{userProfile.phone}</span>
                        </div>
                      )}
                      {userProfile.country && (
                        <div className="info-item">
                          <label>Country:</label>
                          <span>{userProfile.country}</span>
                        </div>
                      )}
                      {userProfile.birthdate && (
                        <div className="info-item">
                          <label>Date of Birth:</label>
                          <span>{formatDate(userProfile.birthdate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "subscriptions" && (
              <div>
                <h2 className="section-title">
                  <i className="fas fa-credit-card"></i> Subscription Details
                </h2>
                <p>Subscription details page is under development.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
