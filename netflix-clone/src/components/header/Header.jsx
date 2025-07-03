import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./header.css";
import apiService from "../../services/api";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  const notificationRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [noSearchResults, setNoSearchResults] = useState(false);
  const [userSubscription, setUserSubscription] = useState(null);
  const [allMovies, setAllMovies] = useState([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  // Bildirimler için örnek veri
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "new_content",
      title: "New Release: Inception 2",
      message: "The long-awaited sequel is now streaming!",
      time: "Just now",
      read: false,
      image: "/images/covers/inception2.jpg",
    },
    {
      id: 2,
      type: "recommendation",
      title: "Recommended for you",
      message: "Based on your watch history: The Matrix Resurrections",
      time: "2 hours ago",
      read: false,
      image: "/images/covers/matrix.jpg",
    },
    {
      id: 3,
      type: "account",
      title: "Account Update",
      message: "Your subscription will renew in 3 days",
      time: "Yesterday",
      read: true,
      image: null,
    },
  ]);

  // Fetch all movies from videos database for search
  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        setIsLoadingSearch(true);
        const response = await apiService.getAllContent({ limit: 100 });
        if (response.success && response.data) {
          setAllMovies(response.data);
        }
      } catch (error) {
        console.error('Error fetching movies for search:', error);
      } finally {
        setIsLoadingSearch(false);
      }
    };

    fetchAllMovies();
  }, []);

  // Check if we're on the home page
  const isHomePage = location.pathname === "/";

  // Handle scroll effect for transparent to solid header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Focus search input when search becomes active
  useEffect(() => {
    if (searchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchActive]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Check if a menu item is active
  const isActive = (path) => {
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Categories for dropdown menu
  const categories = [
    { name: "Action", icon: "fa-bomb" },
    { name: "Comedy", icon: "fa-laugh" },
    { name: "Drama", icon: "fa-theater-masks" },
    { name: "SciFi", icon: "fa-robot" },
    { name: "Romance", icon: "fa-heart" },
    { name: "Documentary", icon: "fa-film" },
    { name: "Cartoon", icon: "fa-dragon" },
    { name: "Thriller", icon: "fa-skull" },
    { name: "Crime", icon: "fa-fingerprint" },
    { name: "Adventure", icon: "fa-mountain" },
  ];

  // Handle search functionality
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      setNoSearchResults(false);
      return;
    }

    // Search in all movie fields
    const filteredResults = allMovies.filter(
      (movie) =>
        (movie.title &&
          movie.title.toLowerCase().includes(query.toLowerCase())) ||
        (movie.description &&
          movie.description.toLowerCase().includes(query.toLowerCase())) ||
        (movie.starring &&
          Array.isArray(movie.starring) 
            ? movie.starring.some(actor => actor.toLowerCase().includes(query.toLowerCase()))
            : movie.starring.toLowerCase().includes(query.toLowerCase())) ||
        (movie.tags && 
          Array.isArray(movie.tags) 
            ? movie.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
            : movie.tags.toLowerCase().includes(query.toLowerCase()))
    );

    setSearchResults(filteredResults);
    setShowResults(true);
    setNoSearchResults(filteredResults.length === 0);
  };

  // Toggle search bar
  const toggleSearch = () => {
    setSearchActive(!searchActive);
    if (!searchActive) {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 300);
    } else {
      setSearchQuery("");
      setShowResults(false);
      setNoSearchResults(false);
    }
  };

  // Handle click on search result
  const handleResultClick = (movie) => {
    setShowResults(false);
    setSearchActive(false);
    setSearchQuery("");

    // Navigate to movie details page using videos database format
    navigate(`/singlePage/content/${movie.id}`);
  };

  // Check for existing subscription on component mount
  useEffect(() => {
    const subscription = localStorage.getItem('userSubscription');
    if (subscription) {
      try {
        setUserSubscription(JSON.parse(subscription));
      } catch (error) {
        console.error('Error parsing subscription data:', error);
      }
    }

    // Listen for subscription changes
    const handleSubscriptionChange = (event) => {
      const subscription = localStorage.getItem('userSubscription');
      if (subscription) {
        try {
          setUserSubscription(JSON.parse(subscription));
        } catch (error) {
          console.error('Error parsing subscription data:', error);
        }
      }
    };

    window.addEventListener('subscriptionChanged', handleSubscriptionChange);
    return () => window.removeEventListener('subscriptionChanged', handleSubscriptionChange);
  }, []);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".search-bar") &&
        !e.target.closest(".search-results")
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Toggle notification dropdown
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);

    // When opening notifications, close search
    if (!showNotifications) {
      setSearchActive(false);
      setSearchQuery("");
      setShowResults(false);
      setNoSearchResults(false);
    }
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target) &&
        !e.target.closest(".notification-btn")
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Get unread notifications count
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  // Handle notification click
  const handleNotificationClick = (notificationId, notificationType) => {
    // Mark notification as read
    markAsRead(notificationId);

    // Navigate based on notification type
    switch (notificationType) {
      case "new_content":
        navigate("/newReleases");
        break;
      case "recommendation":
        navigate("/recommended");
        break;
      case "account":
        navigate("/account");
        break;
      default:
        navigate("/notifications");
    }

    // Close notification dropdown
    setShowNotifications(false);
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    // When opening menu, close search
    if (!menuOpen) {
      setSearchActive(false);
      setSearchQuery("");
      setShowResults(false);
      setNoSearchResults(false);
      setShowNotifications(false);
    }
  };

  // Bildirim türüne göre ikon getirme
  const getNotificationIcon = (type) => {
    switch (type) {
      case "new_content":
        return <i className="fas fa-film"></i>;
      case "recommendation":
        return <i className="fas fa-thumbs-up"></i>;
      case "account":
        return <i className="fas fa-user-shield"></i>;
      default:
        return <i className="fas fa-bell"></i>;
    }
  };

  // Handle view all search results
  const handleViewAllResults = () => {
    setShowResults(false);
    setSearchActive(false);
    navigate(`/search?q=${searchQuery}`);
  };

  // Clear search input
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    setNoSearchResults(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <header className={scrolled ? "header scrolled" : "header"}>
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className={`logo ${isHomePage ? "active" : ""}`}>
            <img src="/images/logo.png" alt="PurpleStream" />
          </Link>

          <nav className={menuOpen ? "nav-menu active" : "nav-menu"}>
            <ul>
              <li className={isActive("/series") ? "active" : ""}>
                <Link to="/series">TV Shows</Link>
              </li>
              <li className={isActive("/movies") ? "active" : ""}>
                <Link to="/movies">Movies</Link>
              </li>
              <li
                className={`dropdown ${isActive("/category") ? "active" : ""}`}
              >
                <span>Categories</span>
                <div className="dropdown-content">
                  <Link to="/category" className="view-all-categories">
                    <i className="fas fa-th-large"></i>
                    Browse All Categories
                  </Link>
                  <div className="dropdown-divider"></div>
                  {categories.map((category, index) => (
                    <Link
                      key={index}
                      to={`/category/${category.name.toLowerCase()}`}
                    >
                      <i className={`fas ${category.icon}`}></i>
                      {category.name}
                    </Link>
                  ))}
                </div>
              </li>
              <li className={isActive("/pricing") ? "active" : ""}>
                <Link to="/pricing">Pricing</Link>
              </li>
              <li className={isActive("/mylist") ? "active" : ""}>
                <Link to="/mylist">My List</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="header-right">
          {/* Subscription Status */}
          {userSubscription && (
            <div className="subscription-status">
              <span className="subscription-plan">{userSubscription.plan}</span>
            </div>
          )}

          <div className={`search-bar ${searchActive ? "active" : ""}`}>
            <button
              className="search-icon"
              onClick={toggleSearch}
              aria-label="Search"
            >
              <i className="fas fa-search"></i>
            </button>
            <input
              type="text"
              placeholder="Search titles, people, genres..."
              value={searchQuery}
              onChange={handleSearch}
              ref={searchInputRef}
              onFocus={() => {
                if (searchQuery.trim() !== "" && searchResults.length > 0)
                  setShowResults(true);
              }}
            />

            {searchActive && searchQuery && (
              <button
                className="clear-search"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <i className="fas fa-times"></i>
              </button>
            )}

            {showResults && (
              <div className="search-results">
                <div className="search-results-header">
                  <span>Search Results</span>
                  <button onClick={() => setShowResults(false)}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                {noSearchResults ? (
                  <div className="empty-search-results">
                    <i className="fas fa-search"></i>
                    <p>No results found for "{searchQuery}"</p>
                  </div>
                ) : (
                  <>
                    <ul>
                      {searchResults.slice(0, 5).map((movie) => (
                        <li
                          key={`${movie.id}-${movie.title}`}
                          onClick={() => handleResultClick(movie)}
                        >
                          <div className="search-result-item">
                            <div className="movie-poster">
                              <img src={movie.cover_image_url || "/images/home1.jpg"} alt={movie.title} />
                            </div>
                            <div className="movie-info">
                              <h4>{movie.title}</h4>
                              <div className="movie-meta">
                                {movie.rating && (
                                  <span className="rating">{movie.rating}</span>
                                )}
                                <span className="time">{movie.duration}</span>
                              </div>
                              {movie.tags && movie.tags.length > 0 && (
                                <span className="genres">{movie.tags.slice(0, 2).join(", ")}</span>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {searchResults.length > 5 && (
                      <div className="view-all">
                        <a onClick={handleViewAllResults}>
                          View all {searchResults.length} results
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="user-controls">
            <div className="notification-container">
              <button
                className="notification-btn"
                aria-label="Notifications"
                onClick={toggleNotifications}
              >
                <i className="fas fa-bell"></i>
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
              </button>

              {showNotifications && (
                <div className="notifications-dropdown" ref={notificationRef}>
                  <div className="notifications-dropdown-header">
                    <h3>Notifications</h3>
                    {unreadCount > 0 && (
                      <button className="mark-all-read" onClick={markAllAsRead}>
                        Mark all as read
                      </button>
                    )}
                  </div>
                  {notifications.length > 0 ? (
                    <div className="notifications-list">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`notification-item ${
                            notification.read ? "read" : "unread"
                          }`}
                          onClick={() =>
                            handleNotificationClick(
                              notification.id,
                              notification.type
                            )
                          }
                        >
                          <div className="notification-item-avatar">
                            {notification.image ? (
                              <img src={notification.image} alt="" />
                            ) : (
                              <div className="notification-icon">
                                {getNotificationIcon(notification.type)}
                              </div>
                            )}
                          </div>
                          <div className="notification-content">
                            <div className="notification-title">
                              <h4>{notification.title}</h4>
                              <span className="notification-time">
                                {notification.time}
                              </span>
                            </div>
                            <p>{notification.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-notifications">
                      <i className="fas fa-check-circle"></i>
                      <p>No new notifications</p>
                    </div>
                  )}
                  <div className="notifications-footer">
                    <Link to="/notifications" className="view-all-link">
                      <span>View All Notifications</span>
                      <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="profile-dropdown">
              <button className="profile-btn">
                <img src="/images/avatar.png" alt="Profile" />
                <i className="fas fa-caret-down"></i>
              </button>
              <div className="profile-dropdown-content">
                <Link to="/profile">
                  <i className="fas fa-user"></i>Profile
                </Link>
                <Link to="/account">
                  <i className="fas fa-cog"></i>Account
                </Link>
                {userSubscription && (
                  <div className="subscription-info">
                    <i className="fas fa-crown"></i>
                    <div>
                      <span className="sub-plan">{userSubscription.plan} Plan</span>
                      <span className="sub-price">${userSubscription.price}/month</span>
                    </div>
                  </div>
                )}
                <Link to="/logout">
                  <i className="fas fa-sign-out-alt"></i>Sign Out
                </Link>
              </div>
            </div>
          </div>

          <button
            className={`menu-toggle ${menuOpen ? "active" : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};
