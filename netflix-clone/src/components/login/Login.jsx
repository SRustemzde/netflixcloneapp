// src/components/login/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import edildi
import { useAuth } from "../../contexts/AuthContext"; // AuthContext import et
import "./Login.css";

export default function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true); // isLogin -> isLoginMode (daha açıklayıcı)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Kayıt için (full name)
  const [username, setUsername] = useState(""); // Kullanıcı adı
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Yükleme durumu için state

  const navigate = useNavigate(); // Yönlendirme için
  const { login, register, isAuthenticated } = useAuth(); // AuthContext'ten gerekli fonksiyonları al

  // Eğer kullanıcı zaten giriş yapmışsa ana sayfaya yönlendir
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const toggleAuthMode = () => {
    setIsLoginMode(!isLoginMode);
    setError("");
    // Form alanlarını temizle
    setEmail("");
    setPassword("");
    setName("");
    setUsername("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Lütfen email ve şifre alanlarını doldurun.");
      setLoading(false);
      return;
    }
    if (!isLoginMode && (!name || !username)) {
      setError("Lütfen ad soyad ve kullanıcı adı alanlarını doldurun.");
      setLoading(false);
      return;
    }
    
    if (!isLoginMode && password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      setLoading(false);
      return;
    }
    
    if (!isLoginMode && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError("Şifre en az bir büyük harf, bir küçük harf ve bir sayı içermelidir.");
      setLoading(false);
      return;
    }
    
    if (!isLoginMode && !/^[a-zA-Z0-9_-]+$/.test(username)) {
      setError("Kullanıcı adı sadece harf, sayı, tire ve alt çizgi içerebilir.");
      setLoading(false);
      return;
    }
    
    if (!isLoginMode && (username.length < 3 || username.length > 20)) {
      setError("Kullanıcı adı 3-20 karakter arasında olmalıdır.");
      setLoading(false);
      return;
    }

    try {
      if (isLoginMode) {
        // Giriş yapma isteği
        const response = await login({ email, password });
        console.log("Login successful:", response);
        if (response.success) {
          // AuthContext giriş başarılı olduğunda otomatik olarak navigate edecek
          navigate("/"); // Ana sayfaya yönlendir
        } else {
          setError(response.error || "Giriş yapılamadı.");
        }
      } else {
        // Kayıt olma isteği
        const registrationData = { 
          username, 
          email, 
          password, 
          name: name
        };
        console.log("Sending registration data:", registrationData);
        const response = await register(registrationData);
        console.log("Registration successful:", response);
        if (response.success) {
          // Başarılı kayıttan sonra kullanıcıyı bilgilendir ve otomatik login yap
          alert("Kayıt başarılı! Otomatik giriş yapılıyor...");
          navigate("/"); // Ana sayfaya yönlendir
        } else {
          setError(response.error || "Kayıt sırasında bir hata oluştu.");
        }
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError(
        isLoginMode
          ? "Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin."
          : "Kayıt sırasında bir hata oluştu."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="background-overlay">
        <div className="overlay"></div>
        <div className="background-image-container">
          {/* Placeholder, gerçek bir resim URL'si veya statik dosya kullanılabilir */}
          <img
            src="/images/img/slide1.jpg" // Bu yol public klasörüne göre olmalı veya import edilmeli
            alt="Film Arkaplan"
            className="background-image"
          />
        </div>
      </div>

      <header className="login-header">
        <div className="header-content">
          <div className="logo">FilmFlix</div>
        </div>
      </header>

      <main className="login-main">
        <div className="auth-form-container">
          <h2 className="auth-title">
            {isLoginMode ? "Giriş Yap" : "Kayıt Ol"}
          </h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLoginMode && (
              <>
                <div className="form-group">
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                    placeholder=" "
                    required
                  />
                  <label htmlFor="name" className="form-label">
                    Ad Soyad
                  </label>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-input"
                    placeholder=" "
                    required
                    pattern="^[a-zA-Z0-9_-]+$"
                    minLength={3}
                    maxLength={20}
                    title="Kullanıcı adı sadece harf, sayı, tire ve alt çizgi içerebilir (3-20 karakter)"
                  />
                  <label htmlFor="username" className="form-label">
                    Kullanıcı Adı
                  </label>
                </div>
              </>
            )}

            <div className="form-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder=" "
                required
              />
              <label htmlFor="email" className="form-label">
                E-posta
              </label>
            </div>

            <div className="form-group">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder=" "
                required
                minLength={isLoginMode ? undefined : 6} // Kayıt olurken min 6 karakter
                pattern={isLoginMode ? undefined : "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$"}
                title={isLoginMode ? undefined : "Şifre en az bir büyük harf, bir küçük harf ve bir sayı içermelidir"}
              />
              <label htmlFor="password" className="form-label">
                Şifre
              </label>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading
                ? isLoginMode
                  ? "Giriş Yapılıyor..."
                  : "Kayıt Olunuyor..."
                : isLoginMode
                ? "Giriş Yap"
                : "Kayıt Ol"}
            </button>

            <div className="auth-switch">
              {isLoginMode
                ? "FilmFlix'e yeni misiniz?"
                : "Zaten hesabınız var mı?"}
              <span onClick={toggleAuthMode} className="auth-switch-link">
                {isLoginMode ? "Şimdi kaydolun." : "Giriş yapın."}
              </span>
            </div>
          </form>
        </div>
      </main>

      <footer className="login-footer">
        <div className="footer-content">
          <p className="copyright">
            © 2025 ByRustemzade. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
}
