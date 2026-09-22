import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { ArrowRight, Lock, Mail, ShieldCheck, User } from "lucide-react";

export const LoginPage = ({ setCurrentView, initialMode = "player", setInitialMode }) => {
  const { login } = useAuth();
  const toast = useToast();

  const [mode, setMode] = useState(initialMode); // 'player' | 'admin'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (setInitialMode) setInitialMode(newMode);
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await login({ email, password });

      if (mode === "admin") {
        if (res.user?.role !== "admin") {
          setErrorMsg("Access Denied: This account does not have Administrator privileges. In Supabase, set the role to 'admin' in the users table.");
          setLoading(false);
          return;
        }
        toast.success(`Welcome to Admin Control Panel, ${res.user?.name}!`);
        setCurrentView("admin");
      } else {
        toast.success(`Welcome back, ${res.user?.name}!`);
        if (res.user?.role === "admin") {
          setCurrentView("admin");
        } else {
          setCurrentView("dashboard");
        }
      }
    } catch (err) {
      setErrorMsg(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#2D483A]">
          Authentication
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#181918]">
          {mode === "admin" ? "Admin Portal Access" : "Sign In to Platform"}
        </h1>
        <p className="text-xs text-[#737A74]">
          {mode === "admin"
            ? "Sign in with your verified administrator account"
            : "Access your scoring portal, draw tickets, and charity contributions"}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="p-1 bg-[#EFEBE3] rounded-xl flex items-center gap-1 border border-[#DDD7CD]">
        <button
          type="button"
          onClick={() => handleModeChange("player")}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            mode === "player"
              ? "bg-white text-[#181918] shadow-xs"
              : "text-[#6B726C] hover:text-[#181918]"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Player Sign In</span>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange("admin")}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            mode === "admin"
              ? "bg-[#181918] text-white shadow-xs"
              : "text-[#6B726C] hover:text-[#181918]"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin Portal</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="p-8 bg-white border border-[#DDD7CD] rounded-2xl shadow-sm space-y-5">
        {errorMsg && (
          <div className="p-3 bg-[#FDF3F3] border border-[#ECC4C4] rounded-xl text-xs text-[#7A2424] leading-relaxed">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-[#4E534E] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8E948F] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.org"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#D5CFC5] rounded-xl text-xs text-[#181918] focus:outline-none focus:border-[#2D483A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#4E534E] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8E948F] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#D5CFC5] rounded-xl text-xs text-[#181918] focus:outline-none focus:border-[#2D483A]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2 ${
              mode === "admin"
                ? "bg-[#2D483A] text-white hover:bg-[#1E3328]"
                : "bg-[#181918] text-[#FAF8F5] hover:bg-[#2D483A]"
            }`}
          >
            <span>{loading ? "Authenticating..." : mode === "admin" ? "Enter Admin Portal" : "Sign In"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#EFEBE3] text-center text-xs text-[#6B726C]">
          New player?{" "}
          <button
            type="button"
            onClick={() => setCurrentView("register")}
            className="font-semibold text-[#181918] underline hover:text-[#2D483A]"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
};
