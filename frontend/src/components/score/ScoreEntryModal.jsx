import React, { useState, useEffect } from "react";
import { Modal } from "../common/Modal.jsx";
import { AlertCircle, HelpCircle } from "lucide-react";

export const ScoreEntryModal = ({ isOpen, onClose, onSave, editingScore = null, existingScores = [] }) => {
  const [score, setScore] = useState("");
  const [date, setDate] = useState("");
  const [course, setCourse] = useState("");
  const [notes, setNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingScore) {
      setScore(editingScore.score?.toString() || "");
      setDate(editingScore.date || "");
      setCourse(editingScore.course || "");
      setNotes(editingScore.notes || "");
    } else {
      setScore("");
      setDate(new Date().toISOString().split("T")[0]);
      setCourse("");
      setNotes("");
    }
    setErrorMsg("");
  }, [editingScore, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const numScore = Number(score);
    if (isNaN(numScore) || numScore < 1 || numScore > 45) {
      setErrorMsg("Stableford score must be an integer between 1 and 45.");
      return;
    }

    if (!date) {
      setErrorMsg("Please select the date played.");
      return;
    }

    // Check duplicate date constraint ("Only one score entry is permitted per date")
    const isDuplicate = existingScores.some(
      (s) => s.date === date && (!editingScore || s.id !== editingScore.id)
    );
    if (isDuplicate) {
      setErrorMsg(`A score for ${date} already exists. Only one score is permitted per date. Please edit that entry or select a different date.`);
      return;
    }

    setSubmitting(true);
    try {
      await onSave({
        score: numScore,
        date,
        course: course || "Home Course",
        notes
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Failed to save score.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingScore ? "Edit Stableford Score" : "Log New Stableford Score"}
      subtitle="Score Management System"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {errorMsg && (
          <div className="p-3 bg-[#FDF3F3] border border-[#ECC4C4] rounded-lg text-xs text-[#7A2424] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Stableford Score Field */}
          <div>
            <label className="block text-xs font-mono-code uppercase tracking-wider text-[#4E534E] mb-1.5">
              Stableford Points (1–45) *
            </label>
            <input
              type="number"
              min="1"
              max="45"
              step="1"
              required
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="e.g. 36"
              className="w-full px-3.5 py-2.5 bg-white border border-[#D5CFC5] rounded-lg text-sm text-[#181918] placeholder-[#9E9E9E] focus:outline-none focus:border-[#2D483A] focus:ring-1 focus:ring-[#2D483A]"
            />
            <span className="text-[11px] text-[#787D78] mt-1 block">
              Standard net Stableford points for 18 holes
            </span>
          </div>

          {/* Date Played Field */}
          <div>
            <label className="block text-xs font-mono-code uppercase tracking-wider text-[#4E534E] mb-1.5">
              Date Played *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#D5CFC5] rounded-lg text-sm text-[#181918] focus:outline-none focus:border-[#2D483A] focus:ring-1 focus:ring-[#2D483A]"
            />
            <span className="text-[11px] text-[#787D78] mt-1 block">
              Max 1 entry permitted per calendar day
            </span>
          </div>
        </div>

        {/* Course Name */}
        <div>
          <label className="block text-xs font-mono-code uppercase tracking-wider text-[#4E534E] mb-1.5">
            Golf Course / Venue
          </label>
          <input
            type="text"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="e.g. Bandon Dunes, Cypress Point, etc."
            className="w-full px-3.5 py-2.5 bg-white border border-[#D5CFC5] rounded-lg text-sm text-[#181918] placeholder-[#9E9E9E] focus:outline-none focus:border-[#2D483A] focus:ring-1 focus:ring-[#2D483A]"
          />
        </div>

        {/* Optional Notes */}
        <div>
          <label className="block text-xs font-mono-code uppercase tracking-wider text-[#4E534E] mb-1.5">
            Round Notes (Optional)
          </label>
          <textarea
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Weather conditions, notable scramble holes, putting performance..."
            className="w-full px-3.5 py-2.5 bg-white border border-[#D5CFC5] rounded-lg text-sm text-[#181918] placeholder-[#9E9E9E] focus:outline-none focus:border-[#2D483A] focus:ring-1 focus:ring-[#2D483A]"
          />
        </div>

        {/* Informative Note Box */}
        <div className="p-3.5 bg-[#F6F3EB] border border-[#DDD7CD] rounded-lg text-xs text-[#575C57] space-y-1">
          <div className="font-semibold text-[#181918] flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#2D483A]" />
            Automatic Replacement Notice
          </div>
          <p>
            Only your latest 5 scores are retained. If you already have 5 entries, adding this score will automatically drop your oldest chronological entry to ensure your draw ticket reflects current form.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E3D8]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#4E534E] hover:text-[#181918] hover:bg-[#EAE4D8] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 text-sm font-medium bg-[#181918] text-[#FAF8F5] hover:bg-[#2D483A] rounded-lg transition-colors disabled:opacity-50"
          >
            {submitting ? "Saving..." : editingScore ? "Update Score" : "Record Score"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
