import React, { useState } from "react";
import { Search, Shield, Check } from "lucide-react";
import { Badge } from "../common/Badge.jsx";
import { Modal } from "../common/Modal.jsx";

export const UserManagementTab = ({ users = [], onUpdateUser, onUpdateScores }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingScoresUser, setEditingScoresUser] = useState(null);
  const [scoresInput, setScoresInput] = useState(["", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditScoresClick = (user) => {
    setEditingScoresUser(user);
    const existing = (user.scores || []).map((s) => s.score);
    const padded = [
      existing[0] ?? "",
      existing[1] ?? "",
      existing[2] ?? "",
      existing[3] ?? "",
      existing[4] ?? ""
    ];
    setScoresInput(padded);
  };

  const handleSaveScores = async (e) => {
    e.preventDefault();
    if (!editingScoresUser) return;

    for (let i = 0; i < scoresInput.length; i++) {
      const val = Number(scoresInput[i]);
      if (isNaN(val) || val < 1 || val > 45) {
        alert(`Score #${i + 1} must be an integer between 1 and 45.`);
        return;
      }
    }

    const formatted = scoresInput.map((val, idx) => ({
      score: Number(val),
      date: new Date(Date.now() - idx * 86400000 * 7).toISOString().split("T")[0],
      course: "Verified Round",
      notes: "Admin audited score"
    }));

    setLoading(true);
    try {
      await onUpdateScores(editingScoresUser.id, formatted);
      setEditingScoresUser(null);
    } catch (err) {
      alert(err.message || "Failed to update scores.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSubscription = async (user) => {
    const currentStatus = user.subscription?.status;
    const newStatus = currentStatus === "active" ? "cancelled" : "active";

    try {
      await onUpdateUser(user.id, {
        subscriptionStatus: newStatus,
        renewalDate: new Date(Date.now() + 30 * 86400000).toISOString()
      });
    } catch (err) {
      alert(err.message || "Failed to toggle subscription.");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await onUpdateUser(userId, { role: newRole });
    } catch (err) {
      alert(err.message || "Failed to update user role.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Overview Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-editorial text-2xl font-bold text-[#181918]">
            01 · User & Subscription Management
          </h3>
          <p className="text-xs text-[#6B726C] font-mono-code mt-0.5">
            View profiles, audit Stableford scores, and promote users to Administrator dynamically
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#8E948F] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-[#DDD7CD] rounded-lg focus:outline-none focus:border-[#2D483A]"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto border border-[#DDD7CD] rounded-xl bg-white shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F6F3EB] border-b border-[#DDD7CD] font-mono-code uppercase text-[#787D78]">
            <tr>
              <th className="py-3 px-4">Member</th>
              <th className="py-3 px-4">Role (Dynamic)</th>
              <th className="py-3 px-4">Subscription</th>
              <th className="py-3 px-4">Beneficiary</th>
              <th className="py-3 px-4">Scores</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFEBE3]">
            {filteredUsers.map((u) => {
              const isActive = u.subscription?.status === "active";
              return (
                <tr key={u.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#181918]">{u.name}</div>
                    <div className="text-[11px] font-mono-code text-[#787D78]">{u.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={u.role || "subscriber"}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className={`text-xs border rounded px-2 py-1 font-mono-code cursor-pointer font-medium ${
                        u.role === "admin"
                          ? "bg-[#181918] text-white border-[#181918]"
                          : "bg-white text-[#181918] border-[#DDD7CD]"
                      }`}
                    >
                      <option value="subscriber">subscriber</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <Badge variant={isActive ? "active" : "pending"}>
                        {u.subscription?.status || "inactive"}
                      </Badge>
                      <button
                        onClick={() => handleToggleSubscription(u)}
                        className="text-[11px] underline text-[#575C57] hover:text-[#181918]"
                      >
                        {isActive ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-[#181918] font-medium">
                      {u.charity?.charityName || "None designated"}
                    </div>
                    {u.charity?.percentage && (
                      <div className="text-[11px] font-mono-code text-[#2D483A]">
                        {u.charity.percentage}% directed
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono-code font-semibold text-[#181918]">
                        {u.scoresCount || 0}/5
                      </span>
                      {u.scores && u.scores.length > 0 && (
                        <span className="text-[10px] text-[#787D78] font-mono-code truncate max-w-[120px]">
                          [{u.scores.map((s) => s.score).join(",")}]
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleEditScoresClick(u)}
                      className="px-2.5 py-1 text-xs border border-[#DDD7CD] rounded hover:bg-[#F5F2EB] transition-colors text-[#2E312E]"
                    >
                      Audit Scores
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit User Scores Modal */}
      {editingScoresUser && (
        <Modal
          isOpen={Boolean(editingScoresUser)}
          onClose={() => setEditingScoresUser(null)}
          title={`Audit Scores: ${editingScoresUser.name}`}
          subtitle="Surface 01 · Direct Stableford Score Override"
        >
          <form onSubmit={handleSaveScores} className="space-y-4">
            <p className="text-xs text-[#6B726C]">
              Specify exactly 5 Stableford scores (1–45). These numbers will automatically generate the user's enrolled ticket in the active draw.
            </p>

            <div className="grid grid-cols-5 gap-2">
              {scoresInput.map((val, idx) => (
                <div key={idx}>
                  <label className="block text-[10px] font-mono-code uppercase text-[#787D78] mb-1">
                    Score #{idx + 1}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="45"
                    required
                    value={val}
                    onChange={(e) => {
                      const copy = [...scoresInput];
                      copy[idx] = e.target.value;
                      setScoresInput(copy);
                    }}
                    placeholder="36"
                    className="w-full p-2 text-center text-sm font-bold bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#2D483A]"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E3D8]">
              <button
                type="button"
                onClick={() => setEditingScoresUser(null)}
                className="px-3.5 py-1.5 text-xs text-[#575C57]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-1.5 text-xs font-semibold bg-[#181918] text-[#FAF8F5] rounded-lg hover:bg-[#2D483A]"
              >
                {loading ? "Saving..." : "Save Scores & Sync Ticket"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
