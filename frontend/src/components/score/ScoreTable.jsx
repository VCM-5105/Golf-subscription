import React from "react";
import { Calendar, MapPin, Edit3, Trash2, AlertCircle } from "lucide-react";
import { Badge } from "../common/Badge.jsx";

export const ScoreTable = ({ scores = [], onEdit, onDelete, isLoading }) => {
  if (scores.length === 0) {
    return (
      <div className="text-center py-12 px-4 border border-dashed border-[#DCD6CA] rounded-xl bg-[#FAF8F5]">
        <p className="text-sm font-medium text-[#4E534E]">
          No Stableford scores logged yet.
        </p>
        <p className="text-xs text-[#787D78] mt-1 max-w-sm mx-auto">
          Log your last 5 golf scores (Stableford format, 1–45) to automatically generate your verified ticket for the monthly draw.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-[#E0D9CD] rounded-xl bg-white shadow-2xs">
      <div className="p-4 bg-[#F8F5EE] border-b border-[#E0D9CD] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono-code uppercase tracking-wider text-[#6B726C]">
            Retained History
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#EAE4D8] font-mono-code font-medium text-[#2E312E]">
            {scores.length} / 5 Scores Stored
          </span>
        </div>
        <div className="text-[11px] font-mono-code text-[#787D78]">
          * Ordered reverse chronological · Oldest replaced automatically on 6th entry
        </div>
      </div>

      <div className="divide-y divide-[#EFEBE3]">
        {scores.map((scoreItem, index) => {
          const isLatest = index === 0;
          return (
            <div
              key={scoreItem.id || index}
              className="p-4 sm:px-6 flex items-center justify-between hover:bg-[#FAF8F5] transition-colors"
            >
              {/* Score Value & Date */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#F5F2EB] border border-[#DDD7CD] flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs font-mono-code text-[#787D78] leading-none mb-0.5">PTS</span>
                  <span className="text-lg font-bold font-editorial text-[#181918] leading-none">
                    {scoreItem.score}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#181918]">
                      {scoreItem.course || "Golf Course"}
                    </span>
                    {isLatest && (
                      <Badge variant="active" className="text-[10px] py-0">Latest</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#737A74] mt-0.5 font-mono-code">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#8E948F]" />
                      {scoreItem.date}
                    </span>
                    {scoreItem.notes && (
                      <span className="hidden sm:inline-block text-[#8E948F] truncate max-w-[200px]">
                        • {scoreItem.notes}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(scoreItem)}
                    className="p-2 text-[#737A74] hover:text-[#181918] hover:bg-[#EFEBE3] rounded-md transition-colors"
                    title="Edit score entry"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(scoreItem.id)}
                    className="p-2 text-[#737A74] hover:text-[#8C2C2C] hover:bg-[#FDF3F3] rounded-md transition-colors"
                    title="Delete score entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
