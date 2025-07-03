import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Notifications.css";

const Notifications = () => {
  // Bildirimler için örnek veri (gerçek uygulamada API'den veya Redux store'dan gelecektir)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "new_content",
      title: "New Release: Inception 2",
      message:
        "The long-awaited sequel to Christopher Nolan's mind-bending thriller is now available to stream exclusively on PurpleStream.",
      time: "10 minutes ago",
      image: "/images/covers/inception2.jpg",
      read: false,
      link: "/singlePage/101",
    },
    {
      id: 2,
      type: "recommendation",
      title: "Recommended for You: The Matrix Resurrections",
      message:
        "Based on your viewing history, we think you'll enjoy this sci-fi action film starring Keanu Reeves.",
      time: "2 hours ago",
      image: "/images/covers/matrix.jpg",
      read: false,
      link: "/singlePage/102",
    },
    {
      id: 3,
      type: "account",
      title: "Subscription Renewal",
      message:
        "Your PurpleStream Premium subscription will automatically renew in 3 days. Please ensure your payment method is up to date.",
      time: "Yesterday",
      image: null,
      read: true,
      link: "/account",
    },
    {
      id: 4,
      type: "new_content",
      title: "New Episodes Added",
      message:
        "Season 4 of 'Stranger Things' has just been added to our library. Continue watching from where you left off.",
      time: "2 days ago",
      image: "/images/covers/strangerthings.jpg",
      read: true,
      link: "/singlePage/103",
    },
    {
      id: 5,
      type: "system",
      title: "PurpleStream App Update",
      message:
        "We've rolled out a new update with improved streaming quality and bug fixes. Restart your app to apply the changes.",
      time: "3 days ago",
      image: null,
      read: true,
      link: null,
    },
    {
      id: 6,
      type: "recommendation",
      title: "Weekend Movie Marathon",
      message:
        "Check out our curated collection of action thrillers for your weekend viewing pleasure.",
      time: "5 days ago",
      image: "/images/covers/actionthrillers.jpg",
      read: true,
      link: "/category/action",
    },
    {
      id: 7,
      type: "new_content",
      title: "Original Series Premier",
      message:
        "PurpleStream Original 'Dark Horizons' has just premiered. Watch the first episode now!",
      time: "1 week ago",
      image: "/images/covers/darkhorizons.jpg",
      read: false,
      link: "/singlePage/104",
    },
    {
      id: 8,
      type: "account",
      title: "Profile Settings Updated",
      message:
        "Your account password was recently changed. If you didn't make this change, please contact customer support immediately.",
      time: "1 week ago",
      image: null,
      read: true,
      link: "/account/security",
    },
    {
      id: 9,
      type: "recommendation",
      title: "Because You Watched Interstellar",
      message:
        "We've added more science fiction movies similar to Interstellar that you might enjoy.",
      time: "2 weeks ago",
      image: "/images/covers/scififollection.jpg",
      read: true,
      link: "/recommendations/scifi",
    },
    {
      id: 10,
      type: "system",
      title: "New Feature: Watch Party",
      message:
        "You can now watch movies together with friends using our new Watch Party feature!",
      time: "2 weeks ago",
      image: null,
      read: true,
      link: "/features/watchparty",
    },
  ]);

  // SVG animasyonlu arka plan için referans
  const svgRef = useRef(null);

  // Aktif filtre (all, unread, veya bir bildirim tipi)
  const [activeFilter, setActiveFilter] = useState("all");

  // Filtre seçenekleri
  const filters = [
    { id: "all", name: "All Notifications" },
    { id: "unread", name: "Unread" },
    { id: "new_content", name: "New Content" },
    { id: "recommendation", name: "Recommendations" },
    { id: "account", name: "Account" },
    { id: "system", name: "System" },
  ];

  // SVG animasyon başlatma
  useEffect(() => {
    // SVG yüklendikten sonra animasyonları başlat
    if (svgRef.current) {
      // SVG animasyonları hali hazırda SVG içinde tanımlıdır
      console.log("SVG background loaded");
    }
  }, []);

  // Filtrelenmiş bildirimleri hesaplayalım
  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !notification.read;
    return notification.type === activeFilter;
  });

  // Bildirim okundu olarak işaretleme fonksiyonu
  const markAsRead = (notificationId) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Tüm bildirimleri okundu olarak işaretle
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  // Okunmamış bildirim sayısı
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  // Bildirim öğesi üzerine tıklama işleyicisi
  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    // Bildirime bağlı olarak yönlendirme işlemi (gerçek uygulamada burada yönlendirme olacak)
    console.log(`Navigating to: ${notification.link}`);
  };

  // Bildirim türüne göre ikon seçimi
  const getNotificationIcon = (type) => {
    switch (type) {
      case "new_content":
        return <i className="fas fa-film"></i>;
      case "recommendation":
        return <i className="fas fa-thumbs-up"></i>;
      case "account":
        return <i className="fas fa-user-shield"></i>;
      case "system":
        return <i className="fas fa-cog"></i>;
      default:
        return <i className="fas fa-bell"></i>;
    }
  };

  // Bildirim türüne göre renk sınıfı
  const getTypeColorClass = (type) => {
    switch (type) {
      case "new_content":
        return "type-new";
      case "recommendation":
        return "type-recommendation";
      case "account":
        return "type-account";
      case "system":
        return "type-system";
      default:
        return "";
    }
  };

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div className="animated-bg" ref={svgRef}>
          <svg viewBox="0 0 1200 400" xmlns="http://www.w3.org/2000/svg">
            {/* Ana Arkaplan */}
            <defs>
              <radialGradient
                id="bgGradient"
                cx="50%"
                cy="50%"
                r="70%"
                fx="50%"
                fy="50%"
              >
                <stop offset="0%" stopColor="#3a0b75" />
                <stop offset="100%" stopColor="#150327" />
              </radialGradient>

              {/* 3D Işık Efekti */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="10" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Parıltı Efekti */}
              <filter id="shimmer" x="0" y="0" width="100%" height="100%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.01"
                  numOctaves="3"
                  seed="0"
                  result="noise"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="noise"
                  scale="5"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>

              {/* Holografik Gradyan */}
              <linearGradient
                id="holoGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#9d4edd" stopOpacity="0.8">
                  <animate
                    attributeName="stop-color"
                    values="#9d4edd;#c77dff;#7b2cbf;#9d4edd"
                    dur="10s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="50%" stopColor="#c77dff" stopOpacity="0.6">
                  <animate
                    attributeName="stop-color"
                    values="#c77dff;#7b2cbf;#9d4edd;#c77dff"
                    dur="10s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="100%" stopColor="#7b2cbf" stopOpacity="0.8">
                  <animate
                    attributeName="stop-color"
                    values="#7b2cbf;#9d4edd;#c77dff;#7b2cbf"
                    dur="10s"
                    repeatCount="indefinite"
                  />
                </stop>
              </linearGradient>

              {/* Neon Işık Dalgaları */}
              <linearGradient
                id="neonGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#ff00cc" stopOpacity="0.7">
                  <animate
                    attributeName="stop-opacity"
                    values="0.7;0.2;0.7"
                    dur="5s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="50%" stopColor="#3d0066" stopOpacity="0.5">
                  <animate
                    attributeName="stop-opacity"
                    values="0.5;0.8;0.5"
                    dur="5s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="100%" stopColor="#00ccff" stopOpacity="0.7">
                  <animate
                    attributeName="stop-opacity"
                    values="0.7;0.2;0.7"
                    dur="5s"
                    repeatCount="indefinite"
                  />
                </stop>
              </linearGradient>

              {/* Dijital Dalga Deseni */}
              <pattern
                id="wavePattern"
                x="0"
                y="0"
                width="200"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M0,40 Q50,0 100,40 Q150,80 200,40"
                  fill="none"
                  stroke="url(#neonGradient)"
                  strokeWidth="1.5"
                  opacity="0.3"
                >
                  <animate
                    attributeName="d"
                    values="M0,40 Q50,0 100,40 Q150,80 200,40;M0,40 Q50,80 100,40 Q150,0 200,40;M0,40 Q50,0 100,40 Q150,80 200,40"
                    dur="15s"
                    repeatCount="indefinite"
                  />
                </path>
              </pattern>

              {/* Hexagon Grid Doku */}
              <pattern
                id="hexGrid"
                width="70"
                height="80"
                patternUnits="userSpaceOnUse"
                patternTransform="scale(2)"
              >
                <path
                  d="M0,15 L17.5,0 L52.5,0 L70,15 L52.5,30 L17.5,30 Z"
                  fill="none"
                  stroke="#9d4edd"
                  strokeWidth="0.5"
                  opacity="0.3"
                  transform="translate(0, 0)"
                />
                <path
                  d="M0,15 L17.5,0 L52.5,0 L70,15 L52.5,30 L17.5,30 Z"
                  fill="none"
                  stroke="#9d4edd"
                  strokeWidth="0.5"
                  opacity="0.3"
                  transform="translate(0, 40)"
                />
                <path
                  d="M0,15 L17.5,0 L52.5,0 L70,15 L52.5,30 L17.5,30 Z"
                  fill="none"
                  stroke="#9d4edd"
                  strokeWidth="0.5"
                  opacity="0.3"
                  transform="translate(-35, 20)"
                />
                <path
                  d="M0,15 L17.5,0 L52.5,0 L70,15 L52.5,30 L17.5,30 Z"
                  fill="none"
                  stroke="#9d4edd"
                  strokeWidth="0.5"
                  opacity="0.3"
                  transform="translate(-35, 60)"
                />
              </pattern>
            </defs>

            {/* Arka Plan ve Temel Efektler */}
            <rect width="1200" height="400" fill="url(#bgGradient)" />
            <rect
              width="1200"
              height="400"
              fill="url(#hexGrid)"
              opacity="0.4"
            />

            {/* Dijital Dalga Katmanları */}
            <rect
              width="1200"
              height="400"
              fill="url(#wavePattern)"
              opacity="0.6"
            />
            <rect
              width="1200"
              height="400"
              fill="url(#wavePattern)"
              opacity="0.3"
              transform="rotate(180, 600, 200)"
            />

            {/* Holografik Ana Görsel */}
            <g transform="translate(600, 200)" filter="url(#shimmer)">
              <circle
                cx="0"
                cy="0"
                r="100"
                fill="url(#holoGradient)"
                opacity="0.2"
                filter="url(#glow)"
              />

              {/* Holografik Işık Halkaları */}
              <circle
                cx="0"
                cy="0"
                r="140"
                stroke="url(#holoGradient)"
                strokeWidth="2"
                fill="none"
                opacity="0.6"
              >
                <animate
                  attributeName="r"
                  values="140;150;140"
                  dur="8s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.6;0.3;0.6"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>

            {/* Uçuşan Noktalar */}
            <g>
              <circle cx="300" cy="100" r="4" fill="#ff00cc" opacity="0.8">
                <animate
                  attributeName="cy"
                  values="100;90;100"
                  dur="5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.8;0.4;0.8"
                  dur="5s"
                  repeatCount="indefinite"
                />
              </circle>

              <circle cx="400" cy="300" r="3" fill="#9d4edd" opacity="0.7">
                <animate
                  attributeName="cy"
                  values="300;310;300"
                  dur="6s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.7;0.3;0.7"
                  dur="6s"
                  repeatCount="indefinite"
                />
              </circle>

              <circle cx="800" cy="150" r="3.5" fill="#00ccff" opacity="0.6">
                <animate
                  attributeName="cy"
                  values="150;140;150"
                  dur="7s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.6;0.2;0.6"
                  dur="7s"
                  repeatCount="indefinite"
                />
              </circle>

              <circle cx="900" cy="250" r="3" fill="#9d4edd" opacity="0.7">
                <animate
                  attributeName="cy"
                  values="250;260;250"
                  dur="5.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.7;0.3;0.7"
                  dur="5.5s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          </svg>
        </div>
        <div className="notifications-header-content">
          <h1>Your Notifications</h1>
          <p>Stay updated with the latest from PurpleStream</p>
        </div>
      </div>

      <div className="notifications-container">
        <div className="notifications-sidebar">
          <div className="filter-header">
            <h3>Filters</h3>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
          </div>

          <ul className="filter-list">
            {filters.map((filter) => (
              <li
                key={filter.id}
                className={activeFilter === filter.id ? "active" : ""}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.id === "all" && <i className="fas fa-layer-group"></i>}
                {filter.id === "unread" && <i className="fas fa-envelope"></i>}
                {filter.id === "new_content" && <i className="fas fa-film"></i>}
                {filter.id === "recommendation" && (
                  <i className="fas fa-thumbs-up"></i>
                )}
                {filter.id === "account" && (
                  <i className="fas fa-user-shield"></i>
                )}
                {filter.id === "system" && <i className="fas fa-cog"></i>}

                <span>{filter.name}</span>

                {filter.id === "unread" && unreadCount > 0 && (
                  <span className="count-badge">{unreadCount}</span>
                )}
              </li>
            ))}
          </ul>

          <div className="sidebar-actions">
            {unreadCount > 0 && (
              <button className="mark-all-read" onClick={markAllAsRead}>
                <i className="fas fa-check-double"></i>
                Mark all as read
              </button>
            )}
          </div>
        </div>

        <div className="notifications-content">
          <div className="notifications-toolbar">
            <h2>
              {activeFilter === "all"
                ? "All Notifications"
                : activeFilter === "unread"
                ? "Unread Notifications"
                : `${
                    activeFilter.charAt(0).toUpperCase() +
                    activeFilter.slice(1).replace("_", " ")
                  } Notifications`}
            </h2>
            <div className="toolbar-actions">
              {filteredNotifications.length > 0 && unreadCount > 0 && (
                <button
                  className="mark-all-read-mobile"
                  onClick={markAllAsRead}
                >
                  <i className="fas fa-check-double"></i>
                  <span className="desktop-only">Mark all as read</span>
                </button>
              )}
            </div>
          </div>

          {filteredNotifications.length > 0 ? (
            <div className="notifications-list">
              {filteredNotifications.map((notification) => (
                <Link
                  to={notification.link || "#"}
                  className={`notification-item ${
                    !notification.read ? "unread" : ""
                  }`}
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div
                    className={`notification-icon ${getTypeColorClass(
                      notification.type
                    )}`}
                  >
                    {notification.image ? (
                      <img src={notification.image} alt="" />
                    ) : (
                      getNotificationIcon(notification.type)
                    )}
                  </div>

                  <div className="notification-content">
                    <div className="notification-header">
                      <h3>{notification.title}</h3>
                      <span className="notification-time">
                        {notification.time}
                      </span>
                    </div>
                    <p>{notification.message}</p>

                    <div className="notification-footer">
                      <span
                        className={`notification-type ${getTypeColorClass(
                          notification.type
                        )}`}
                      >
                        {notification.type
                          .replace("_", " ")
                          .charAt(0)
                          .toUpperCase() +
                          notification.type.replace("_", " ").slice(1)}
                      </span>

                      {!notification.read && (
                        <span className="unread-dot"></span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-notifications">
              <div className="empty-icon">
                <i className="fas fa-bell-slash"></i>
              </div>
              <h3>No notifications found</h3>
              <p>
                {activeFilter === "all"
                  ? "You don't have any notifications at the moment."
                  : `You don't have any ${
                      activeFilter === "unread"
                        ? "unread"
                        : activeFilter.replace("_", " ")
                    } notifications.`}
              </p>
              {activeFilter !== "all" && (
                <button
                  className="view-all-btn"
                  onClick={() => setActiveFilter("all")}
                >
                  View all notifications
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
