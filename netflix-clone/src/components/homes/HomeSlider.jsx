// src/components/homes/HomeSlider.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export const HomeSlider = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const intervalRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Auto-slide functionality
  useEffect(() => {
    if (items && items.length > 0 && !isPaused && isLoaded) {
      setProgress(0);

      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleSlideChange((prevIndex) =>
              prevIndex === items.length - 1 ? 0 : prevIndex + 1
            );
            return 0;
          }
          return prev + 1.67; // 6 seconds total
        });
      }, 100);

      return () => {
        if (progressIntervalRef.current)
          clearInterval(progressIntervalRef.current);
      };
    }
  }, [items, currentIndex, isPaused, isLoaded]);

  // Load initial content
  useEffect(() => {
    if (items && items.length > 0) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [items]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "ArrowLeft") {
        goToPrevious();
      } else if (event.key === "ArrowRight") {
        goToNext();
      } else if (event.key === " ") {
        event.preventDefault();
        setIsPaused(!isPaused);
      } else if (event.key === "Escape") {
        setIsPaused(true);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [items, isPaused]);

  const handleSlideChange = (indexUpdater) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex(indexUpdater);
    setProgress(0);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  };

  const goToNext = () => {
    if (items && items.length > 0) {
      handleSlideChange((prevIndex) =>
        prevIndex === items.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const goToPrevious = () => {
    if (items && items.length > 0) {
      handleSlideChange((prevIndex) =>
        prevIndex === 0 ? items.length - 1 : prevIndex - 1
      );
    }
  };

  const goToSlide = (index) => {
    if (index !== currentIndex) {
      handleSlideChange(() => index);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center space-y-6">
          {/* Enhanced Loading Spinner */}
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 border-4 border-red-500/30 rounded-full animate-spin">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-red-500 border-r-red-500/50 rounded-full animate-spin"></div>
            </div>
            <div className="absolute top-2 left-2 w-20 h-20 md:w-28 md:h-28 border-4 border-pink-500/40 rounded-full">
              <div
                className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-pink-500 border-l-pink-500/50 rounded-full animate-spin"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "1.5s",
                }}
              ></div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl md:text-2xl font-bold text-white">
              <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                İçerik Yükleniyor...
              </span>
            </h3>
            <p className="text-gray-400 text-lg font-medium">Lütfen bekleyin</p>
          </div>
        </div>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Image with Enhanced Effects */}
        <div className="absolute inset-0">
          <div
            className={`absolute inset-0 transition-all duration-1000 ease-out transform ${
              isTransitioning ? "scale-110 blur-sm" : "scale-105"
            }`}
            style={{
              backgroundImage: `url(${currentItem.cover_image_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.3) contrast(1.3) saturate(1.2)",
            }}
          />

          {/* Animated Overlay Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="w-full h-full animate-pulse"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: "60px 60px",
              }}
            ></div>
          </div>
        </div>

        {/* Enhanced Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-transparent to-purple-900/30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black"></div>

        {/* Floating Background Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-red-500/10 to-purple-500/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-40 left-10 w-40 h-40 md:w-56 md:h-56 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Enhanced Navigation Arrows */}
        <button
          onClick={goToPrevious}
          disabled={isTransitioning}
          className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-30 w-14 h-14 md:w-18 md:h-18 bg-black/40 hover:bg-red-600/80 border border-white/20 hover:border-red-500/60 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed group shadow-2xl hover:shadow-red-500/30"
          aria-label="Previous slide"
        >
          <svg
            className="w-7 h-7 md:w-9 md:h-9 text-white mx-auto group-hover:scale-110 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-purple-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        <button
          onClick={goToNext}
          disabled={isTransitioning}
          className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-30 w-14 h-14 md:w-18 md:h-18 bg-black/40 hover:bg-red-600/80 border border-white/20 hover:border-red-500/60 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed group shadow-2xl hover:shadow-red-500/30"
          aria-label="Next slide"
        >
          <svg
            className="w-7 h-7 md:w-9 md:h-9 text-white mx-auto group-hover:scale-110 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-purple-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        {/* Enhanced Play/Pause Control */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="absolute top-4 md:top-8 right-4 md:right-8 z-30 w-12 h-12 md:w-16 md:h-16 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 hover:border-white/40 rounded-full transition-all duration-300 hover:scale-110 shadow-xl group"
          aria-label={isPaused ? "Play" : "Pause"}
        >
          {isPaused ? (
            <svg
              className="w-5 h-5 md:w-7 md:h-7 text-white mx-auto group-hover:scale-110 transition-transform duration-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 md:w-7 md:h-7 text-white mx-auto group-hover:scale-110 transition-transform duration-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        {/* Main Content */}
        <div className="relative z-20 container mx-auto px-4 md:px-8 h-screen flex items-center">
          <div className="max-w-6xl">
            {/* Enhanced Featured Badge */}
            <div
              className={`inline-block mb-4 md:mb-6 transform transition-all duration-1000 ${
                isTransitioning
                  ? "translate-y-8 opacity-0"
                  : "translate-y-0 opacity-100"
              }`}
            >
              <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white px-4 py-2 md:px-6 md:py-3 rounded-full text-xs md:text-sm font-bold shadow-xl border border-red-400/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  Öne Çıkan İçerik
                </span>
              </div>
            </div>

            {/* Enhanced Title */}
            <div className="mb-6 md:mb-8 overflow-hidden">
              <h1
                className={`text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white leading-none tracking-tighter transform transition-all duration-1000 ${
                  isTransitioning
                    ? "translate-y-8 opacity-0"
                    : "translate-y-0 opacity-100"
                }`}
              >
                <span className="bg-gradient-to-r from-white via-gray-100 to-red-200 bg-clip-text text-transparent drop-shadow-2xl">
                  {currentItem.title}
                </span>
              </h1>
            </div>

            {/* Enhanced Meta Information */}
            <div
              className={`flex flex-wrap items-center gap-2 md:gap-4 mb-6 md:mb-8 transform transition-all duration-1000 delay-100 ${
                isTransitioning
                  ? "translate-y-8 opacity-0"
                  : "translate-y-0 opacity-100"
              }`}
            >
              {currentItem.rating && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 px-3 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl hover:scale-105 transition-transform duration-300 shadow-lg group">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-3 h-3 md:w-5 md:h-5 ${
                          i < Math.floor(currentItem.rating)
                            ? "text-yellow-400"
                            : "text-gray-600"
                        } drop-shadow-lg group-hover:scale-110 transition-transform duration-200`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-yellow-400 font-bold text-sm md:text-lg">
                    {currentItem.rating}
                  </span>
                </div>
              )}

              {currentItem.duration && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30 px-3 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl hover:scale-105 transition-transform duration-300 shadow-lg group">
                  <div className="relative">
                    <svg
                      className="w-3 h-3 md:w-5 md:h-5 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20 group-hover:opacity-40"></div>
                  </div>
                  <span className="text-blue-400 font-bold text-sm md:text-lg">
                    {currentItem.duration} dk
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 px-3 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl hover:scale-105 transition-transform duration-300 shadow-lg group">
                <div className="relative">
                  <svg
                    className="w-3 h-3 md:w-5 md:h-5 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="absolute inset-0 bg-green-400 rounded-full animate-pulse opacity-30 group-hover:opacity-50"></div>
                </div>
                <span className="text-green-400 font-bold text-sm md:text-lg">
                  4K HDR
                </span>
              </div>

              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 px-3 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl hover:scale-105 transition-transform duration-300 shadow-lg">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-purple-400 font-bold text-sm md:text-lg">
                  CANLI
                </span>
              </div>
            </div>

            {/* Enhanced Description */}
            <div
              className={`mb-6 md:mb-10 transform transition-all duration-1000 delay-200 ${
                isTransitioning
                  ? "translate-y-8 opacity-0"
                  : "translate-y-0 opacity-100"
              }`}
            >
              <p className="text-gray-200 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl leading-relaxed max-w-4xl font-light tracking-wide">
                {currentItem.description}
              </p>
            </div>

            {/* Enhanced Categories */}
            {currentItem.categories && currentItem.categories.length > 0 && (
              <div
                className={`flex flex-wrap gap-2 md:gap-4 mb-6 md:mb-10 transform transition-all duration-1000 delay-300 ${
                  isTransitioning
                    ? "translate-y-8 opacity-0"
                    : "translate-y-0 opacity-100"
                }`}
              >
                {currentItem.categories.slice(0, 4).map((category, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 backdrop-blur-sm border border-purple-500/30 text-white px-3 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl text-sm md:text-lg font-semibold shadow-xl hover:scale-105 hover:shadow-purple-500/25 transition-all duration-300 cursor-pointer group"
                  >
                    <span className="relative z-10">{category}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl md:rounded-2xl"></div>
                  </span>
                ))}
              </div>
            )}

            {/* Enhanced Cast Section */}
            {currentItem.starring && currentItem.starring.length > 0 && (
              <div
                className={`mb-8 md:mb-12 transform transition-all duration-1000 delay-400 ${
                  isTransitioning
                    ? "translate-y-8 opacity-0"
                    : "translate-y-0 opacity-100"
                }`}
              >
                <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 hover:bg-black/30 transition-colors duration-300">
                  <p className="text-gray-300 text-base md:text-xl">
                    <span className="font-bold text-white text-lg md:text-2xl bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                      Oyuncular:{" "}
                    </span>
                    <span className="font-medium text-gray-200">
                      {currentItem.starring.slice(0, 3).join(", ")}
                    </span>
                    {currentItem.starring.length > 3 && (
                      <span className="text-gray-400"> ve diğerleri...</span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Enhanced Action Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-3 md:gap-6 transform transition-all duration-1000 delay-500 ${
                isTransitioning
                  ? "translate-y-8 opacity-0"
                  : "translate-y-0 opacity-100"
              }`}
            >
              <Link
                to={`/singlePage/content/${currentItem.id}`}
                className="group relative overflow-hidden flex items-center justify-center gap-3 md:gap-4 bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white px-6 md:px-10 py-3 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/30 focus:outline-none focus:ring-4 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-black"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg
                  className="w-6 h-6 md:w-8 md:h-8 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="relative z-10">Şimdi İzle</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </Link>

              <button className="group relative overflow-hidden flex items-center justify-center gap-3 md:gap-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/40 text-white px-6 md:px-10 py-3 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-xl transition-all duration-500 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg
                  className="w-6 h-6 md:w-8 md:h-8 group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="relative z-10">Detaylar</span>
              </button>

              <button className="group relative overflow-hidden flex items-center justify-center gap-3 md:gap-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-md border border-purple-500/30 hover:border-purple-400/50 text-white px-6 md:px-10 py-3 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-xl transition-all duration-500 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:ring-offset-2 focus:ring-offset-black">
                <svg
                  className="w-6 h-6 md:w-8 md:h-8 group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="relative z-10">Listeme Ekle</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Slide Indicators */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-2 md:gap-4">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`relative overflow-hidden rounded-full transition-all duration-500 group ${
                index === currentIndex
                  ? "w-12 md:w-16 h-3 md:h-4 bg-white/90 shadow-lg shadow-white/25"
                  : "w-3 md:w-4 h-3 md:h-4 bg-white/40 hover:bg-white/70 hover:scale-110"
              } disabled:cursor-not-allowed`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === currentIndex && (
                <div
                  className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                ></div>
              )}
            </button>
          ))}
        </div>

        {/* Enhanced Progress Indicator */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-red-500 via-pink-500 to-red-600 transition-all duration-100 relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Enhanced Featured Content Section */}
      <div className="bg-gradient-to-b from-black via-gray-900 to-black py-12 md:py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex items-center justify-between mb-8 md:mb-16">
            <div>
              <h3 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-2 md:mb-4">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                  Öne Çıkan İçerikler
                </span>
              </h3>
              <p className="text-gray-400 text-base md:text-xl">
                En popüler filmler ve diziler
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {items.map((item, index) => (
              <div
                key={item.id}
                onClick={() => goToSlide(index)}
                className={`group cursor-pointer transform transition-all duration-700 hover:scale-105 ${
                  index === currentIndex
                    ? "ring-4 ring-purple-500 shadow-2xl shadow-purple-500/30 scale-105"
                    : "hover:shadow-2xl hover:shadow-black/50"
                }`}
              >
                <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700/50 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-500">
                  <div className="relative overflow-hidden">
                    <img
                      src={item.cover_image_url}
                      alt={item.title}
                      className="w-full h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-700 filter group-hover:brightness-110 group-hover:contrast-110"
                      onError={(e) => {
                        e.target.src = "/images/home1.jpg";
                      }}
                    />

                    {/* Enhanced Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                    {/* Enhanced Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="relative">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-red-600 to-pink-600 rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all duration-500 shadow-2xl">
                          <svg
                            className="w-8 h-8 md:w-10 md:h-10 text-white ml-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="absolute inset-0 w-16 h-16 md:w-20 md:h-20 bg-white rounded-full animate-ping opacity-20"></div>
                      </div>
                    </div>

                    {/* Enhanced Current Indicator */}
                    {index === currentIndex && (
                      <div className="absolute top-3 md:top-4 right-3 md:right-4">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1 md:px-4 md:py-2 rounded-full font-bold shadow-xl border border-white/20 backdrop-blur-sm">
                          <div className="flex items-center gap-1 md:gap-2">
                            <div className="w-1 h-1 md:w-2 md:h-2 bg-white rounded-full animate-pulse"></div>
                            <span className="text-xs md:text-sm">
                              Şimdi Oynatılıyor
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Enhanced Rating Badge */}
                    {item.rating && (
                      <div className="absolute top-3 md:top-4 left-3 md:left-4">
                        <div className="flex items-center gap-1 md:gap-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 md:px-3 py-1 md:py-2 rounded-full border border-yellow-500/30">
                          <svg
                            className="w-3 h-3 md:w-4 md:h-4 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="font-bold">{item.rating}</span>
                        </div>
                      </div>
                    )}

                    {/* Quality Badge */}
                    <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4">
                      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs px-2 md:px-3 py-1 rounded-full font-bold shadow-lg border border-green-400/30">
                        4K HDR
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Content */}
                  <div className="p-4 md:p-6">
                    <h4 className="text-white font-bold text-base md:text-xl mb-3 line-clamp-2 group-hover:text-purple-400 transition-colors duration-500">
                      {item.title}
                    </h4>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-3 h-3 md:w-4 md:h-4 text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-gray-400 text-sm font-medium">
                          {item.duration} dk
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-sm font-semibold">
                          CANLI
                        </span>
                      </div>
                    </div>

                    {/* Enhanced Categories */}
                    {item.categories && item.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.categories
                          .slice(0, 2)
                          .map((category, catIndex) => (
                            <span
                              key={catIndex}
                              className="bg-gradient-to-r from-gray-700/80 to-gray-600/80 text-gray-300 text-xs px-2 md:px-3 py-1 rounded-lg font-medium border border-gray-600/50 hover:border-purple-500/50 transition-colors duration-300"
                            >
                              {category}
                            </span>
                          ))}
                        {item.categories.length > 2 && (
                          <span className="bg-gradient-to-r from-purple-700/50 to-pink-700/50 text-purple-300 text-xs px-2 md:px-3 py-1 rounded-lg font-medium border border-purple-500/30">
                            +{item.categories.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Enhanced Progress Bar (if current) */}
                    {index === currentIndex && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                          <span className="font-medium">Şimdi Oynatılıyor</span>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-red-400 font-bold">
                              CANLI
                            </span>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full transition-all duration-100 relative overflow-hidden"
                            style={{ width: `${progress}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Enhanced Action Buttons */}
                    <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm py-2 px-4 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 transform hover:scale-105">
                        İzle
                      </button>
                      <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-sm py-2 px-3 rounded-lg transition-all duration-300 hover:scale-105">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Platform Statistics */}
          <div className="mt-12 md:mt-20 bg-gradient-to-r from-black/50 to-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 hover:bg-gradient-to-r hover:from-black/60 hover:to-gray-800/60 transition-colors duration-500">
            <h4 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 text-center">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Platform İstatistikleri
              </span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors duration-300">
                  {items.length}
                </div>
                <div className="text-gray-400 text-sm">Toplam İçerik</div>
              </div>
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="text-2xl md:text-3xl font-bold text-green-400 mb-2 group-hover:text-green-300 transition-colors duration-300">
                  CANLI
                </div>
                <div className="text-gray-400 text-sm">Yayın Durumu</div>
              </div>
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-2 group-hover:text-yellow-300 transition-colors duration-300">
                  4K
                </div>
                <div className="text-gray-400 text-sm">Video Kalitesi</div>
              </div>
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="text-2xl md:text-3xl font-bold text-purple-400 mb-2 group-hover:text-purple-300 transition-colors duration-300">
                  HDR
                </div>
                <div className="text-gray-400 text-sm">Görüntü Teknolojisi</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
