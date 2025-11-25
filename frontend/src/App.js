import React, { useState, useEffect } from "react";
import HeroSection from "./components/HeroSection";
import BookingForm from "./components/BookingForm";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import Footer from "./components/Footer";
import AboutUsPage from "./components/AboutUsPage";
import "./App.css";

function App() {
  const [currentView, setCurrentView] = useState("hero");
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const adminUser = localStorage.getItem("adminUser");

    if (token && adminUser) {
      try {
        setAdmin(JSON.parse(adminUser));
        setCurrentView("admin");
      } catch (error) {
        console.log("Error parsing admin data");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
      }
    }
  }, []);

  const handleBookAppointment = () => {
    setCurrentView("booking");
  };

  const handleBackToHome = () => {
    setCurrentView("hero");
  };

  const handleAdminLogin = (adminUser) => {
    setAdmin(adminUser);
    setCurrentView("admin");
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setAdmin(null);
    setCurrentView("hero");
  };

  const handleGoToAdmin = () => {
    setCurrentView("admin-login");
  };

  const handleGoToAboutUs = () => {
    setCurrentView("about-us");
  };

  // Show footer on all pages except admin dashboard and admin login
  const showFooter = currentView !== "admin" && currentView !== "admin-login";

  return (
    <div className="App">
      {currentView === "hero" && (
        <HeroSection
          onBookAppointment={handleBookAppointment}
          onGoToAdmin={handleGoToAdmin}
          onLearnMore={handleGoToAboutUs}
        />
      )}

      {currentView === "booking" && <BookingForm onBack={handleBackToHome} />}

      {currentView === "admin-login" && (
        <AdminLogin onLogin={handleAdminLogin} />
      )}

      {currentView === "admin" && admin && (
        <AdminDashboard admin={admin} onLogout={handleAdminLogout} />
      )}

      {/* About Us Page with all navigation props */}
      {currentView === "about-us" && (
        <AboutUsPage
          onBack={handleBackToHome}
          onBookAppointment={handleBookAppointment}
          onGoToAdmin={handleGoToAdmin}
        />
      )}

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
}

export default App;
