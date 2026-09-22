import React, { useState } from "react";
import { CheckCircle2, XCircle, DollarSign, ExternalLink, Image, AlertCircle, FileCheck } from "lucide-react";
import { Badge } from "../common/Badge.jsx";
import { Modal } from "../common/Modal.jsx";

export const WinnerVerificationTab = ({ winners = [], onReview, onMarkPaid, onRefresh }) => {
  const [selectedProofWinner, setSelectedProofWinner] = useState(null);
  const [reviewAction, setReviewAction] = useState("approve");
  const [adminNotes, setAdminNotes] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [payingWinner, setPayingWinner] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProofWinner) return;

    setSubmitting(true);
    try {
      await onReview(selectedProofWinner.id, reviewAction, adminNotes);
      setSelectedProofWinner(null);
      setAdminNotes("");
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayoutSubmit = async (e) => {
    e.preventDefault();
    if (!payingWinner) return;

    setSubmitting(true);
    try {
      await onMarkPaid(payingWinner.id, transactionRef || `ACH_${Date.now()}`);
      setPayingWinner(null);
      setTransactionRef("");
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message || "Failed to mark payout.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-editorial text-2xl font-bold text-[#181918]">
            04 · Winner Verification & Payout Operations
          </h3>
          <p className="text-xs text-[#6B726C] font-mono-code mt-0.5">
            Audit golf platform scorecard proofs, approve eligibility, and release payment transfers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="pending">
            {winners.filter((w) => w.verificationStatus === "pending_verification").length} Pending Verification
          </Badge>
          <Badge variant="active">
            {winners.filter((w) => w.payoutStatus === "paid").length} Paid
          </Badge>
        </div>
      </div>

      {/* Winners List Table */}
      <div className="overflow-x-auto border border-[#DDD7CD] rounded-xl bg-white shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F6F3EB] border-b border-[#DDD7CD] font-mono-code uppercase text-[#787D78]">
            <tr>
              <th className="py-3 px-4">Winner / Draw</th>
              <th className="py-3 px-4">Tier</th>
              <th className="py-3 px-4">Prize Pool</th>
              <th className="py-3 px-4">Net Payout</th>
              <th className="py-3 px-4">Verification</th>
              <th className="py-3 px-4">Payout State</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFEBE3]">
            {winners.map((w) => {
              const isApproved = w.verificationStatus === "approved";
              const isPaid = w.payoutStatus === "paid";
              return (
                <tr key={w.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#181918]">{w.userName}</div>
                    <div className="text-[11px] font-mono-code text-[#787D78]">{w.drawNumber}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant="default">{w.tierLabel || w.tier}</Badge>
                  </td>
                  <td className="py-3.5 px-4 font-mono-code text-[#181918]">
                    ${Number(w.prizeAmount).toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 font-mono-code font-bold text-[#2D483A]">
                    ${Number(w.netPayoutAmount || w.prizeAmount).toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant={
                          w.verificationStatus === "approved"
                            ? "active"
                            : w.verificationStatus === "rejected"
                            ? "danger"
                            : "pending"
                        }
                      >
                        {w.verificationStatus.replace("_", " ")}
                      </Badge>
                      {w.proofImage && (
                        <span className="text-[10px] text-[#2D483A] font-mono-code underline cursor-pointer" onClick={() => setSelectedProofWinner(w)}>
                          [Proof Attached]
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={isPaid ? "active" : "pending"}>
                      {w.payoutStatus}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setSelectedProofWinner(w);
                        setReviewAction("approve");
                        setAdminNotes(w.adminNotes || "");
                      }}
                      className="px-2.5 py-1 text-xs border border-[#DDD7CD] rounded hover:bg-[#F5F2EB] text-[#181918]"
                    >
                      Audit Proof
                    </button>

                    {isApproved && !isPaid && (
                      <button
                        onClick={() => {
                          setPayingWinner(w);
                          setTransactionRef(`ACH_DIRECT_${Date.now().toString().slice(-6)}`);
                        }}
                        className="px-2.5 py-1 text-xs bg-[#2D483A] text-white rounded hover:bg-[#1E3328]"
                      >
                        Release Payout
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Review Proof Modal */}
      {selectedProofWinner && (
        <Modal
          isOpen={Boolean(selectedProofWinner)}
          onClose={() => setSelectedProofWinner(null)}
          title={`Scorecard Verification: ${selectedProofWinner.userName}`}
          subtitle="Surface 04 · Proof Audit"
        >
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div className="p-3 bg-[#F6F3EB] rounded-lg text-xs space-y-1">
              <div className="font-semibold text-[#181918]">Winner Record Details:</div>
              <p className="font-mono-code text-[#575C57]">
                Draw: {selectedProofWinner.drawNumber} • Tier: {selectedProofWinner.tierLabel} • Net Prize: ${selectedProofWinner.netPayoutAmount}
              </p>
              <p className="font-mono-code text-[#2D483A]">
                Matched Numbers: [{selectedProofWinner.matchedNumbers?.join(", ")}]
              </p>
            </div>

            {/* Attached Proof View */}
            <div>
              <label className="block text-xs font-mono-code uppercase text-[#4E534E] mb-2">
                Submitted Verification Document
              </label>
              {selectedProofWinner.proofImage ? (
                <div className="border border-[#DDD7CD] rounded-lg overflow-hidden bg-black/5 p-2 text-center">
                  <img
                    src={selectedProofWinner.proofImage}
                    alt="Platform Scorecard"
                    className="max-h-72 mx-auto rounded object-contain"
                  />
                  <a
                    href={selectedProofWinner.proofImage}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#2D483A] font-mono-code mt-2 hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open full resolution image in new tab
                  </a>
                </div>
              ) : (
                <div className="p-6 bg-[#FDF3F3] border border-[#ECC4C4] rounded-lg text-center text-xs text-[#7A2424]">
                  No scorecard file uploaded yet by player. Player has been notified.
                </div>
              )}
            </div>

            {/* Review Decision */}
            <div>
              <label className="block text-xs font-mono-code uppercase text-[#4E534E] mb-1.5">
                Audit Decision *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setReviewAction("approve")}
                  className={`py-2 text-xs font-semibold rounded-lg border flex items-center justify-center gap-1.5 transition-all ${
                    reviewAction === "approve"
                      ? "bg-[#EBF2ED] text-[#244530] border-[#2D483A]"
                      : "bg-white text-[#575C57] border-[#DDD7CD]"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Authorize</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReviewAction("reject")}
                  className={`py-2 text-xs font-semibold rounded-lg border flex items-center justify-center gap-1.5 transition-all ${
                    reviewAction === "reject"
                      ? "bg-[#FDF3F3] text-[#7A2424] border-[#8C2C2C]"
                      : "bg-white text-[#575C57] border-[#DDD7CD]"
                  }`}
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Submission</span>
                </button>
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs font-mono-code uppercase text-[#4E534E] mb-1">
                Auditor Comments / Feedback for Player
              </label>
              <textarea
                rows="2"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Verified Stableford points against GHIN platform scorecard."
                className="w-full px-3 py-2 text-xs border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#2D483A]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E3D8]">
              <button
                type="button"
                onClick={() => setSelectedProofWinner(null)}
                className="px-3.5 py-1.5 text-xs text-[#575C57]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 text-xs font-semibold bg-[#181918] text-[#FAF8F5] rounded-lg hover:bg-[#2D483A]"
              >
                {submitting ? "Saving..." : "Record Decision"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Payout Modal */}
      {payingWinner && (
        <Modal
          isOpen={Boolean(payingWinner)}
          onClose={() => setPayingWinner(null)}
          title={`Disburse Prize Payout: $${payingWinner.netPayoutAmount}`}
          subtitle="Surface 04 · Automated Financial Settlement"
        >
          <form onSubmit={handlePayoutSubmit} className="space-y-4">
            <p className="text-xs text-[#575C57]">
              Enter the bank ACH, Wire or Stripe balance transfer confirmation reference to mark this payout as completed.
            </p>

            <div>
              <label className="block text-xs font-mono-code uppercase text-[#4E534E] mb-1">
                Transaction Reference *
              </label>
              <input
                type="text"
                required
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono-code border border-[#D5CFC5] rounded-lg"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E3D8]">
              <button
                type="button"
                onClick={() => setPayingWinner(null)}
                className="px-3.5 py-1.5 text-xs text-[#575C57]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 text-xs font-semibold bg-[#2D483A] text-white rounded-lg hover:bg-[#1E3328]"
              >
                {submitting ? "Processing..." : "Confirm & Mark Paid"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
