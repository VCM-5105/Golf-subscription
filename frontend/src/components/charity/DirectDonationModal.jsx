import React, { useState } from "react";
import { Modal } from "../common/Modal.jsx";
import { Heart, CheckCircle2, ShieldCheck } from "lucide-react";

export const DirectDonationModal = ({ isOpen, onClose, charity, onConfirmDonation }) => {
  const [amount, setAmount] = useState("50");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const presetAmounts = ["25", "50", "100", "250"];

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    setLoading(true);
    try {
      await onConfirmDonation({
        charityId: charity?.id,
        amount: Number(amount),
        message,
        isAnonymous
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1800);
    } catch (err) {
      alert(err.message || "Failed to process gift.");
    } finally {
      setLoading(false);
    }
  };

  if (!charity) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Support ${charity.name}`}
      subtitle="Independent Contribution"
    >
      {success ? (
        <div className="text-center py-8 space-y-3">
          <div className="w-14 h-14 bg-[#EBF2ED] text-[#2D483A] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="font-editorial text-2xl font-bold text-[#181918]">
            Thank You For Your Support
          </h4>
          <p className="text-xs text-[#575C57] max-w-sm mx-auto font-mono-code">
            Your independent gift of ${amount} has been directly registered to {charity.name}.
          </p>
        </div>
      ) : (
        <form onSubmit={handleDonate} className="space-y-5">
          <p className="text-xs text-[#575C57] leading-relaxed">
            Direct gifts are 100% passed through to the foundation, outside the subscription draw engine.
          </p>

          {/* Quick Amounts */}
          <div>
            <label className="block text-xs font-mono-code uppercase text-[#4E534E] mb-2">
              Select Amount (USD)
            </label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {presetAmounts.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setAmount(preset)}
                  className={`py-2 text-sm font-semibold rounded-lg border transition-all ${
                    amount === preset
                      ? "bg-[#2D483A] text-white border-[#2D483A]"
                      : "bg-white text-[#181918] border-[#D5CFC5] hover:border-[#181918]"
                  }`}
                >
                  ${preset}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#6B726C]">
                $
              </span>
              <input
                type="number"
                min="5"
                step="5"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Custom Amount"
                className="w-full pl-8 pr-4 py-2.5 bg-white border border-[#D5CFC5] rounded-lg text-sm text-[#181918] focus:outline-none focus:border-[#2D483A]"
              />
            </div>
          </div>

          {/* Note / Dedication */}
          <div>
            <label className="block text-xs font-mono-code uppercase text-[#4E534E] mb-1.5">
              Personal Note or Dedication (Optional)
            </label>
            <textarea
              rows="2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. In honor of junior golf mentors..."
              className="w-full px-3.5 py-2.5 bg-white border border-[#D5CFC5] rounded-lg text-sm text-[#181918] focus:outline-none focus:border-[#2D483A]"
            />
          </div>

          {/* Anonymous toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="anon"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded border-[#D5CFC5] text-[#2D483A] focus:ring-[#2D483A]"
            />
            <label htmlFor="anon" className="text-xs text-[#575C57]">
              Keep my donation anonymous on public leaderboards
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E8E3D8]">
            <div className="flex items-center gap-1 text-[11px] text-[#787D78] font-mono-code">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2D483A]" />
              Secure Non-Profit Disbursement
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-medium text-[#4E534E] hover:bg-[#EAE4D8] rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-xs font-medium bg-[#2D483A] text-white hover:bg-[#1E3328] rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <Heart className="w-3.5 h-3.5" />
                <span>{loading ? "Processing..." : `Donate $${amount}`}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};
