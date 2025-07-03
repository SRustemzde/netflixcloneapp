import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiService from "../../services/api";
import "./CategoryList.css";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Category icons and descriptions mapping
  const categoryData = {
    action: {
      icon: "fa-bomb",
      desc: "High-energy films with thrilling sequences and dynamic characters",
      color: "#c2185b",
    },
    comedy: {
      icon: "fa-laugh",
      desc: "Lighthearted films designed to make you laugh and smile",
      color: "#00b0ff",
    },
    drama: {
      icon: "fa-theater-masks",
      desc: "Character-driven narratives that explore emotional themes",
      color: "#ff9800",
    },
    "sci-fi": {
      icon: "fa-robot",
      desc: "Futuristic stories exploring advanced technology and space",
      color: "#00bfa5",
    },
    romance: {
      icon: "fa-heart",
      desc: "Stories centered around love relationships and emotional connections",
      color: "#e91e63",
    },
    documentary: {
      icon: "fa-film",
      desc: "Non-fiction films documenting real events and people",
      color: "#8bc34a",
    },
    animation: {
      icon: "fa-dragon",
      desc: "Animated films and shows for all ages",
      color: "#f44336",
    },
    thriller: {
      icon: "fa-skull",
      desc: "Suspenseful narratives that keep viewers on the edge of their seats",
      color: "#6200ea",
    },
    crime: {
      icon: "fa-fingerprint",
      desc: "Stories revolving around criminal activities and investigations",
      color: "#424242",
    },
    adventure: {
      icon: "fa-mountain",
      desc: "Exciting journeys and explorations of new worlds and experiences",
      color: "#ff6d00",
    },
    horror: {
      icon: "fa-ghost",
      desc: "Spine-chilling stories designed to frighten and create suspense",
      color: "#424242",
    },
    fantasy: {
      icon: "fa-magic",
      desc: "Magical worlds and supernatural adventures",
      color: "#9c27b0",
    },
    mystery: {
      icon: "fa-search",
      desc: "Puzzling stories that challenge viewers to solve the case",
      color: "#607d8b",
    },
  };

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch all movies to extract genres
        const response = await apiService.getAllContent({ limit: 50 });

        if (response.success && response.data) {
          const allMovies = response.data;
          
          // Extract unique genres and count movies per genre
          const genreMap = new Map();
          
          allMovies.forEach((movie) => {
            if (movie.tags && Array.isArray(movie.tags)) {
              movie.tags.forEach((tag) => {
                const tagLower = tag.toLowerCase();
                genreMap.set(tagLower, (genreMap.get(tagLower) || 0) + 1);
              });
            }
          });

          // Convert to categories array with metadata
          const categoriesArray = Array.from(genreMap.entries()).map(([name, count], index) => {
            const categoryInfo = categoryData[name] || {
              icon: "fa-film",
              desc: `Collection of ${name} movies and shows`,
              color: "#757575",
            };
            
            return {
              id: index + 1,
              name: name.charAt(0).toUpperCase() + name.slice(1),
              ...categoryInfo,
              count,
            };
          });

          setCategories(categoriesArray);
        } else {
          setError("Failed to fetch categories");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Generate featured collections based on available categories
  const getFeaturedCollections = () => {
    const topCategories = categories
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
    
    return topCategories.map((category, index) => ({
      id: index + 1,
      name: `Best ${category.name} Movies`,
      description: `Our handpicked selection of the most popular ${category.name.toLowerCase()} content`,
      category: category.name.toLowerCase(),
      color: category.color,
    }));
  };

  const featuredCollections = getFeaturedCollections();

  return (
    <div className="category-list-page">
      <div className="category-hero-banner">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>Categories</h1>
          <p>Explore our vast collection of movies and shows by genre</p>
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

        <div className="category-list-intro">
          <h2>Browse by Genre</h2>
          <p>
            Discover movies and shows tailored to your taste. From
            heart-pounding action to side-splitting comedy, we've categorized
            our content to help you find exactly what you're in the mood for.
          </p>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading categories...</p>
          </div>
        ) : (
          <div className="categories-grid">
            {categories.map((category) => (
              <Link
                to={`/category/${category.name.toLowerCase()}`}
                className="category-card"
                key={category.id}
                style={{ "--category-color": category.color }}
              >
                <div className="category-icon">
                  <i className={`fas ${category.icon}`}></i>
                </div>
                <div className="category-content">
                  <h3>{category.name}</h3>
                  <p>{category.desc}</p>
                  <div className="category-meta">
                    <span className="category-count">
                      {category.count} titles
                    </span>
                    <span className="category-explore">
                      Explore <i className="fas fa-chevron-right"></i>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="categories-featured">
          <h2>Featured Collections</h2>
          <div className="featured-grid">
            {featuredCollections.map((collection, index) => (
              <div
                key={collection.id}
                className={`featured-card ${index === 0 ? "large" : ""}`}
                style={{ "--featured-color": collection.color }}
              >
                <div
                  className="featured-img"
                  style={{
                    background: `linear-gradient(45deg, ${collection.color}99, ${collection.color}66)`,
                  }}
                >
                  <div className="featured-overlay"></div>
                </div>
                <div className="featured-content">
                  <span className="featured-tag">Collection</span>
                  <h3>{collection.name}</h3>
                  {index === 0 && <p>{collection.description}</p>}
                  <Link
                    to={`/category/${collection.category}`}
                    className="featured-btn"
                  >
                    View Collection
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
