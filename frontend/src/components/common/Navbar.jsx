import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { Badge } from "./Badge.jsx";
import { Menu, X, ShieldCheck, HeartHandshake, Award, Sparkles, LogOut, ArrowRight, User } from "lucide-react";

export const Navbar = ({ currentView, setCurrentView, onAdminPortalClick }) => {
  const { user, logout, hasActiveSubscription, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Overview" },
    { id: "charities", label: "Charities" },
    { id: "how-it-works", label: "How It Works" },
    { id: "draws", label: "The Draw" }
  ];

  const handleNavClick = (viewId) => {
    setCurrentView(viewId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 border-b border-[#E6E1D6] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div
            onClick={() => handleNavClick("home")}
            className="flex items-baseline gap-2.5 cursor-pointer group select-none"
          >
            <span className="font-editorial text-2xl font-bold tracking-tight text-[#181918]">
              The platform<span className="text-[#2D483A] font-serif italic">.</span>
            </span>
            <span className="hidden md:inline-block text-[11px] font-mono-code uppercase text-[#737A74] tracking-widest pl-2 border-l border-[#DDD7CD]">
              Impact & Rewards
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {navItems.map((item) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? "text-[#181918] bg-[#F1EDE4] font-semibold"
                      : "text-[#575C57] hover:text-[#181918] hover:bg-[#F6F3EB]"
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Subscriber Dashboard Link */}
            {user && (
              <button
                onClick={() => handleNavClick("dashboard")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  currentView === "dashboard"
                    ? "text-[#181918] bg-[#F1EDE4] font-semibold"
                    : "text-[#575C57] hover:text-[#181918] hover:bg-[#F6F3EB]"
                }`}
              >
                <span>Dashboard</span>
              </button>
            )}

            {/* Admin Control Surface Link */}
            {isAdmin && (
              <button
                onClick={() => handleNavClick("admin")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  currentView === "admin"
                    ? "text-[#181918] bg-[#F1EDE4] font-semibold"
                    : "text-[#2D483A] hover:text-[#181918] hover:bg-[#F6F3EB]"
                }`}
              >
                <span className="font-semibold">Admin Panel</span>
              </button>
            )}
          </nav>

          {/* User Status / Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Subscription Status Indicator */}
                <div className="flex items-center gap-2 pl-3 pr-2 py-1 bg-[#F4F1EA] rounded-full border border-[#E0D9CD]">
                  <span className="w-2 h-2 rounded-full bg-[#2D483A]" />
                  <span className="text-xs font-mono-code font-medium text-[#2E312E] truncate max-w-[120px]">
                    {user.name.split(" ")[0]}
                  </span>
                  {hasActiveSubscription ? (
                    <Badge variant="active" className="text-[10px] py-0">Active</Badge>
                  ) : (
                    <Badge variant="pending" className="text-[10px] py-0">Unsubscribed</Badge>
                  )}
                </div>

                {!hasActiveSubscription && (
                  <button
                    onClick={() => handleNavClick("subscribe")}
                    className="px-3.5 py-1.5 rounded-md text-xs font-medium tracking-wide uppercase bg-[#2D483A] text-[#FAF8F5] hover:bg-[#1E3328] transition-colors"
                  >
                    Subscribe
                  </button>
                )}

                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-2 text-[#737A74] hover:text-[#181918] hover:bg-[#EAE4D8] rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handleNavClick("login")}
                  className="px-3.5 py-1.5 rounded-md text-sm font-medium text-[#2E312E] hover:text-[#181918] hover:bg-[#F1ECE3] transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={onAdminPortalClick}
                  className="px-3 py-1.5 rounded-md text-xs font-medium border border-[#D5CFC5] text-[#2D483A] hover:bg-[#EAE4D8] transition-colors"
                >
                  Admin Portal
                </button>
                <button
                  onClick={() => handleNavClick("subscribe")}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-[#181918] text-[#FAF8F5] hover:bg-[#2D483A] transition-colors flex items-center gap-1.5 tracking-wide shadow-xs"
                >
                  <span>Become a Member</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {user && (
              <button
                onClick={() => handleNavClick("dashboard")}
                className="p-1.5 text-[#2D483A] bg-[#EAE4D8] rounded-md"
              >
                <User className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#2E312E] hover:bg-[#EAE4D8] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E6E1D6] bg-[#F5F2EB] px-5 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="w-full text-left py-2 px-3 rounded-md text-sm font-medium text-[#181918] hover:bg-[#EAE4D8] flex items-center justify-between"
            >
              <span>{item.label}</span>
            </button>
          ))}

          {user && (
            <button
              onClick={() => handleNavClick("dashboard")}
              className="w-full text-left py-2 px-3 rounded-md text-sm font-medium text-[#181918] hover:bg-[#EAE4D8] flex items-center justify-between"
            >
              <span>Dashboard</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => handleNavClick("admin")}
              className="w-full text-left py-2 px-3 rounded-md text-sm font-semibold text-[#2D483A] hover:bg-[#EAE4D8] flex items-center justify-between"
            >
              <span>Admin Panel</span>
            </button>
          )}

          <div className="pt-3 border-t border-[#DDD7CD] flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-code text-[#575C57]">{user.email}</span>
                <button
                  onClick={logout}
                  className="text-xs font-medium text-[#8C2C2C] hover:underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleNavClick("login")}
                    className="py-2 text-center text-sm font-medium border border-[#D5CFC5] rounded-md bg-[#FAF8F5]"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleNavClick("subscribe")}
                    className="py-2 text-center text-sm font-medium bg-[#181918] text-[#FAF8F5] rounded-md"
                  >
                    Join
                  </button>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onAdminPortalClick) onAdminPortalClick();
                  }}
                  className="py-2 text-center text-xs font-medium border border-[#D5CFC5] text-[#2D483A] rounded-md bg-[#FAF8F5]"
                >
                  Admin Portal
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
