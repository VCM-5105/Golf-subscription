import React, { useState } from "react";
import { Modal } from "../common/Modal.jsx";
import { Upload, CheckCircle2, AlertCircle, FileText, Image as ImageIcon } from "lucide-react";
import { Badge } from "../common/Badge.jsx";

export const WinnerProofModal = ({ isOpen, onClose, winner, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!winner) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setErrorMsg("");
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile && !winner.proofImage) {
      setErrorMsg("Please select a screenshot file of your scorecard or golf platform.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("proofImage", selectedFile);
      }

      await onUploadSuccess(winner.id, formData);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Score Verification Proof"
      subtitle="Winner Verification System"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Winnings Summary Box */}
        <div className="p-4 bg-[#F5F2EB] border border-[#DDD7CD] rounded-xl flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="active">{winner.tierLabel || "Winning Ticket"}</Badge>
              <span className="text-xs font-mono-code text-[#6B726C]">{winner.drawNumber}</span>
            </div>
            <p className="text-xs text-[#575C57] mt-1.5 font-mono-code">
              Matched: {winner.matchedNumbers?.join(" • ") || "5 numbers"}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono-code uppercase text-[#8E948F] block">
              Net Prize Payout
            </span>
            <span className="font-editorial text-2xl font-bold text-[#181918]">
              ${Number(winner.netPayoutAmount || winner.prizeAmount).toFixed(2)}
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-[#FDF3F3] border border-[#ECC4C4] rounded-lg text-xs text-[#7A2424] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Verification Requirement Prompt */}
        <div className="text-xs text-[#575C57] leading-relaxed">
          <p className="font-semibold text-[#181918] mb-1">
            Verification Instructions:
          </p>
          <p>
            To maintain platform integrity and authorize the automated payout, please upload a clear screenshot of your recent Stableford scores from your official golf association portal (e.g. GHIN, Golf Genius, WHS, or course scorecard).
          </p>
        </div>

        {/* File Upload Drop Area */}
        <div className="border-2 border-dashed border-[#D5CFC5] rounded-xl p-6 text-center hover:bg-[#FAF8F5] transition-colors relative cursor-pointer">
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp, application/pdf"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />

          {previewUrl ? (
            <div className="space-y-2">
              <img
                src={previewUrl}
                alt="Proof Preview"
                className="max-h-48 mx-auto rounded-lg border border-[#DDD7CD] object-contain shadow-xs"
              />
              <p className="text-xs text-[#2D483A] font-mono-code">
                {selectedFile?.name} (Click or drag to change)
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-[#EAE4D8] flex items-center justify-center text-[#2D483A]">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-[#181918]">
                {selectedFile ? selectedFile.name : "Click or drag scorecard screenshot here"}
              </p>
              <p className="text-[11px] text-[#8E948F] font-mono-code">
                JPG, PNG, WebP or PDF up to 10MB
              </p>
            </div>
          )}
        </div>

        {winner.adminNotes && (
          <div className="p-3 bg-[#FAF8F5] border border-[#DDD7CD] rounded-lg text-xs text-[#6B726C]">
            <span className="font-semibold text-[#181918] block mb-0.5">Admin Note:</span>
            {winner.adminNotes}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E3D8]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#575C57] hover:bg-[#EAE4D8] rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-xs font-medium bg-[#181918] text-[#FAF8F5] hover:bg-[#2D483A] rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{loading ? "Submitting..." : "Submit Proof For Verification"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
