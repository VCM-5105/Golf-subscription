import React, { useState, useMemo } from "react";
import { Search, Heart, Filter, Calendar, Users, Award, ArrowUpRight } from "lucide-react";
import { CharityCard } from "../components/charity/CharityCard.jsx";
import { Badge } from "../components/common/Badge.jsx";
import { DirectDonationModal } from "../components/charity/DirectDonationModal.jsx";

export const CharitiesPage = ({ charities = [], categories = [], selectedCharityId, onSelectCharity, onDirectDonation, setCurrentView }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [donationModalCharity, setDonationModalCharity] = useState(null);

  const filteredCharities = useMemo(() => {
    return charities.filter((c) => {
      const matchCat = activeCategory === "All" || c.category === activeCategory;
      const matchSearch =
        !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tagline?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [charities, activeCategory, searchQuery]);

  const allCategories = ["All", ...categories];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F4F1EA] border border-[#DDD7CD] rounded-full text-xs font-mono-code text-[#4E534E]">
          <Heart className="w-3.5 h-3.5 text-[#2D483A]" />
          <span>CHARITABLE IMPACT LEADS THE STORY</span>
        </div>

        <h1 className="font-editorial text-4xl sm:text-6xl font-bold tracking-tight text-[#181918]">
          Give <span className="italic font-serif font-normal text-[#2D483A]">back.</span>
        </h1>

        <p className="text-base sm:text-lg text-[#4E534E] leading-relaxed font-light">
          Charitable impact leads the platform's story. Every subscriber directs at least 10% of their membership fee to a cause they choose, with voluntary options to increase giving or make independent gifts.
        </p>
      </div>

      {/* Discovery Search & Category Filter Bar */}
      <div className="p-4 bg-white border border-[#DDD7CD] rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeCategory === cat
                  ? "bg-[#181918] text-[#FAF8F5]"
                  : "bg-[#FAF8F5] text-[#575C57] hover:bg-[#EAE4D8] border border-[#DDD7CD]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#8E948F] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search causes & foundations..."
            className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#DDD7CD] rounded-xl text-xs text-[#181918] placeholder-[#8E948F] focus:outline-none focus:border-[#2D483A]"
          />
        </div>
      </div>

      {/* Charity Cards Grid */}
      {filteredCharities.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#DDD7CD] rounded-2xl">
          <p className="text-sm font-semibold text-[#181918]">No organizations match your query.</p>
          <p className="text-xs text-[#6B726C] mt-1">Try resetting the category filter or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCharities.map((charity) => (
            <CharityCard
              key={charity.id}
              charity={charity}
              isSelected={selectedCharityId === charity.id}
              onSelect={(c) => {
                onSelectCharity(c);
                setCurrentView("subscribe");
              }}
              onDonate={(c) => setDonationModalCharity(c)}
            />
          ))}
        </div>
      )}

      {/* Independent Contribution Modal */}
      {donationModalCharity && (
        <DirectDonationModal
          isOpen={Boolean(donationModalCharity)}
          onClose={() => setDonationModalCharity(null)}
          charity={donationModalCharity}
          onConfirmDonation={onDirectDonation}
        />
      )}
    </div>
  );
};
