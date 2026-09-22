import React, { useState } from "react";
import { Plus, Edit2, Trash2, Heart, Calendar } from "lucide-react";
import { Badge } from "../common/Badge.jsx";
import { Modal } from "../common/Modal.jsx";

export const CharityManagementTab = ({ charities = [], onCreate, onUpdate, onDelete }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCharity, setEditingCharity] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    category: "Youth & Education",
    description: "",
    logo: "",
    bannerImage: "",
    eventTitle: "",
    eventDate: "",
    eventLocation: "",
    eventGoal: "",
    featured: false
  });
  const [loading, setLoading] = useState(false);

  const handleOpenCreate = () => {
    setEditingCharity(null);
    setFormData({
      name: "",
      tagline: "",
      category: "Youth & Education",
      description: "",
      logo: "",
      bannerImage: "",
      eventTitle: "",
      eventDate: "",
      eventLocation: "",
      eventGoal: "",
      featured: false
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCharity(c);
    setFormData({
      name: c.name || "",
      tagline: c.tagline || "",
      category: c.category || "Youth & Education",
      description: c.description || "",
      logo: c.logo || "",
      bannerImage: c.bannerImage || "",
      eventTitle: c.upcomingEvent?.title || "",
      eventDate: c.upcomingEvent?.date || "",
      eventLocation: c.upcomingEvent?.location || "",
      eventGoal: c.upcomingEvent?.goal || "",
      featured: Boolean(c.featured)
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      tagline: formData.tagline,
      category: formData.category,
      description: formData.description,
      logo: formData.logo,
      bannerImage: formData.bannerImage,
      featured: formData.featured,
      upcomingEvent: formData.eventTitle
        ? {
            title: formData.eventTitle,
            date: formData.eventDate,
            location: formData.eventLocation,
            goal: formData.eventGoal
          }
        : null
    };

    try {
      if (editingCharity) {
        await onUpdate(editingCharity.id, payload);
      } else {
        await onCreate(payload);
      }
      setModalOpen(false);
    } catch (err) {
      alert(err.message || "Failed to save charity.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name}?`)) return;
    try {
      await onDelete(id);
    } catch (err) {
      alert(err.message || "Failed to delete charity.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-editorial text-2xl font-bold text-[#181918]">
            03 · Charity Management & Story Directory
          </h3>
          <p className="text-xs text-[#6B726C] font-mono-code mt-0.5">
            Add vetted philanthropic partners, manage narratives, media, and golf charity days
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-[#181918] text-[#FAF8F5] hover:bg-[#2D483A] text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Beneficiary</span>
        </button>
      </div>

      {/* Charities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {charities.map((c) => (
          <div
            key={c.id}
            className="p-5 bg-white border border-[#DDD7CD] rounded-xl flex flex-col justify-between shadow-2xs"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h4 className="font-editorial text-lg font-bold text-[#181918]">
                    {c.name}
                  </h4>
                  <p className="text-xs text-[#6B726C] mt-0.5">{c.tagline}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {c.featured && <Badge variant="active">Spotlight</Badge>}
                  <Badge variant="outline">{c.category}</Badge>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono-code text-[#737A74] my-3 py-2 border-y border-[#EFEBE3]">
                <span>Raised: ${(c.totalRaised || 0).toLocaleString()}</span>
                <span>•</span>
                <span>{c.activeSupporters || 0} Supporters</span>
              </div>

              {c.upcomingEvent && (
                <div className="text-xs text-[#575C57] flex items-center gap-1.5 mb-2">
                  <Calendar className="w-3.5 h-3.5 text-[#2D483A]" />
                  <span>{c.upcomingEvent.title} ({c.upcomingEvent.date})</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EFEBE3]">
              <button
                onClick={() => handleOpenEdit(c)}
                className="px-3 py-1 text-xs border border-[#DDD7CD] rounded-md hover:bg-[#F5F2EB] flex items-center gap-1 text-[#2E312E]"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(c.id, c.name)}
                className="px-3 py-1 text-xs border border-[#ECC4C4] text-[#8C2C2C] hover:bg-[#FDF3F3] rounded-md flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Charity Form Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCharity ? `Edit ${editingCharity.name}` : "Add New Philanthropic Partner"}
        subtitle="Surface 03 · Charity Partner Specification"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono-code uppercase text-[#4E534E] mb-1">
              Charity Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#2D483A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono-code uppercase text-[#4E534E] mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#2D483A]"
              >
                <option value="Youth & Education">Youth & Education</option>
                <option value="Health & Inclusion">Health & Inclusion</option>
                <option value="Environment">Environment</option>
                <option value="Veterans & Wellness">Veterans & Wellness</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#181918]">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-[#D5CFC5] text-[#2D483A]"
                />
                <span>Featured as Homepage Spotlight</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-code uppercase text-[#4E534E] mb-1">
              Short Tagline *
            </label>
            <input
              type="text"
              required
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#2D483A]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono-code uppercase text-[#4E534E] mb-1">
              Full Narrative Description
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#2D483A]"
            />
          </div>

          <div className="p-3.5 bg-[#FAF8F5] border border-[#DDD7CD] rounded-lg space-y-3">
            <span className="text-xs font-bold font-mono-code uppercase text-[#2D483A] block">
              Upcoming Golf Charity Day (Optional)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Event Title"
                value={formData.eventTitle}
                onChange={(e) => setFormData({ ...formData, eventTitle: e.target.value })}
                className="px-2.5 py-1.5 text-xs border border-[#D5CFC5] rounded bg-white"
              />
              <input
                type="date"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="px-2.5 py-1.5 text-xs border border-[#D5CFC5] rounded bg-white"
              />
              <input
                type="text"
                placeholder="Course / Location"
                value={formData.eventLocation}
                onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                className="px-2.5 py-1.5 text-xs border border-[#D5CFC5] rounded bg-white"
              />
              <input
                type="text"
                placeholder="Fundraising Goal (e.g. $50,000)"
                value={formData.eventGoal}
                onChange={(e) => setFormData({ ...formData, eventGoal: e.target.value })}
                className="px-2.5 py-1.5 text-xs border border-[#D5CFC5] rounded bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E3D8]">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-3.5 py-1.5 text-xs text-[#575C57]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold bg-[#181918] text-[#FAF8F5] rounded-lg hover:bg-[#2D483A]"
            >
              {loading ? "Saving..." : "Save Beneficiary"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
