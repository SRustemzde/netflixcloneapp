// src/components/homes/Homes.jsx
import React, { useState, useEffect } from "react";
import { HomeSlider } from "./HomeSlider.jsx";
import apiService from "../../services/api";

export const Homes = () => {
  const [heroItems, setHeroItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchHeroData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Fetching hero data...");

        const data = await apiService.getAllContent({
          limit: 4,
        });

        console.log("Hero data received:", data);
        console.log("Hero data structure:", JSON.stringify(data, null, 2));

        if (!isMounted) return;

        if (!data || !data.success || !data.data || !Array.isArray(data.data)) {
          console.log("Invalid data format or unsuccessful response:", data);
          throw new Error("Invalid data format received from API");
        }

        const mappedItems = data.data.map((apiItem) => ({
          id: apiItem.id,
          title: apiItem.title,
          cover_image_url: apiItem.cover_image_url || apiItem.thumbnail_url,
          rating: apiItem.rating,
          duration: apiItem.duration || "N/A",
          description: apiItem.description || "No description available.",
          starring: apiItem.starring || [],
          categories: apiItem.categories || [],
          tags: apiItem.tags || [],
          video_url: apiItem.video_url,
          backdrop_url: apiItem.cover_image_url,
          trailer_url: apiItem.trailer_url,
          director: apiItem.director,
          releaseYear: apiItem.release_date,
          type: apiItem.content_type,
          featured: apiItem.featured,
          trending: apiItem.trending,
        }));

        console.log("Mapped hero items:", mappedItems);

        if (isMounted) {
          setHeroItems(mappedItems);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching hero data:", err);
        if (isMounted) {
          setError(err.message || "Failed to fetch hero data.");
          setLoading(false);
        }
      }
    };

    fetchHeroData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center overflow-hidden z-50">
        {/* Dynamic Background Orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute top-3/4 right-1/3 w-48 h-48 md:w-64 md:h-64 bg-cyan-500/15 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/6 right-1/6 w-32 h-32 md:w-48 md:h-48 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-300"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 md:w-2 md:h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce opacity-60"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${1.5 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Main Loading Content */}
        <div className="relative z-10 text-center px-4">
          {/* Enhanced Multi-Ring Spinner */}
          <div className="relative mb-8">
            {/* Outer Ring */}
            <div className="w-28 h-28 md:w-36 md:h-36 border-4 border-purple-500/30 rounded-full animate-spin">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-purple-500 border-r-purple-500/50 rounded-full animate-spin"></div>
            </div>

            {/* Middle Ring - Counter Rotation */}
            <div className="absolute top-2 left-2 w-24 h-24 md:w-32 md:h-32 border-4 border-pink-500/40 rounded-full">
              <div
                className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-pink-500 border-l-pink-500/50 rounded-full animate-spin"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "1.5s",
                }}
              ></div>
            </div>

            {/* Inner Ring */}
            <div
              className="absolute top-4 left-4 w-20 h-20 md:w-28 md:h-28 border-4 border-blue-500/30 rounded-full animate-spin"
              style={{ animationDuration: "2s" }}
            >
              <div
                className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-500 border-r-blue-500/50 rounded-full animate-spin"
                style={{ animationDuration: "2s" }}
              ></div>
            </div>

            {/* Center Pulse */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-6 h-6 md:w-10 md:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-6 h-6 md:w-10 md:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>

          {/* Loading Text with Enhanced Typography */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent animate-pulse">
              Yükleniyor...
            </h2>
            <p className="text-gray-300 text-lg md:text-xl font-medium">
              Umarım Beğenirsiniz ✨
            </p>

            {/* Enhanced Loading Progress Bar */}
            <div className="relative mx-auto">
              <div className="w-72 md:w-96 h-3 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm border border-gray-600/30 shadow-lg">
                <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-full animate-pulse relative">
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse delay-300"></div>
                </div>
              </div>
            </div>

            {/* Loading Status */}
            <div className="text-sm md:text-base text-gray-400 space-y-3">
              <div className="flex items-center justify-center gap-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-200"></div>
                </div>
                <span>Sunucuya bağlanılıyor...</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-300"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-400"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-500"></div>
                </div>
                <span>İçerikler yükleniyor...</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-600"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-700"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-800"></div>
                </div>
                <span>Hazırlanıyor...</span>
              </div>
            </div>
          </div>

          {/* Loading Animation Waves */}
          <div className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 flex gap-1">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full animate-pulse"
                style={{
                  height: `${16 + (i % 3) * 8}px`,
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: "1.2s",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-red-900/20 via-slate-900 to-red-900/20 flex items-center justify-center p-4">
        {/* Animated Error Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 md:w-96 md:h-96 bg-red-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 md:w-96 md:h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-600/15 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 max-w-md w-full">
          <div className="bg-gray-900/90 backdrop-blur-xl border border-red-500/30 rounded-3xl p-6 md:p-8 shadow-2xl">
            {/* Enhanced Error Icon */}
            <div className="text-center mb-6">
              <div className="relative inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-red-500/20 rounded-full mb-4">
                <div className="absolute inset-0 bg-red-500/30 rounded-full animate-ping"></div>
                <div className="absolute inset-2 bg-red-600/20 rounded-full animate-pulse"></div>
                <svg
                  className="w-10 h-10 md:w-12 md:h-12 text-red-400 relative z-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  Bir Sorun Oluştu
                </span>
              </h2>

              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 mb-4">
                <p className="text-gray-400 text-sm leading-relaxed">
                  <span className="text-red-400 font-semibold">Hata:</span>{" "}
                  {error}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 md:py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 group"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5 group-hover:animate-spin transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0V9a8 8 0 1115.356 2m-15.356 0H4"
                    />
                  </svg>
                  <span>Tekrar Dene</span>
                </div>
              </button>

              <button
                onClick={() => window.history.back()}
                className="w-full bg-gray-700/50 hover:bg-gray-600/50 backdrop-blur-sm border border-gray-600/50 hover:border-gray-500/50 text-gray-300 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Geri Dön
              </button>
            </div>

            {/* Error Details */}
            <div className="mt-6 pt-4 border-t border-gray-700/50">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Bu sorun devam ederse, lütfen destek ekibi ile iletişime geçin
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (heroItems.length === 0 && !loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex items-center justify-center p-4">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 max-w-lg w-full text-center">
          <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 md:p-12 shadow-2xl">
            {/* Enhanced Empty State Icon */}
            <div className="relative inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 bg-gray-700/30 rounded-full mb-6 md:mb-8">
              <div className="absolute inset-0 bg-gray-600/20 rounded-full animate-pulse"></div>
              <div className="absolute inset-4 bg-gray-500/10 rounded-full animate-pulse delay-300"></div>
              <svg
                className="w-12 h-12 md:w-16 md:h-16 text-gray-400 relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                İçerik Bulunamadı
              </span>
            </h2>

            <p className="text-gray-400 text-lg mb-6 md:mb-8 leading-relaxed">
              Şu anda gösterilecek içerik bulunmuyor. Lütfen daha sonra tekrar
              deneyin.
            </p>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 md:py-4 px-6 md:px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 group"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5 group-hover:animate-spin transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0V9a8 8 0 1115.356 2m-15.356 0H4"
                    />
                  </svg>
                  <span>Sayfayı Yenile</span>
                </div>
              </button>

              <button
                onClick={() => window.history.back()}
                className="w-full bg-gray-700/50 hover:bg-gray-600/50 backdrop-blur-sm border border-gray-600/50 hover:border-gray-500/50 text-gray-300 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Ana Sayfaya Dön
              </button>
            </div>

            {/* Stats Section */}
            <div className="mt-8 pt-6 border-t border-gray-700/50">
              <h4 className="text-sm font-semibold text-gray-500 mb-4">
                Sistem Durumu
              </h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
                  <div className="text-lg md:text-xl font-bold text-purple-400">
                    0
                  </div>
                  <div className="text-xs md:text-sm text-gray-500">İçerik</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
                  <div className="text-lg md:text-xl font-bold text-red-400">
                    Offline
                  </div>
                  <div className="text-xs md:text-sm text-gray-500">Durum</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
                  <div className="text-lg md:text-xl font-bold text-yellow-400">
                    Error
                  </div>
                  <div className="text-xs md:text-sm text-gray-500">Sistem</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log("Rendering HomeSlider with items:", heroItems);

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      <HomeSlider items={heroItems} />
    </div>
  );
};
