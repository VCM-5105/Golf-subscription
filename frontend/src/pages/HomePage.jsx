import React from "react";
import { ArrowRight, Sparkles, Heart, Award, Shield, CheckCircle2, Trophy, HelpCircle } from "lucide-react";
import { Badge } from "../components/common/Badge.jsx";
import { CharitySpotlight } from "../components/charity/CharitySpotlight.jsx";
import { PrizePoolCard } from "../components/draw/PrizePoolCard.jsx";

export const HomePage = ({ setCurrentView, activeDraw, spotlightCharity, onOpenDonate, onSelectCharity }) => {
  const coreObjectives = [
    { label: "ENGINE", title: "Subscription", desc: "Robust subscription and payment engine with automated real-time status validation." },
    { label: "EXPERIENCE", title: "Score Entry", desc: "Simple, engaging 5-score Stableford flow with automated FIFO replacement." },
    { label: "ENGINE", title: "Custom Draw", desc: "Algorithm-powered or random monthly draws with 5/4/3-match prize tier distribution." },
    { label: "INTEGRATION", title: "Charity", desc: "Seamless 10% minimum contribution logic directly directed by every subscriber." },
    { label: "CONTROL", title: "Admin", desc: "Comprehensive five-surface operational admin dashboard with live simulation tools." },
    { label: "DESIGN", title: "Outstanding UI/UX", desc: "Minimalist editorial aesthetic built to stand out completely from the golf industry." }
  ];

  const whatUsersDo = [
    "Subscribe to the platform (monthly or yearly)",
    "Enter their latest golf scores in Stableford format (1–45 range)",
    "Participate in monthly draw-based prize pools",
    "Support a charity of their choice with a portion of their subscription"
  ];

  const roles = [
    {
      num: "ROLE 01",
      title: "Public Visitor",
      features: ["View platform concept & mission", "Explore vetted charity directory", "Understand draw mechanics & tiers", "Initiate subscription membership"]
    },
    {
      num: "ROLE 02",
      title: "Registered Subscriber",
      features: ["Manage profile & handicap settings", "Enter / edit 5 golf Stableford scores", "Select charity recipient & adjust %", "View draw tickets, participation & winnings", "Upload scorecard winner proof"]
    },
    {
      num: "ROLE 03",
      title: "Administrator",
      features: ["Manage users & active subscriptions", "Configure & run draw simulations", "Publish official results & manage rollovers", "Manage charity listings & stories", "Verify winner scorecards & release payouts"]
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Editorial Hero Section (Slide 1 & Slide 8) */}
      <section className="pt-12 sm:pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F4F1EA] border border-[#DDD7CD] rounded-full text-xs font-mono-code text-[#4E534E]">
            <span className="w-2 h-2 rounded-full bg-[#2D483A]" />
            <span>FEEL, NOT FAIRWAY · EMOTION-DRIVEN GIVING</span>
          </div>

          <h1 className="font-editorial text-5xl sm:text-7xl font-bold tracking-tight text-[#181918] leading-[1.08]">
            The <span className="italic font-serif font-normal text-[#2D483A]">platform.</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#4E534E] leading-relaxed font-light">
            A subscription-driven web application combining golf performance tracking, charity fundraising, and a monthly draw-based reward engine — built to feel emotionally engaging and modern, deliberately avoiding the aesthetics of a traditional golf website.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setCurrentView("subscribe")}
              className="px-7 py-3.5 bg-[#181918] text-[#FAF8F5] hover:bg-[#2D483A] text-sm font-semibold rounded-xl transition-all flex items-center gap-2 tracking-wide shadow-sm group"
            >
              <span>Subscribe & Enter Draw</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => setCurrentView("how-it-works")}
              className="px-6 py-3.5 border border-[#D5CFC5] bg-white text-[#2E312E] hover:bg-[#FAF8F5] text-sm font-medium rounded-xl transition-colors"
            >
              Understand Mechanics
            </button>
          </div>
        </div>

        {/* What Users Do */}
        <div className="mt-16 sm:mt-20 pt-10 border-t border-[#DDD7CD]">
          <div className="text-xs font-mono-code uppercase tracking-widest text-[#787D78] mb-6">
            WHAT PLAYERS DO
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {whatUsersDo.map((item, index) => (
              <div
                key={index}
                className="p-5 rounded-xl border border-[#DDD7CD] bg-white hover:border-[#BDB5A7] transition-colors"
              >
                <div className="text-xs font-mono-code text-[#2D483A] font-bold mb-2">
                  0{index + 1}
                </div>
                <p className="text-sm font-medium text-[#181918] leading-snug">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Draw Banner & Prize Pool */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PrizePoolCard drawData={activeDraw} />
      </section>

      {/* Core Objectives */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-xs font-mono-code uppercase tracking-widest text-[#787D78] mb-6">
          CORE OBJECTIVES
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreObjectives.map((obj, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-[#DDD7CD] bg-white flex flex-col justify-between hover:border-[#2D483A]/50 transition-colors shadow-2xs"
            >
              <div>
                <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#8E948F] block mb-1">
                  {obj.label}
                </span>
                <h3 className="font-editorial text-xl font-bold text-[#181918]">
                  {obj.title}
                </h3>
                <p className="text-xs text-[#575C57] mt-2 leading-relaxed">
                  {obj.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Charity Spotlight */}
      <CharitySpotlight
        charity={spotlightCharity}
        onSelect={(c) => {
          onSelectCharity(c);
          setCurrentView("subscribe");
        }}
        onDonate={(c) => onOpenDonate(c)}
        onExploreAll={() => setCurrentView("charities")}
      />

      {/* Roles Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-8">
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#181918]">
            Who uses <span className="italic font-serif font-normal text-[#2D483A]">it.</span>
          </h2>
          <p className="text-sm text-[#575C57] mt-2">
            Three roles, each with a defined boundary of access — from anonymous browsing to full platform control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-[#DDD7CD] bg-white flex flex-col justify-between shadow-2xs"
            >
              <div>
                <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#8E948F] block mb-1">
                  {role.num}
                </span>
                <h3 className="font-editorial text-xl font-bold text-[#181918] mb-4">
                  {role.title}
                </h3>
                <ul className="space-y-2.5">
                  {role.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2 text-xs text-[#575C57]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2D483A] shrink-0 mt-1.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#181918] text-[#FAF8F5] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <span className="text-xs font-mono-code uppercase tracking-widest text-[#A2ADA4]">
              MEMBERSHIP ACCESS
            </span>
            <h3 className="font-editorial text-3xl sm:text-4xl font-bold text-[#FAF8F5]">
              Track your game. Fuel a cause. Win life-changing monthly rewards.
            </h3>
            <p className="text-sm text-[#C4CCC6] font-light leading-relaxed">
              Every round you play contributes to vetted non-profit partners. Join thousands of golfers turning performance into purpose.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => setCurrentView("subscribe")}
              className="px-8 py-4 bg-[#FAF8F5] text-[#181918] hover:bg-[#EAE4D8] text-sm font-semibold rounded-xl transition-colors tracking-wide flex items-center gap-2"
            >
              <span>Join From $19 / Month</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
