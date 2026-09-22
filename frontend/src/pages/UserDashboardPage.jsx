import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { scoreService } from "../services/scoreService.js";
import { charityService } from "../services/charityService.js";
import { winnerService } from "../services/winnerService.js";
import { drawService } from "../services/drawService.js";
import { ScoreTable } from "../components/score/ScoreTable.jsx";
import { ScoreEntryModal } from "../components/score/ScoreEntryModal.jsx";
import { WinnerProofModal } from "../components/winner/WinnerProofModal.jsx";
import { DrawTicketView } from "../components/draw/DrawTicketView.jsx";
import { Badge } from "../components/common/Badge.jsx";
import { useToast } from "../context/ToastContext.jsx";
import {
  Plus,
  Heart,
  Calendar,
  Award,
  ShieldCheck,
  UploadCloud,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";

export const UserDashboardPage = ({ setCurrentView }) => {
  const { user, refreshUser, hasActiveSubscription } = useAuth();
  const toast = useToast();

  const [scores, setScores] = useState([]);
  const [scoreStats, setScoreStats] = useState(null);
  const [winningsData, setWinningsData] = useState({ winnings: [], summary: {} });
  const [ticketData, setTicketData] = useState(null);
  const [charities, setCharities] = useState([]);

  // Charity Slider state
  const [charityPercentage, setCharityPercentage] = useState(
    user?.charity?.percentage || 10
  );
  const [selectedCharityId, setSelectedCharityId] = useState(
    user?.charity?.charityId || ""
  );
  const [savingCharity, setSavingCharity] = useState(false);

  // Modals
  const [scoreModalOpen, setScoreModalOpen] = useState(false);
  const [editingScore, setEditingScore] = useState(null);
  const [proofWinner, setProofWinner] = useState(null);

  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    if (!user) return;
    try {
      const [scoresRes, winRes, ticketRes, charRes] = await Promise.all([
        scoreService.getMyScores().catch(() => ({ scores: [], statistics: {} })),
        winnerService.getMyWinnings().catch(() => ({ winnings: [], summary: {} })),
        drawService.getMyTicket().catch(() => null),
        charityService.getAll()
      ]);

      setScores(scoresRes.scores || []);
      setScoreStats(scoresRes.statistics || null);
      setWinningsData(winRes || { winnings: [], summary: {} });
      setTicketData(ticketRes);
      setCharities(charRes.charities || []);
      setSelectedCharityId(user.charity?.charityId || (charRes.charities?.[0]?.id ?? ""));
      setCharityPercentage(user.charity?.percentage || 10);
    } catch (err) {
      console.error("Dashboard data fetch failed", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Score Handlers
  const handleSaveScore = async (scoreData) => {
    try {
      if (editingScore) {
        await scoreService.updateScore(editingScore.id, scoreData);
        toast.success("Score updated successfully.");
      } else {
        const res = await scoreService.addScore(scoreData);
        toast.success(res.message || "Stableford score recorded.");
      }
      setEditingScore(null);
      await loadDashboardData();
    } catch (err) {
      toast.error(err.message || "Failed to record score.");
      throw err;
    }
  };

  const handleDeleteScore = async (scoreId) => {
    if (!window.confirm("Are you sure you want to delete this score?")) return;
    try {
      await scoreService.deleteScore(scoreId);
      toast.info("Score removed.");
      await loadDashboardData();
    } catch (err) {
      toast.error(err.message || "Failed to delete score.");
    }
  };

  // Charity Adjustment Handler
  const handleUpdateCharity = async (e) => {
    e.preventDefault();
    if (!selectedCharityId) {
      toast.error("Please select a beneficiary. Create one in the Admin Panel if empty.");
      return;
    }
    setSavingCharity(true);
    try {
      await charityService.selectCharity(selectedCharityId, charityPercentage);
      await refreshUser();
      toast.success(`Charity contribution adjusted to ${charityPercentage}%.`);
    } catch (err) {
      toast.error(err.message || "Failed to update charity.");
    } finally {
      setSavingCharity(false);
    }
  };

  // Winner Proof Handler
  const handleProofUploaded = async (winnerId, formData) => {
    try {
      await winnerService.uploadProof(winnerId, formData);
      toast.success("Verification proof submitted. Administrator notified.");
      await loadDashboardData();
    } catch (err) {
      toast.error(err.message || "Proof submission failed.");
      throw err;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[#DDD7CD] pb-6">
        <div>
          <div className="text-xs font-mono-code uppercase tracking-wider text-[#6B726C] mb-1">
            MEMBER DASHBOARD
          </div>
          <h1 className="font-editorial text-4xl font-bold text-[#181918]">
            Welcome, {user?.name}
          </h1>
          <p className="text-xs text-[#787D78] font-mono-code mt-1">
            Member ID: {user?.id} • Handicap: {user?.handicap || "Scratch"}
          </p>
        </div>

        {!hasActiveSubscription && (
          <button
            onClick={() => setCurrentView("subscribe")}
            className="px-5 py-2.5 bg-[#2D483A] text-white hover:bg-[#1E3328] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Activate Membership ($19/mo)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* SECTION 1: SUBSCRIPTION STATUS */}
      <div className="p-6 bg-white border border-[#DDD7CD] rounded-2xl shadow-2xs grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <span className="text-[10px] font-mono-code uppercase text-[#8E948F] block">
            Membership Status
          </span>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={hasActiveSubscription ? "active" : "pending"}>
              {user?.subscription?.status || "inactive"}
            </Badge>
          </div>
          <span className="text-xs font-mono-code text-[#4E534E] mt-1.5 block">
            {user?.subscription?.planName || "No Plan Active"}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-mono-code uppercase text-[#8E948F] block">
            Renewal / Expiry Date
          </span>
          <div className="font-editorial text-xl font-bold text-[#181918] mt-1">
            {user?.subscription?.renewalDate
              ? user.subscription.renewalDate.split("T")[0]
              : "Pending Enrollment"}
          </div>
          <span className="text-[11px] font-mono-code text-[#737A74] mt-0.5 block">
            Auto-renews at ${user?.subscription?.price || 19}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-mono-code uppercase text-[#8E948F] block">
            Charity Allocation
          </span>
          <div className="font-editorial text-xl font-bold text-[#2D483A] mt-1">
            {user?.charity?.percentage || 10}% Directed
          </div>
          <span className="text-[11px] text-[#575C57] mt-0.5 block truncate max-w-[200px]">
            {user?.charity?.charityName || "None designated"}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-mono-code uppercase text-[#8E948F] block">
            Lifetime Rewards Won
          </span>
          <div className="font-editorial text-xl font-bold text-[#181918] mt-1">
            ${Number(winningsData.summary?.totalNetPayout || 0).toFixed(2)}
          </div>
          <span className="text-[11px] font-mono-code text-[#2D483A] mt-0.5 block">
            {winningsData.summary?.pendingCount || 0} Pending Verification
          </span>
        </div>
      </div>

      {/* SECTION 2: SCORE MANAGEMENT INTERFACE */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#181918]">
              Stableford Score Log (Latest 5 Rounds)
            </h3>
            <p className="text-xs text-[#6B726C] font-mono-code mt-0.5">
              1–45 net points • Auto-drops oldest on new submission • 1 entry per date enforced
            </p>
          </div>

          <button
            onClick={() => {
              setEditingScore(null);
              setScoreModalOpen(true);
            }}
            className="px-4 py-2 bg-[#181918] text-[#FAF8F5] hover:bg-[#2D483A] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Record New Round</span>
          </button>
        </div>

        <ScoreTable
          scores={scores}
          onEdit={(s) => {
            setEditingScore(s);
            setScoreModalOpen(true);
          }}
          onDelete={handleDeleteScore}
        />
      </div>

      {/* SECTION 3: PARTICIPATION SUMMARY & ACTIVE DRAW TICKET */}
      <div className="space-y-4">
        <h3 className="font-editorial text-2xl font-bold text-[#181918]">
          Participation Summary & Enrolled Ticket
        </h3>

        <DrawTicketView
          ticket={ticketData?.ticket}
          scoresCount={scores.length}
          onNavigateToScores={() => {
            setEditingScore(null);
            setScoreModalOpen(true);
          }}
        />
      </div>

      {/* SECTION 4: SELECTED CHARITY & CONTRIBUTION PERCENTAGE ADJUSTER */}
      <div className="p-6 md:p-8 bg-white border border-[#DDD7CD] rounded-2xl shadow-2xs space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-code uppercase text-[#2D483A] font-semibold mb-1">
            <Heart className="w-3.5 h-3.5" />
            <span>CONTRIBUTION MODEL</span>
          </div>
          <h3 className="font-editorial text-2xl font-bold text-[#181918]">
            Philanthropic Giving Direction
          </h3>
          <p className="text-xs text-[#6B726C] mt-1 max-w-2xl">
            A minimum of 10% of your membership fee is directed to your designated cause. You may voluntarily increase your percentage at any time.
          </p>
        </div>

        <form onSubmit={handleUpdateCharity} className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          {/* Charity Selector */}
          <div>
            <label className="block text-xs font-mono-code uppercase text-[#4E534E] mb-2">
              Designated Beneficiary
            </label>
            <select
              value={selectedCharityId}
              onChange={(e) => setSelectedCharityId(e.target.value)}
              disabled={charities.length === 0}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D5CFC5] rounded-xl text-xs text-[#181918] focus:outline-none focus:border-[#2D483A] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {charities.length === 0 ? (
                <option value="">No charities available (Add in Admin Panel)</option>
              ) : (
                charities.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.name} ({ch.category})
                  </option>
                ))
              )}
            </select>
            {charities.length === 0 && (
              <p className="text-[11px] text-[#8C2C2C] mt-1.5 font-medium">
                No charities found in database. Create them in Admin Panel (Charity Management) or run the SQL seed.
              </p>
            )}
          </div>

          {/* Percentage Slider (10% to 50%) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono-code uppercase text-[#4E534E]">
                Contribution Percentage
              </label>
              <span className="font-mono-code font-bold text-sm text-[#2D483A]">
                {charityPercentage}% of monthly fee
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              step="5"
              value={charityPercentage}
              onChange={(e) => setCharityPercentage(Number(e.target.value))}
              className="w-full accent-[#2D483A] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono-code text-[#8E948F] mt-1">
              <span>10% (Baseline)</span>
              <span>25%</span>
              <span>50% (Champion)</span>
            </div>
          </div>

          <div className="md:col-span-2 flex items-center justify-end">
            <button
              type="submit"
              disabled={savingCharity || charities.length === 0}
              className="px-5 py-2 text-xs font-semibold bg-[#181918] text-[#FAF8F5] hover:bg-[#2D483A] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingCharity ? "Saving..." : "Save Giving Preferences"}
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 5: WINNINGS OVERVIEW & PROOF UPLOAD WORKFLOW */}
      <div className="p-6 md:p-8 bg-white border border-[#DDD7CD] rounded-2xl shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-code uppercase text-[#2D483A] font-semibold mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>WINNER VERIFICATION SYSTEM</span>
            </div>
            <h3 className="font-editorial text-2xl font-bold text-[#181918]">
              Winnings Overview & Verification
            </h3>
            <p className="text-xs text-[#6B726C] mt-1">
              Verification applies to winners only. Upload a platform scorecard screenshot to release automated payouts.
            </p>
          </div>

          <Badge variant="active">
            ${Number(winningsData.summary?.totalPaidOut || 0).toFixed(2)} Paid Out
          </Badge>
        </div>

        {winningsData.winnings.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-[#DDD7CD] rounded-xl bg-[#FAF8F5]">
            <p className="text-sm font-medium text-[#181918]">
              No draw winnings registered on this account yet.
            </p>
            <p className="text-xs text-[#737A74] mt-1 max-w-md mx-auto">
              Maintain an active membership and log 5 Stableford scores to enroll in the upcoming draw!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#EFEBE3] border border-[#E0D9CD] rounded-xl overflow-hidden">
            {winningsData.winnings.map((win) => {
              const isApproved = win.verificationStatus === "approved";
              const isPaid = win.payoutStatus === "paid";
              return (
                <div
                  key={win.id}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white hover:bg-[#FAF8F5] transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#181918]">
                        {win.tierLabel || win.tier}
                      </span>
                      <Badge variant="dark" className="text-[10px]">{win.drawNumber}</Badge>
                      <Badge
                        variant={
                          isApproved ? "active" : win.verificationStatus === "rejected" ? "danger" : "pending"
                        }
                      >
                        {win.verificationStatus.replace("_", " ")}
                      </Badge>
                    </div>

                    <p className="text-xs text-[#737A74] font-mono-code mt-1">
                      Matched: [{win.matchedNumbers?.join(", ")}] • Gross: ${win.prizeAmount} • Charity Given: ${win.charityContributionAmount}
                    </p>

                    {win.adminNotes && (
                      <p className="text-xs text-[#2D483A] mt-1">
                        Note: {win.adminNotes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-[#EFEBE3]">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] font-mono-code uppercase text-[#8E948F] block">
                        Net Payout
                      </span>
                      <span className="font-editorial text-xl font-bold text-[#181918]">
                        ${Number(win.netPayoutAmount || win.prizeAmount).toFixed(2)}
                      </span>
                      <span className="text-[10px] font-mono-code text-[#575C57] block">
                        Status: {win.payoutStatus}
                      </span>
                    </div>

                    {!isApproved && (
                      <button
                        onClick={() => setProofWinner(win)}
                        className="px-3.5 py-1.5 text-xs font-semibold bg-[#2D483A] text-white hover:bg-[#1E3328] rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>{win.proofImage ? "Re-upload Proof" : "Upload Score Proof"}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Score Entry/Edit Modal */}
      <ScoreEntryModal
        isOpen={scoreModalOpen}
        onClose={() => {
          setScoreModalOpen(false);
          setEditingScore(null);
        }}
        onSave={handleSaveScore}
        editingScore={editingScore}
        existingScores={scores}
      />

      {/* Winner Proof Upload Modal */}
      {proofWinner && (
        <WinnerProofModal
          isOpen={Boolean(proofWinner)}
          onClose={() => setProofWinner(null)}
          winner={proofWinner}
          onUploadSuccess={handleProofUploaded}
        />
      )}
    </div>
  );
};
