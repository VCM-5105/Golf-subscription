import React, { useState } from "react";
import { Play, Send, RefreshCw, Sparkles, CheckCircle2, AlertTriangle, Layers } from "lucide-react";
import { Badge } from "../common/Badge.jsx";

export const DrawManagementTab = ({ drawData, onSimulate, onPublish, onRefresh }) => {
  const [logicType, setLogicType] = useState("algorithmic");
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [customNumbersInput, setCustomNumbersInput] = useState("");

  const activeDraw = drawData?.activeDraw;
  const settings = drawData?.settings;
  const stats = drawData?.stats;

  const handleRunSimulation = async () => {
    setSimulating(true);
    try {
      let customNumbers = null;
      if (customNumbersInput.trim()) {
        customNumbers = customNumbersInput
          .split(",")
          .map((n) => Number(n.trim()))
          .filter((n) => !isNaN(n) && n >= 1 && n <= 45);
        if (customNumbers.length !== 5) {
          alert("Please enter exactly 5 comma-separated numbers between 1 and 45.");
          setSimulating(false);
          return;
        }
      }

      const result = await onSimulate({
        logicType,
        customWinningNumbers: customNumbers
      });
      setSimulationResult(result);
    } catch (err) {
      alert(err.message || "Failed to run simulation.");
    } finally {
      setSimulating(false);
    }
  };

  const handlePublishDraw = async () => {
    if (!simulationResult) {
      alert("Please run a simulation first to preview matches and payouts before publishing.");
      return;
    }

    const confirm = window.confirm(
      `Are you sure you want to publish the official draw with numbers [${simulationResult.drawnNumbers.join(", ")}]? This will notify winners to submit proof for payouts.`
    );
    if (!confirm) return;

    setPublishing(true);
    try {
      await onPublish({
        winningNumbers: simulationResult.drawnNumbers,
        logicType
      });
      setSimulationResult(null);
      setCustomNumbersInput("");
      alert("Draw published successfully! All participant winnings recorded.");
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message || "Failed to publish draw.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Surface Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-editorial text-2xl font-bold text-[#181918]">
            02 · Draw Management & Simulation Engine
          </h3>
          <p className="text-xs text-[#6B726C] font-mono-code mt-0.5">
            Configure draw logic (Random vs Algorithmic), simulate outcomes, and publish results
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="p-2 border border-[#DDD7CD] rounded-lg text-[#575C57] hover:bg-[#F5F2EB] transition-colors self-start sm:self-auto flex items-center gap-1.5 text-xs font-mono-code"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Pool</span>
        </button>
      </div>

      {/* Active Draw Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-[#DDD7CD] rounded-xl shadow-2xs">
          <span className="text-[10px] font-mono-code uppercase text-[#8E948F] block">
            Current Draw ID
          </span>
          <span className="font-editorial text-xl font-bold text-[#181918]">
            {activeDraw?.drawNumber || "DRAW-ACTIVE"}
          </span>
          <span className="text-[11px] font-mono-code text-[#787D78] mt-1 block">
            Scheduled: {activeDraw?.drawDate?.split("T")[0]}
          </span>
        </div>

        <div className="p-4 bg-white border border-[#DDD7CD] rounded-xl shadow-2xs">
          <span className="text-[10px] font-mono-code uppercase text-[#8E948F] block">
            Base Subscription Pool
          </span>
          <span className="font-editorial text-xl font-bold text-[#181918]">
            ${(stats?.basePool || 21900).toLocaleString()}
          </span>
          <span className="text-[11px] font-mono-code text-[#2D483A] mt-1 block">
            {stats?.activeSubscribers || 2190} Active Subscribers
          </span>
        </div>

        <div className="p-4 bg-white border border-[#DDD7CD] rounded-xl shadow-2xs">
          <span className="text-[10px] font-mono-code uppercase text-[#8E948F] block">
            Accumulated Rollover
          </span>
          <span className="font-editorial text-xl font-bold text-[#181918] flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-[#C28B38]" />
            ${(stats?.rolloverJackpot || 12360).toLocaleString()}
          </span>
          <span className="text-[11px] font-mono-code text-[#C28B38] mt-1 block">
            5-Match Jackpot Pool
          </span>
        </div>

        <div className="p-4 bg-white border border-[#DDD7CD] rounded-xl shadow-2xs">
          <span className="text-[10px] font-mono-code uppercase text-[#8E948F] block">
            Projected Total Pool
          </span>
          <span className="font-editorial text-xl font-bold text-[#181918]">
            ${(stats?.totalPool || 34260).toLocaleString()}
          </span>
          <span className="text-[11px] font-mono-code text-[#575C57] mt-1 block">
            40% / 35% / 25% Enforced
          </span>
        </div>
      </div>

      {/* Control Box: Configure Logic & Run Simulation */}
      <div className="p-6 bg-white border border-[#DDD7CD] rounded-xl shadow-2xs space-y-6">
        <h4 className="font-editorial text-lg font-semibold text-[#181918] border-b border-[#EFEBE3] pb-3">
          Configure Simulation Parameters
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logic Mode: Random vs Algorithmic */}
          <div>
            <label className="block text-xs font-mono-code uppercase text-[#4E534E] mb-2">
              Draw Algorithm Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-xl border cursor-pointer flex flex-col transition-all ${
                  logicType === "algorithmic"
                    ? "bg-[#F5F8F6] border-[#2D483A] text-[#181918]"
                    : "bg-[#FAF8F5] border-[#D5CFC5] text-[#575C57]"
                }`}
              >
                <input
                  type="radio"
                  name="logic"
                  value="algorithmic"
                  checked={logicType === "algorithmic"}
                  onChange={() => setLogicType("algorithmic")}
                  className="sr-only"
                />
                <span className="text-xs font-bold uppercase font-mono-code">
                  Algorithmic
                </span>
                <span className="text-[11px] text-[#6B726C] mt-1 leading-relaxed">
                  Weighted by score frequency among active subscriber rounds
                </span>
              </label>

              <label
                className={`p-3 rounded-xl border cursor-pointer flex flex-col transition-all ${
                  logicType === "random"
                    ? "bg-[#F5F8F6] border-[#2D483A] text-[#181918]"
                    : "bg-[#FAF8F5] border-[#D5CFC5] text-[#575C57]"
                }`}
              >
                <input
                  type="radio"
                  name="logic"
                  value="random"
                  checked={logicType === "random"}
                  onChange={() => setLogicType("random")}
                  className="sr-only"
                />
                <span className="text-xs font-bold uppercase font-mono-code">
                  Random Lottery
                </span>
                <span className="text-[11px] text-[#6B726C] mt-1 leading-relaxed">
                  Standard uniform distribution lottery across numbers 1–45
                </span>
              </label>
            </div>
          </div>

          {/* Optional Fixed Number Override for Testing */}
          <div>
            <label className="block text-xs font-mono-code uppercase text-[#4E534E] mb-2">
              Custom Numbers Override (Optional Test)
            </label>
            <input
              type="text"
              value={customNumbersInput}
              onChange={(e) => setCustomNumbersInput(e.target.value)}
              placeholder="e.g. 12, 22, 34, 38, 41"
              className="w-full px-3.5 py-2.5 bg-white border border-[#D5CFC5] rounded-lg text-xs font-mono-code focus:outline-none focus:border-[#2D483A]"
            />
            <span className="text-[11px] text-[#787D78] mt-1 block">
              Leave blank to automatically draw 5 numbers using chosen algorithm
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleRunSimulation}
            disabled={simulating}
            className="px-5 py-2.5 bg-[#181918] text-[#FAF8F5] hover:bg-[#2D483A] text-xs font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            <span>{simulating ? "Executing Simulation..." : "Run Draw Simulation"}</span>
          </button>
        </div>
      </div>

      {/* Simulation Results Preview Box */}
      {simulationResult && (
        <div className="p-6 bg-[#FAF8F5] border border-[#2D483A]/40 rounded-xl space-y-5 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDD7CD]">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="active">Simulation Complete</Badge>
                <span className="text-xs font-mono-code text-[#575C57]">
                  Evaluated {simulationResult.totalTicketsEvaluated} active tickets
                </span>
              </div>
              <h4 className="font-editorial text-xl font-bold text-[#181918] mt-1">
                Simulated Winning Numbers
              </h4>
            </div>

            <div className="flex items-center gap-2">
              {simulationResult.drawnNumbers.map((n, idx) => (
                <div
                  key={idx}
                  className="w-12 h-12 rounded-xl bg-[#2D483A] text-[#FAF8F5] font-editorial text-xl font-bold flex items-center justify-center shadow-xs"
                >
                  {n}
                </div>
              ))}
            </div>
          </div>

          {/* Tier Outcomes Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-[#DDD7CD] rounded-xl">
              <span className="text-[10px] font-mono-code uppercase text-[#8E948F] block">
                5-Number Match (40% + Rollover)
              </span>
              <div className="font-editorial text-2xl font-bold text-[#181918] mt-0.5">
                {simulationResult.pools.match5.winnersCount} Winners
              </div>
              <p className="text-xs text-[#6B726C] mt-1 font-mono-code">
                Pool: ${simulationResult.pools.match5.pool.toLocaleString()} •{" "}
                {simulationResult.pools.match5.winnersCount > 0
                  ? `$${simulationResult.pools.match5.prizePerWinner}/winner`
                  : `Rollover to next: $${simulationResult.pools.match5.rolloverToNextIfUnclaimed.toLocaleString()}`}
              </p>
            </div>

            <div className="p-4 bg-white border border-[#DDD7CD] rounded-xl">
              <span className="text-[10px] font-mono-code uppercase text-[#8E948F] block">
                4-Number Match (35% Tier)
              </span>
              <div className="font-editorial text-2xl font-bold text-[#181918] mt-0.5">
                {simulationResult.pools.match4.winnersCount} Winners
              </div>
              <p className="text-xs text-[#6B726C] mt-1 font-mono-code">
                Pool: ${simulationResult.pools.match4.pool.toLocaleString()} •{" "}
                {simulationResult.pools.match4.winnersCount > 0
                  ? `$${simulationResult.pools.match4.prizePerWinner}/winner`
                  : "No winners in tier"}
              </p>
            </div>

            <div className="p-4 bg-white border border-[#DDD7CD] rounded-xl">
              <span className="text-[10px] font-mono-code uppercase text-[#8E948F] block">
                3-Number Match (25% Tier)
              </span>
              <div className="font-editorial text-2xl font-bold text-[#181918] mt-0.5">
                {simulationResult.pools.match3.winnersCount} Winners
              </div>
              <p className="text-xs text-[#6B726C] mt-1 font-mono-code">
                Pool: ${simulationResult.pools.match3.pool.toLocaleString()} •{" "}
                {simulationResult.pools.match3.winnersCount > 0
                  ? `$${simulationResult.pools.match3.prizePerWinner}/winner`
                  : "No winners in tier"}
              </p>
            </div>
          </div>

          {/* Publish Action */}
          <div className="flex items-center justify-between pt-3 border-t border-[#DDD7CD]">
            <div className="text-xs text-[#575C57]">
              Simulation verified. Ready to publish official draw and disburse notifications?
            </div>
            <button
              onClick={handlePublishDraw}
              disabled={publishing}
              className="px-6 py-2.5 bg-[#2D483A] text-white hover:bg-[#1E3328] text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>{publishing ? "Publishing Official Results..." : "Publish Official Draw"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
