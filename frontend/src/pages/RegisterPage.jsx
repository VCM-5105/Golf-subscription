import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { charityService } from "../services/charityService.js";
import { useToast } from "../context/ToastContext.jsx";
import { ArrowRight, Lock, Mail, User, Heart, Shield } from "lucide-react";

export const RegisterPage = ({ setCurrentView }) => {
  const { register } = useAuth();
  const toast = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [handicap, setHandicap] = useState("14.0");
  const [charities, setCharities] = useState([]);
  const [selectedCharityId, setSelectedCharityId] = useState("");
  const [charityPercentage, setCharityPercentage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    charityService.getAll().then((res) => {
      const list = res.charities || [];
      setCharities(list);
      if (list.length > 0) {
        setSelectedCharityId(list[0].id);
      }
    }).catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      await register({
        name,
        email,
        password,
        handicap: Number(handicap),
        charityId: selectedCharityId || null,
        charityPercentage: Number(charityPercentage)
      });
      toast.success("Account created successfully!");
      setCurrentView("subscribe");
    } catch (err) {
      setErrorMsg(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono-code uppercase tracking-wider text-[#6B726C]">
          PLAYER REGISTRATION
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#181918]">
          Create Player Account
        </h1>
        <p className="text-xs text-[#737A74]">
          Select your designated charity and establish your player profile
        </p>
      </div>

      <div className="p-8 bg-white border border-[#DDD7CD] rounded-2xl shadow-2xs space-y-5">
        {errorMsg && (
          <div className="p-3 bg-[#FDF3F3] border border-[#ECC4C4] rounded-xl text-xs text-[#7A2424]">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono-code uppercase text-[#4E534E] mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Colin Montgomerie"
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D5CFC5] rounded-xl text-xs text-[#181918] focus:outline-none focus:border-[#2D483A]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-code uppercase text-[#4E534E] mb-1.5">
                Approx. Handicap
              </label>
              <input
                type="number"
                step="0.1"
                value={handicap}
                onChange={(e) => setHandicap(e.target.value)}
                placeholder="14.0"
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D5CFC5] rounded-xl text-xs text-[#181918] focus:outline-none focus:border-[#2D483A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-code uppercase text-[#4E534E] mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="golfer@domain.com"
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D5CFC5] rounded-xl text-xs text-[#181918] focus:outline-none focus:border-[#2D483A]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono-code uppercase text-[#4E534E] mb-1.5">
              Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D5CFC5] rounded-xl text-xs text-[#181918] focus:outline-none focus:border-[#2D483A]"
            />
          </div>


          {/* Charity Selection at Signup */}
          {charities.length > 0 && (
            <div className="pt-4 border-t border-[#EFEBE3] space-y-3">
              <div>
                <label className="block text-xs font-mono-code uppercase text-[#2D483A] font-bold mb-1.5 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5" />
                  <span>Designate Your Giving Partner</span>
                </label>
                <select
                  value={selectedCharityId}
                  onChange={(e) => setSelectedCharityId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D5CFC5] rounded-xl text-xs text-[#181918] focus:outline-none focus:border-[#2D483A]"
                >
                  <option value="">No charity preference right now</option>
                  {charities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="font-mono-code text-[#4E534E]">Contribution:</span>
                  <span className="font-mono-code font-bold text-[#2D483A]">{charityPercentage}% (Min. 10%)</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={charityPercentage}
                  onChange={(e) => setCharityPercentage(e.target.value)}
                  className="w-full accent-[#2D483A]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#181918] text-[#FAF8F5] hover:bg-[#2D483A] text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            <span>{loading ? "Creating Profile..." : "Create Account & Continue"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#EFEBE3] text-center text-xs text-[#6B726C]">
          Already a member?{" "}
          <button
            type="button"
            onClick={() => setCurrentView("login")}
            className="font-semibold text-[#181918] underline hover:text-[#2D483A]"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};
