import React, { useState, useEffect, useCallback } from "react";
import { adminService } from "../services/adminService.js";
import { charityService } from "../services/charityService.js";
import { UserManagementTab } from "../components/admin/UserManagementTab.jsx";
import { DrawManagementTab } from "../components/admin/DrawManagementTab.jsx";
import { CharityManagementTab } from "../components/admin/CharityManagementTab.jsx";
import { WinnerVerificationTab } from "../components/admin/WinnerVerificationTab.jsx";
import { ReportsTab } from "../components/admin/ReportsTab.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { Shield, Users, Award, Heart, CheckSquare, BarChart3, RefreshCw } from "lucide-react";

export const AdminDashboardPage = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("01_users");
  const [loading, setLoading] = useState(true);

  // Surface Data
  const [users, setUsers] = useState([]);
  const [drawData, setDrawData] = useState(null);
  const [charities, setCharities] = useState([]);
  const [winners, setWinners] = useState([]);
  const [reports, setReports] = useState(null);

  const tabs = [
    { id: "01_users", label: "01 User Management", icon: Users },
    { id: "02_draws", label: "02 Draw Engine & Simulation", icon: Award },
    { id: "03_charities", label: "03 Charity Management", icon: Heart },
    { id: "04_winners", label: "04 Winners & Verification", icon: CheckSquare },
    { id: "05_reports", label: "05 Reports & Analytics", icon: BarChart3 }
  ];

  const fetchAdminData = useCallback(async () => {
    try {
      const [uRes, dRes, cRes, wRes, rRes] = await Promise.all([
        adminService.getUsers(),
        adminService.getDrawData(),
        charityService.getAll().then((r) => r.charities || []).catch(() => []),
        adminService.getWinners(),
        adminService.getReports()
      ]);

      setUsers(uRes || []);
      setDrawData(dRes || null);
      setCharities(cRes || []);
      setWinners(wRes || []);
      setReports(rRes || null);
    } catch (err) {
      console.error("Failed to load admin dashboard data", err);
      toast.error("Failed to fetch admin surfaces data.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  // Handlers for Surface 01
  const handleUpdateUser = async (userId, data) => {
    await adminService.updateUser(userId, data);
    toast.success("User updated.");
    await fetchAdminData();
  };

  const handleUpdateScores = async (userId, scores) => {
    await adminService.updateUserScores(userId, scores);
    toast.success("Scores overridden and ticket synced.");
    await fetchAdminData();
  };

  // Handlers for Surface 02
  const handleSimulate = async (options) => {
    return await adminService.simulateDraw(options);
  };

  const handlePublish = async (data) => {
    await adminService.publishDraw(data);
    toast.success("Draw officially published!");
    await fetchAdminData();
  };

  // Handlers for Surface 03
  const handleCreateCharity = async (charityData) => {
    await adminService.createCharity(charityData);
    toast.success("Beneficiary partner created.");
    await fetchAdminData();
  };

  const handleUpdateCharity = async (id, updates) => {
    await adminService.updateCharity(id, updates);
    toast.success("Beneficiary updated.");
    await fetchAdminData();
  };

  const handleDeleteCharity = async (id) => {
    await adminService.deleteCharity(id);
    toast.info("Beneficiary removed.");
    await fetchAdminData();
  };

  // Handlers for Surface 04
  const handleReviewWinnerProof = async (winnerId, action, notes) => {
    await adminService.reviewWinnerProof(winnerId, action, notes);
    toast.success(`Verification ${action}d.`);
    await fetchAdminData();
  };

  const handleMarkPayoutPaid = async (winnerId, transactionRef) => {
    await adminService.markPayoutPaid(winnerId, transactionRef);
    toast.success("Payout marked as completed.");
    await fetchAdminData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Editorial Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD7CD] pb-6">
        <div>
          <div className="text-xs font-mono-code uppercase tracking-wider text-[#2D483A] font-semibold mb-1">
            FULL CONTROL · FIVE CONTROL SURFACES
          </div>
          <h1 className="font-editorial text-4xl font-bold text-[#181918]">
            Operations Dashboard
          </h1>
          <p className="text-xs text-[#6B726C] font-mono-code mt-1">
            Real-time subscriber management, draw simulation engine, and verification review
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="p-2.5 border border-[#DDD7CD] rounded-xl text-[#575C57] hover:bg-[#F5F2EB] flex items-center gap-2 text-xs font-mono-code self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh All Surfaces</span>
        </button>
      </div>

      {/* Five Surface Control Navigation Tabs (Slide 7) */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#DDD7CD] pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold font-mono-code uppercase transition-all flex items-center gap-2 ${
                isActive
                  ? "bg-[#181918] text-[#FAF8F5] shadow-xs"
                  : "bg-white text-[#575C57] hover:bg-[#F5F2EB] border border-[#DDD7CD]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Control Surface View */}
      <div className="pt-2">
        {activeTab === "01_users" && (
          <UserManagementTab
            users={users}
            onUpdateUser={handleUpdateUser}
            onUpdateScores={handleUpdateScores}
          />
        )}

        {activeTab === "02_draws" && (
          <DrawManagementTab
            drawData={drawData}
            onSimulate={handleSimulate}
            onPublish={handlePublish}
            onRefresh={fetchAdminData}
          />
        )}

        {activeTab === "03_charities" && (
          <CharityManagementTab
            charities={charities}
            onCreate={handleCreateCharity}
            onUpdate={handleUpdateCharity}
            onDelete={handleDeleteCharity}
          />
        )}

        {activeTab === "04_winners" && (
          <WinnerVerificationTab
            winners={winners}
            onReview={handleReviewWinnerProof}
            onMarkPaid={handleMarkPayoutPaid}
            onRefresh={fetchAdminData}
          />
        )}

        {activeTab === "05_reports" && (
          <ReportsTab reports={reports} />
        )}
      </div>
    </div>
  );
};
