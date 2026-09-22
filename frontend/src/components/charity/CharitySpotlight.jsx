import React from "react";
import { Heart, ArrowRight, Award, Calendar, Sparkles } from "lucide-react";
import { Badge } from "../common/Badge.jsx";

export const CharitySpotlight = ({ charity, onSelect, onDonate, onExploreAll }) => {
  if (!charity) return null;

  return (
    <section className="py-16 md:py-20 border-y border-[#E6E1D6] bg-[#F5F2EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Spotlight Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-code uppercase tracking-wider text-[#6B726C]">
              Spotlight Beneficiary
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#E5DFD4] font-mono-code text-[#2D483A]">
              Leading with Impact
            </span>
          </div>

          {onExploreAll && (
            <button
              onClick={onExploreAll}
              className="text-xs font-mono-code uppercase tracking-wider text-[#2D483A] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Explore Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Spotlight Editorial Feature Card */}
        <div className="bg-white border border-[#DDD7CD] rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-sm">
          {/* Image */}
          <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full bg-[#E7E2D8] overflow-hidden">
            <img
              src={charity.bannerImage || charity.logo}
              alt={charity.name}
              className="w-full h-full object-cover grayscale-[15%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-4 left-4 lg:hidden">
              <Badge variant="active" className="bg-[#2D483A] text-white">
                Featured Cause
              </Badge>
            </div>
          </div>

          {/* Editorial Content */}
          <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-between">
            <div>
              <div className="hidden lg:flex items-center gap-2 mb-3">
                <Badge variant="active" className="bg-[#2D483A] text-white border-none">
                  Featured Cause
                </Badge>
                <Badge variant="outline">{charity.category}</Badge>
              </div>

              <h3 className="font-editorial text-3xl sm:text-4xl font-bold text-[#181918] tracking-tight">
                {charity.name}
              </h3>

              <p className="text-base text-[#4E534E] mt-4 leading-relaxed">
                {charity.description}
              </p>

              {/* Impact Callouts */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-6 pt-6 border-t border-[#EFEBE3]">
                <div>
                  <span className="text-[11px] font-mono-code uppercase text-[#8E948F] block">
                    Direct Funding
                  </span>
                  <span className="font-editorial text-2xl font-bold text-[#181918]">
                    ${(charity.totalRaised || 0).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-mono-code uppercase text-[#8E948F] block">
                    Active Donors
                  </span>
                  <span className="font-editorial text-2xl font-bold text-[#181918]">
                    {(charity.activeSupporters || 0).toLocaleString()}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[11px] font-mono-code uppercase text-[#8E948F] block">
                    Minimum Directed
                  </span>
                  <span className="font-editorial text-2xl font-bold text-[#2D483A]">
                    10% Baseline
                  </span>
                </div>
              </div>

              {charity.upcomingEvent && (
                <div className="p-4 bg-[#FAF8F5] border border-[#DDD7CD] rounded-xl flex items-start gap-3 mb-6">
                  <Calendar className="w-5 h-5 text-[#2D483A] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-semibold uppercase font-mono-code text-[#181918]">
                      Featured Golf Day: {charity.upcomingEvent.title}
                    </h5>
                    <p className="text-xs text-[#6B726C] mt-0.5">
                      {charity.upcomingEvent.date} • {charity.upcomingEvent.location} (Goal: {charity.upcomingEvent.goal})
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelect(charity)}
                className="px-6 py-3 bg-[#181918] text-[#FAF8F5] hover:bg-[#2D483A] text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <span>Direct My Subscription Here</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onDonate(charity)}
                className="px-5 py-3 border border-[#D5CFC5] text-[#2E312E] hover:bg-[#FAF8F5] text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <Heart className="w-4 h-4 text-[#2D483A]" />
                <span>Make One-Off Gift</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
