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
    <Router>
      <Routes>
        {/* Login sayfası için özel route - header ve footer olmadan */}
        <Route path="/login" element={<Login />} />

        {/* Header ve Footer içeren diğer tüm sayfalar */}
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePages />
            </MainLayout>
          }
        />
        <Route
          path="/singlePage/:source/:id"
          element={
            <MainLayout>
              <SinglePage />
            </MainLayout>
          }
        />
        <Route
          path="/singlePage/content/:id"
          element={
            <MainLayout>
              <SinglePage />
            </MainLayout>
          }
        />
        <Route
          path="/movies"
          element={
            <MainLayout>
              <Movies />
            </MainLayout>
          }
        />
        <Route
          path="/series"
          element={
            <MainLayout>
              <Series />
            </MainLayout>
          }
        />
        <Route
          path="/mylist"
          element={
            <MainLayout>
              <MyList />
            </MainLayout>
          }
        />
        <Route
          path="/pricing"
          element={
            <MainLayout>
              <Pricing />
            </MainLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <MainLayout>
              <Profile />
            </MainLayout>
          }
        />
        <Route
          path="/account"
          element={
            <MainLayout>
              <Account />
            </MainLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <MainLayout>
              <Contact />
            </MainLayout>
          }
        />
        <Route
          path="/notifications"
          element={
            <MainLayout>
              <Notifications />
            </MainLayout>
          }
        />
        <Route
          path="/privacy"
          element={
            <MainLayout>
              <Privacy />
            </MainLayout>
          }
        />
        <Route
          path="/faq"
          element={
            <MainLayout>
              <FAQ />
            </MainLayout>
          }
        />
        <Route
          path="/category"
          element={
            <MainLayout>
              <CategoryList />
            </MainLayout>
          }
        />
        <Route
          path="/category/:categoryName"
          element={
            <MainLayout>
              <Categories />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
