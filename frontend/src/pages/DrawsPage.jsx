import React, { useState, useEffect } from "react";
import { PrizePoolCard } from "../components/draw/PrizePoolCard.jsx";
import { DrawTicketView } from "../components/draw/DrawTicketView.jsx";
import { drawService } from "../services/drawService.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Calendar, Award, Sparkles, CheckCircle2 } from "lucide-react";
import { Badge } from "../components/common/Badge.jsx";

export const DrawsPage = ({ setCurrentView }) => {
  const { user } = useAuth();
  const [activeDraw, setActiveDraw] = useState(null);
  const [drawHistory, setDrawHistory] = useState([]);
  const [userTicket, setUserTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [active, history] = await Promise.all([
          drawService.getActiveDraw(),
          drawService.getDrawHistory()
        ]);
        setActiveDraw(active);
        setDrawHistory(history);

        if (user) {
          const tktRes = await drawService.getMyTicket();
          setUserTicket(tktRes);
        }
      } catch (err) {
        console.error("Failed to load draws data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F4F1EA] border border-[#DDD7CD] rounded-full text-xs font-mono-code text-[#4E534E]">
          <Award className="w-3.5 h-3.5 text-[#2D483A]" />
          <span>THE DRAW ENGINE</span>
        </div>

        <h1 className="font-editorial text-4xl sm:text-6xl font-bold tracking-tight text-[#181918]">
          The <span className="italic font-serif font-normal text-[#2D483A]">draw.</span>
        </h1>

        <p className="text-base sm:text-lg text-[#4E534E] leading-relaxed font-light">
          Audited monthly draw engine with 3-tier distribution (40% 5-number match with jackpot rollover, 35% 4-number match, and 25% 3-number match).
        </p>
      </div>

      {/* User's Ticket Status (If Logged In) */}
      {user && (
        <DrawTicketView
          ticket={userTicket?.ticket}
          scoresCount={userTicket?.scoresCount || 0}
          onNavigateToScores={() => setCurrentView("dashboard")}
        />
      )}

      {/* Main Prize Pool Breakdown */}
      <PrizePoolCard drawData={activeDraw} />

      {/* Historical Published Draws Archive */}
      <div className="p-8 bg-white border border-[#DDD7CD] rounded-2xl space-y-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#EFEBE3] pb-4">
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#181918]">
              Published Draw Archive
            </h3>
            <p className="text-xs text-[#6B726C] font-mono-code mt-0.5">
              Verified historical draws, drawn numbers, and prize allocations
            </p>
          </div>
          <Badge variant="active">{drawHistory.length} Published</Badge>
        </div>

        <div className="space-y-4">
          {drawHistory.map((d) => (
            <div
              key={d.id}
              className="p-5 bg-[#FAF8F5] border border-[#DDD7CD] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-base text-[#181918]">{d.title}</span>
                  <Badge variant="dark" className="text-[10px]">{d.drawNumber}</Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#737A74] mt-1 font-mono-code">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {d.drawDate?.split("T")[0]}
                  </span>
                  <span>•</span>
                  <span>{d.totalSubscribersAtDraw} Subscribed Players</span>
                  <span>•</span>
                  <span>Pool: ${d.totalPool?.toLocaleString()}</span>
                </div>
              </div>

              {/* Winning Numbers */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-code uppercase text-[#8E948F] mr-1">
                  Winning:
                </span>
                {d.winningNumbers?.map((n, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-lg bg-[#2D483A] text-white font-editorial text-base font-bold flex items-center justify-center shadow-xs"
                  >
                    {n}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
