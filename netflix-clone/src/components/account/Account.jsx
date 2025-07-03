import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiService from "../../services/api";
import "./Account.css";

const Account = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [passwordStrength, setPasswordStrength] = useState("weak");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  // Personal Info state
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthdate: "",
    country: "",
    username: "",
    avatar: "",
  });

  // Password change state
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notification preferences state
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNotifications: true,
    newReleases: true,
    recommendations: true,
    accountActivity: true,
    marketingEmails: false,
  });

  // Playback preferences state
  const [playbackPrefs, setPlaybackPrefs] = useState({
    autoplay: true,
    hdStreaming: true,
    dataUsage: false,
    subtitles: true,
  });

  // Connected devices
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: "Windows PC",
      type: "desktop",
      location: "New York, US",
      lastActive: "Now",
      isCurrent: true,
    },
    {
      id: 2,
      name: "iPhone 13",
      type: "mobile",
      location: "New York, US",
      lastActive: "2 days ago",
      isCurrent: false,
    },
    {
      id: 3,
      name: "Samsung Smart TV",
      type: "tv",
      location: "New York, US",
      lastActive: "1 week ago",
      isCurrent: false,
    },
  ]);

  // Fetch user data on component mount
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

        console.log("Fetching user data...");
        const userResponse = await apiService.getCurrentUser();
        console.log("User data received:", userResponse);
        
        if (userResponse) {
          // Backend response is direct, not wrapped in success/data
          const user = userResponse;
          console.log("Mapping user data:", user);
          setPersonalInfo({
            firstName: user.first_name || "",
            lastName: user.last_name || "",
            email: user.email || "",
            phone: user.phone || "",
            birthdate: user.birthdate ? user.birthdate.split('T')[0] : "",
            country: user.country || "",
            username: user.username || "",
            avatar: user.avatar || "",
          });
          
          // Update preferences if available
          if (user.preferences) {
            // Map new backend preferences structure
            console.log("User preferences:", user.preferences);
            // For now, keep default notification settings
            // Backend preferences only have language, genres, maturity_rating
          }
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

  // Handle form input changes
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({
      ...personalInfo,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordInfo({
      ...passwordInfo,
      [name]: value,
    });

    // Simple password strength checker
    if (name === "newPassword") {
      if (value.length < 8) {
        setPasswordStrength("weak");
      } else if (
        value.length >= 8 &&
        (value.match(/[A-Z]/) ||
          value.match(/[0-9]/) ||
          value.match(/[^A-Za-z0-9]/))
      ) {
        setPasswordStrength("medium");
      } else if (
        value.length >= 10 &&
        value.match(/[A-Z]/) &&
        value.match(/[0-9]/) &&
        value.match(/[^A-Za-z0-9]/)
      ) {
        setPasswordStrength("strong");
      }
    }
  };

  // Toggle notification preferences
  const toggleNotification = (setting) => {
    setNotificationPrefs({
      ...notificationPrefs,
      [setting]: !notificationPrefs[setting],
    });
  };

  // Toggle playback preferences
  const togglePlayback = (setting) => {
    setPlaybackPrefs({
      ...playbackPrefs,
      [setting]: !playbackPrefs[setting],
    });
  };

  // Sign out specific device
  const handleSignOutDevice = (deviceId) => {
    setDevices(devices.filter((device) => device.id !== deviceId));
  };

  // Handle save profile info
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    try {
      setSaveLoading(true);
      setError("");
      
      const profileData = {
        first_name: personalInfo.firstName || "",
        last_name: personalInfo.lastName || "",
      };
      
      // Sadece dolu alanları gönder - email alanını güncelleme çünkü değiştirilemez
      if (personalInfo.phone && personalInfo.phone.trim() !== "") {
        profileData.phone = personalInfo.phone.trim();
      }
      
      if (personalInfo.birthdate && personalInfo.birthdate.trim() !== "") {
        profileData.birthdate = personalInfo.birthdate;
      }
      
      if (personalInfo.country && personalInfo.country.trim() !== "") {
        profileData.country = personalInfo.country.trim();
      }
      
      console.log("Sending profile data:", profileData);
      
      const response = await apiService.updateUserProfile(profileData);
      
      console.log("Profile save response:", response);
      
      if (response) {
        alert("Profile information saved successfully!");
        
        // Backend'den güncellenmiş kullanıcı bilgilerini tekrar çek
        try {
          const updatedUserResponse = await apiService.getCurrentUser();
          if (updatedUserResponse) {
            const user = updatedUserResponse;
            setPersonalInfo({
              firstName: user.first_name || "",
              lastName: user.last_name || "",
              email: user.email || "",
              phone: user.phone || "",
              birthdate: user.birthdate ? user.birthdate.split('T')[0] : "",
              country: user.country || "",
              username: user.username || "",
              avatar: user.avatar || "",
            });
          }
        } catch (refreshErr) {
          console.error("Failed to refresh user data:", refreshErr);
        }
      } else {
        setError("Failed to save profile information.");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      // Don't show error message - update was successful but fetch might fail
      // Just log the error and continue
    } finally {
      setSaveLoading(false);
    }
  };

  // Handle password update
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    try {
      setSaveLoading(true);
      setError("");
      
      console.log("Updating password...");
      
      const response = await apiService.changePassword({
        currentPassword: passwordInfo.currentPassword,
        newPassword: passwordInfo.newPassword,
      });
      
      console.log("Password update response:", response);
      
      alert("Password updated successfully!");
      // Reset password fields
      setPasswordInfo({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Error updating password:", err);
      if (err.data && err.data.message) {
        setError(err.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Failed to update password. Please try again.");
      }
    } finally {
      setSaveLoading(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmed) {
      // In a real application, you would call your backend API
      alert("Account deleted successfully.");
      navigate("/");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="account-page">
        <div className="account-container">
          <div className="loading-container">
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin fa-3x"></i>
            </div>
            <p>Loading your account information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      <div className="account-container">
        <div className="account-header">
          <h1>Account Settings</h1>
          <p>
            Manage your personal information, security settings, subscription
            details, and preferences
          </p>
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}
        </div>

        <div className="account-content">
          {/* Sidebar Navigation */}
          <div className="account-sidebar">
            <div className="account-nav">
              <ul>
                <li>
                  <a
                    href="#personal"
                    className={activeTab === "personal" ? "active" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("personal");
                    }}
                  >
                    <i className="fas fa-user"></i>
                    Personal Information
                  </a>
                </li>
                <li>
                  <a
                    href="#security"
                    className={activeTab === "security" ? "active" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("security");
                    }}
                  >
                    <i className="fas fa-lock"></i>
                    Security
                  </a>
                </li>
                <li>
                  <a
                    href="#subscription"
                    className={activeTab === "subscription" ? "active" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("subscription");
                    }}
                  >
                    <i className="fas fa-credit-card"></i>
                    Subscription
                  </a>
                </li>
                <li>
                  <a
                    href="#preferences"
                    className={activeTab === "preferences" ? "active" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("preferences");
                    }}
                  >
                    <i className="fas fa-sliders-h"></i>
                    Preferences
                  </a>
                </li>
                <li>
                  <a
                    href="#devices"
                    className={activeTab === "devices" ? "active" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("devices");
                    }}
                  >
                    <i className="fas fa-laptop"></i>
                    Devices
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="account-main">
            {/* Personal Information */}
            {activeTab === "personal" && (
              <div>
                <h2 className="section-title">
                  <i className="fas fa-user"></i> Personal Information
                </h2>

                <div className="profile-upload">
                  <div className="profile-img">
                    <img src="./images/avatar.png" alt="Profile" />
                  </div>
                  <div className="upload-controls">
                    <label className="upload-btn">
                      <i className="fas fa-upload"></i> Upload New Photo
                      <input
                        type="file"
                        style={{ display: "none" }}
                        accept="image/*"
                      />
                    </label>
                    <button className="remove-btn">
                      <i className="fas fa-trash-alt"></i> Remove Photo
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="username">Username</label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        className="form-control"
                        value={personalInfo.username}
                        disabled
                        title="Username cannot be changed"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="form-control"
                        value={personalInfo.firstName}
                        onChange={handlePersonalInfoChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="form-control"
                        value={personalInfo.lastName}
                        onChange={handlePersonalInfoChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        value={personalInfo.email}
                        disabled
                        title="Email address cannot be changed"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="form-control"
                        value={personalInfo.phone}
                        onChange={handlePersonalInfoChange}
                        placeholder="e.g., +90 555 123 4567 (Optional)"
                        pattern="[\+]?[\d\s\-\(\)]{10,25}"
                        title="Enter a valid phone number (10-25 characters, numbers, spaces, dashes, parentheses allowed)"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="birthdate">Date of Birth</label>
                      <input
                        type="date"
                        id="birthdate"
                        name="birthdate"
                        className="form-control"
                        value={personalInfo.birthdate}
                        onChange={handlePersonalInfoChange}
                        placeholder="Optional"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="country">Country</label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        className="form-control"
                        value={personalInfo.country}
                        onChange={handlePersonalInfoChange}
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <div className="form-action">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={saveLoading}
                    >
                      {saveLoading ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i>
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div>
                <h2 className="section-title">
                  <i className="fas fa-lock"></i> Security Settings
                </h2>

                <form onSubmit={handleUpdatePassword}>
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      className="form-control"
                      value={passwordInfo.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      className="form-control"
                      value={passwordInfo.newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                    <div className="password-meter">
                      <div
                        className={`password-strength strength-${passwordStrength}`}
                      ></div>
                    </div>
                    <div className="password-feedback">
                      <span className="password-label">Password Strength:</span>
                      <span
                        className={`password-status status-${passwordStrength}`}
                      >
                        {passwordStrength.charAt(0).toUpperCase() +
                          passwordStrength.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="form-control"
                      value={passwordInfo.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>

                  <div className="form-action">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={saveLoading}
                    >
                      {saveLoading ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i>
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </button>
                  </div>
                </form>

                <div className="danger-zone">
                  <h3>Danger Zone</h3>
                  <div className="danger-actions">
                    <button
                      className="danger-btn"
                      onClick={handleDeleteAccount}
                    >
                      <i className="fas fa-trash-alt"></i> Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Subscription */}
            {activeTab === "subscription" && (
              <div>
                <h2 className="section-title">
                  <i className="fas fa-credit-card"></i> Subscription
                </h2>

                <div className="subscription-card">
                  <div className="subscription-header">
                    <h3>Premium Plan</h3>
                    <span className="subscription-badge badge-active">
                      Active
                    </span>
                  </div>

                  <div className="subscription-details">
                    <div className="subscription-item">
                      <span className="subscription-label">Billing Cycle</span>
                      <span className="subscription-value">Monthly</span>
                    </div>
                    <div className="subscription-item">
                      <span className="subscription-label">
                        Next Billing Date
                      </span>
                      <span className="subscription-value">May 15, 2025</span>
                    </div>
                    <div className="subscription-item">
                      <span className="subscription-label">Amount</span>
                      <span className="subscription-value">$14.99/month</span>
                    </div>
                    <div className="subscription-item">
                      <span className="subscription-label">Status</span>
                      <span className="subscription-value">Active</span>
                    </div>
                  </div>

                  <div className="subscription-features">
                    <h4>Your Plan Includes:</h4>
                    <div className="feature-list">
                      <div className="feature-item">
                        <i className="fas fa-check-circle"></i> Unlimited Access
                      </div>
                      <div className="feature-item">
                        <i className="fas fa-check-circle"></i> Ad-Free
                        Experience
                      </div>
                      <div className="feature-item">
                        <i className="fas fa-check-circle"></i> HD Streaming
                      </div>
                      <div className="feature-item">
                        <i className="fas fa-check-circle"></i> Offline
                        Downloads
                      </div>
                      <div className="feature-item">
                        <i className="fas fa-check-circle"></i> Multiple Devices
                      </div>
                      <div className="feature-item">
                        <i className="fas fa-check-circle"></i> Premium Support
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="section-title">Payment Method</h3>

                <div className="payment-method">
                  <div className="payment-icon">
                    <i className="fab fa-cc-visa"></i>
                  </div>
                  <div className="payment-details">
                    <h4>VISA ending in 4242</h4>
                    <div className="payment-info">Expires 12/2026</div>
                  </div>
                  <div className="payment-actions">
                    <button className="edit-btn">
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button className="remove-btn">
                      <i className="fas fa-trash-alt"></i> Remove
                    </button>
                  </div>
                </div>

                <div className="form-action">
                  <button className="btn btn-secondary">
                    Cancel Subscription
                  </button>
                  <button className="btn btn-primary">Upgrade Plan</button>
                </div>
              </div>
            )}

            {/* Preferences */}
            {activeTab === "preferences" && (
              <div>
                <h2 className="section-title">
                  <i className="fas fa-sliders-h"></i> Preferences
                </h2>

                <div className="preference-group">
                  <h3 className="preference-title">Notification Settings</h3>

                  <div className="toggle-row">
                    <div>
                      <div className="toggle-label">Email Notifications</div>
                      <div className="toggle-description">
                        Receive emails about your account activity
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notificationPrefs.emailNotifications}
                        onChange={() =>
                          toggleNotification("emailNotifications")
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-row">
                    <div>
                      <div className="toggle-label">New Releases</div>
                      <div className="toggle-description">
                        Be notified about new content releases
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notificationPrefs.newReleases}
                        onChange={() => toggleNotification("newReleases")}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-row">
                    <div>
                      <div className="toggle-label">
                        Personalized Recommendations
                      </div>
                      <div className="toggle-description">
                        Receive customized content suggestions
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notificationPrefs.recommendations}
                        onChange={() => toggleNotification("recommendations")}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-row">
                    <div>
                      <div className="toggle-label">Account Activity</div>
                      <div className="toggle-description">
                        Get notified about important account events
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notificationPrefs.accountActivity}
                        onChange={() => toggleNotification("accountActivity")}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-row">
                    <div>
                      <div className="toggle-label">Marketing Emails</div>
                      <div className="toggle-description">
                        Receive promotional offers and updates
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notificationPrefs.marketingEmails}
                        onChange={() => toggleNotification("marketingEmails")}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="preference-group">
                  <h3 className="preference-title">Playback Settings</h3>

                  <div className="toggle-row">
                    <div>
                      <div className="toggle-label">Autoplay</div>
                      <div className="toggle-description">
                        Automatically play next episode or recommended content
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={playbackPrefs.autoplay}
                        onChange={() => togglePlayback("autoplay")}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-row">
                    <div>
                      <div className="toggle-label">HD Streaming</div>
                      <div className="toggle-description">
                        Stream content in high definition when available
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={playbackPrefs.hdStreaming}
                        onChange={() => togglePlayback("hdStreaming")}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-row">
                    <div>
                      <div className="toggle-label">Data Saver</div>
                      <div className="toggle-description">
                        Reduce data usage while streaming
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={playbackPrefs.dataUsage}
                        onChange={() => togglePlayback("dataUsage")}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-row">
                    <div>
                      <div className="toggle-label">Subtitles</div>
                      <div className="toggle-description">
                        Show subtitles by default when available
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={playbackPrefs.subtitles}
                        onChange={() => togglePlayback("subtitles")}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="form-action">
                  <button className="btn btn-primary">Save Preferences</button>
                </div>
              </div>
            )}

            {/* Devices */}
            {activeTab === "devices" && (
              <div>
                <h2 className="section-title">
                  <i className="fas fa-laptop"></i> Connected Devices
                </h2>

                <div className="device-list">
                  {devices.map((device) => (
                    <div className="device-item" key={device.id}>
                      <div className="device-icon">
                        <i
                          className={`fas fa-${
                            device.type === "desktop"
                              ? "desktop"
                              : device.type === "mobile"
                              ? "mobile-alt"
                              : device.type === "tv"
                              ? "tv"
                              : "tablet"
                          }`}
                        ></i>
                      </div>
                      <div className="device-details">
                        <div className="device-name">
                          {device.name}
                          {device.isCurrent && (
                            <span className="current">Current Device</span>
                          )}
                        </div>
                        <div className="device-meta">
                          <span>{device.location}</span>
                          <span>Last active: {device.lastActive}</span>
                        </div>
                      </div>
                      {!device.isCurrent && (
                        <div className="device-action">
                          <button
                            className="signout-btn"
                            onClick={() => handleSignOutDevice(device.id)}
                          >
                            <i className="fas fa-sign-out-alt"></i> Sign Out
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="form-action">
                  <button className="btn btn-danger">
                    Sign Out All Devices
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
