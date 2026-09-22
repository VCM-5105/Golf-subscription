import React from "react";
import { Ticket, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { Badge } from "../common/Badge.jsx";

export const DrawTicketView = ({ ticket, scoresCount = 0, onNavigateToScores, winningNumbers = null }) => {
  const isEligible = scoresCount >= 5 && ticket?.numbers;

  return (
    <div className="p-6 rounded-2xl border border-[#DDD7CD] bg-[#FAF8F5] shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E8E3D8]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D483A] text-[#FAF8F5] flex items-center justify-center">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-[#181918]">
              Your Active Draw Ticket
            </h4>
            <p className="text-xs text-[#6B726C] font-mono-code">
              5 numbers formed automatically from your verified Stableford rounds
            </p>
          </div>
        </div>

        <div>
          {isEligible ? (
            <Badge variant="active">Active in Draw</Badge>
          ) : (
            <Badge variant="pending">{scoresCount}/5 Scores Recorded</Badge>
          )}
        </div>
      </div>

      <div className="py-6">
        {isEligible ? (
          <div>
            <div className="text-xs font-mono-code uppercase tracking-wider text-[#6B726C] mb-3">
              Enrolled Ticket Numbers:
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {ticket.numbers.map((num, i) => {
                const isMatched = winningNumbers && winningNumbers.includes(num);
                return (
                  <div
                    key={i}
                    className={`w-14 h-14 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      isMatched
                        ? "bg-[#2D483A] text-[#FAF8F5] border-[#2D483A] shadow-md scale-105"
                        : "bg-white text-[#181918] border-[#DDD7CD] shadow-2xs"
                    }`}
                  >
                    <span className="text-[10px] font-mono-code text-[#8E948F] leading-none mb-0.5">
                      #{i + 1}
                    </span>
                    <span className="text-xl font-bold font-editorial leading-none">
                      {num}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-[#737A74] mt-3 font-mono-code">
              Ticket ID: {ticket.id} • Registered for upcoming draw
            </p>
          </div>
        ) : (
          <div className="p-4 bg-white border border-[#E0D9CD] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#181918]">
                {5 - scoresCount} more score{5 - scoresCount > 1 ? "s" : ""} needed
              </p>
              <p className="text-xs text-[#6B726C] mt-0.5">
                Each member must enter exactly 5 Stableford scores to generate their active 5-number draw ticket.
              </p>
            </div>
            {onNavigateToScores && (
              <button
                onClick={onNavigateToScores}
                className="px-4 py-2 bg-[#181918] text-[#FAF8F5] hover:bg-[#2D483A] text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>Add Scores</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
