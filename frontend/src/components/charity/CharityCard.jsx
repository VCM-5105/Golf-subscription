import React from "react";
import { Heart, Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { Badge } from "../common/Badge.jsx";

export const CharityCard = ({ charity, onSelect, onDonate, isSelected = false }) => {
  return (
    <div className={`rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col bg-white ${
      isSelected
        ? "border-[#2D483A] ring-2 ring-[#2D483A]/20 shadow-md"
        : "border-[#DDD7CD] hover:border-[#BDB5A7] shadow-2xs hover:shadow-xs"
    }`}>
      {/* Banner / Media */}
      <div className="relative h-44 w-full bg-[#EBE7DF] overflow-hidden">
        <img
          src={charity.bannerImage || charity.logo}
          alt={charity.name}
          className="w-full h-full object-cover grayscale-[20%] hover:scale-102 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="default" className="bg-[#FAF8F5]/90 border-[#DDD7CD] text-[#181918]">
            {charity.category}
          </Badge>
        </div>
        {charity.featured && (
          <div className="absolute top-3 right-3">
            <Badge variant="active" className="bg-[#2D483A] text-white border-none">
              Spotlight
            </Badge>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-editorial text-xl font-bold text-[#181918]">
              {charity.name}
            </h3>
          </div>
          <p className="text-xs text-[#6B726C] mt-1.5 leading-relaxed">
            {charity.tagline}
          </p>

          {/* Impact Stats */}
          <div className="grid grid-cols-2 gap-2 my-4 py-3 border-y border-[#EFEBE3]">
            <div>
              <span className="text-[10px] font-mono-code uppercase text-[#8E948F] block">
                Total Direct Support
              </span>
              <span className="font-editorial text-lg font-bold text-[#181918]">
                ${(charity.totalRaised || 0).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono-code uppercase text-[#8E948F] block">
                Subscribers Supporting
              </span>
              <span className="font-editorial text-lg font-bold text-[#181918] flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#2D483A]" />
                {(charity.activeSupporters || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Upcoming Event */}
          {charity.upcomingEvent && (
            <div className="mb-4 p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E3D8] text-xs">
              <div className="flex items-center gap-1.5 text-[10px] font-mono-code uppercase text-[#2D483A] font-semibold mb-1">
                <Calendar className="w-3.5 h-3.5" />
                Upcoming Charity Golf Day
              </div>
              <div className="font-medium text-[#181918]">{charity.upcomingEvent.title}</div>
              <div className="text-[#737A74] mt-0.5 flex items-center gap-2">
                <span>{charity.upcomingEvent.date}</span>
                <span>•</span>
                <span>{charity.upcomingEvent.location}</span>
              </div>
            </div>
          )}
        </div>

        {/* Card Actions */}
        <div className="flex items-center gap-2 pt-2">
          {onSelect && (
            <button
              onClick={() => onSelect(charity)}
              className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg transition-colors text-center ${
                isSelected
                  ? "bg-[#2D483A] text-white"
                  : "bg-[#181918] text-[#FAF8F5] hover:bg-[#2D483A]"
              }`}
            >
              {isSelected ? "Selected Beneficiary" : "Select For Subscription"}
            </button>
          )}

          {onDonate && (
            <button
              onClick={() => onDonate(charity)}
              className="py-2 px-3.5 border border-[#D5CFC5] text-xs font-medium text-[#2E312E] hover:bg-[#F5F2EB] rounded-lg transition-colors flex items-center gap-1"
            >
              <Heart className="w-3.5 h-3.5 text-[#2D483A]" />
              <span>Donate</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
