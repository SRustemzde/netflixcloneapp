import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/header/Header";
import { HomePages } from "./home/HomePages";
import { Footer } from "./components/footer/Footer";
import { SinglePage } from "./components/watch/SinglePage";
import Movies from "./components/movies/Movies";
import Series from "./components/series/Series";
import MyList from "./components/mylist/MyList";
import Pricing from "./components/pricing/Pricing";
import Profile from "./components/profile/Profile";
import Account from "./components/account/Account";
import Contact from "./components/contact/Contact";
import Notifications from "./components/notifications/Notifications";
import Privacy from "./components/privacy/Privacy";
import FAQ from "./components/faq/FAQ";
import Categories from "./components/categories/Categories";
import CategoryList from "./components/categories/CategoryList";
import Login from "./components/login/Login";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Layout bileşeni - header ve footer içeren normal layout
const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Login sayfası için özel route - header ve footer olmadan */}
          <Route path="/login" element={<Login />} />

          {/* Header ve Footer içeren diğer tüm sayfalar - Authentication gerektiren */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <HomePages />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/singlePage/:source/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <SinglePage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/singlePage/content/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <SinglePage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/movies"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Movies />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/series"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Series />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mylist"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <MyList />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pricing"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Pricing />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Account />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Contact />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Notifications />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/privacy"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Privacy />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/faq"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <FAQ />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/category"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CategoryList />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/category/:categoryName"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Categories />
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
