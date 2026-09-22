import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { Navbar } from "./components/common/Navbar.jsx";

// Pages
import { HomePage } from "./pages/HomePage.jsx";
import { CharitiesPage } from "./pages/CharitiesPage.jsx";
import { HowItWorksPage } from "./pages/HowItWorksPage.jsx";
import { DrawsPage } from "./pages/DrawsPage.jsx";
import { UserDashboardPage } from "./pages/UserDashboardPage.jsx";
import { AdminDashboardPage } from "./pages/AdminDashboardPage.jsx";
import { SubscribePage } from "./pages/SubscribePage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { RegisterPage } from "./pages/RegisterPage.jsx";

// Services
import { drawService } from "./services/drawService.js";
import { charityService } from "./services/charityService.js";

const MainLayout = () => {
  const { user, isAdmin } = useAuth();
  const [currentView, setCurrentView] = useState("home");
  const [loginMode, setLoginMode] = useState("player");
  const [activeDraw, setActiveDraw] = useState(null);
  const [charities, setCharities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [spotlightCharity, setSpotlightCharity] = useState(null);
  const [selectedCharity, setSelectedCharity] = useState(null);

  useEffect(() => {
    const initData = async () => {
      try {
        const [drawRes, charRes, spotRes] = await Promise.all([
          drawService.getActiveDraw().catch(() => null),
          charityService.getAll().catch(() => ({ charities: [], categories: [] })),
          charityService.getSpotlight().catch(() => null)
        ]);

        setActiveDraw(drawRes);
        setCharities(charRes.charities || []);
        setCategories(charRes.categories || []);
        setSpotlightCharity(spotRes);
        if (charRes.charities?.length > 0) {
          setSelectedCharity(charRes.charities[0]);
        }
      } catch (err) {
        console.error("Initialization failed", err);
      }
    };
    initData();
  }, []);

  const handleSelectCharity = (charity) => {
    setSelectedCharity(charity);
  };

  const handleDirectDonation = async (donationData) => {
    return await charityService.donate(donationData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#181918]">
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onAdminPortalClick={() => {
          if (isAdmin) {
            setCurrentView("admin");
          } else {
            setLoginMode("admin");
            setCurrentView("login");
          }
        }}
      />

      <main className="flex-1 pb-16">
        {currentView === "home" && (
          <HomePage
            setCurrentView={setCurrentView}
            activeDraw={activeDraw}
            spotlightCharity={spotlightCharity}
            onOpenDonate={(c) => {
              setSelectedCharity(c);
              setCurrentView("charities");
            }}
            onSelectCharity={handleSelectCharity}
          />
        )}

        {currentView === "charities" && (
          <CharitiesPage
            charities={charities}
            categories={categories}
            selectedCharityId={selectedCharity?.id}
            onSelectCharity={handleSelectCharity}
            onDirectDonation={handleDirectDonation}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === "how-it-works" && (
          <HowItWorksPage setCurrentView={setCurrentView} />
        )}

        {currentView === "draws" && (
          <DrawsPage setCurrentView={setCurrentView} />
        )}

        {currentView === "dashboard" && (
          <UserDashboardPage setCurrentView={setCurrentView} />
        )}

        {currentView === "admin" && (
          isAdmin ? (
            <AdminDashboardPage />
          ) : (
            <div className="max-w-md mx-auto py-20 text-center space-y-4 px-4">
              <h2 className="text-2xl font-bold">Admin Authentication Required</h2>
              <p className="text-xs text-[#575C57]">
                You must sign in with an account that has been designated as an Administrator.
              </p>
              <button
                onClick={() => {
                  setLoginMode("admin");
                  setCurrentView("login");
                }}
                className="px-5 py-2.5 bg-[#181918] text-white rounded-lg text-xs font-semibold hover:bg-[#2D483A] transition-colors"
              >
                Sign In as Administrator
              </button>
            </div>
          )
        )}

        {currentView === "subscribe" && (
          <SubscribePage
            selectedCharity={selectedCharity}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === "login" && (
          <LoginPage
            setCurrentView={setCurrentView}
            initialMode={loginMode}
            setInitialMode={setLoginMode}
          />
        )}

        {currentView === "register" && (
          <RegisterPage setCurrentView={setCurrentView} />
        )}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainLayout />
      </ToastProvider>
    </AuthProvider>
  );
}
