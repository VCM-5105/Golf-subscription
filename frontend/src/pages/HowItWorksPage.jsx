import React from "react";
import { ArrowRight, CheckCircle2, ShieldCheck, Ticket, Layers, HelpCircle, FileText } from "lucide-react";
import { Badge } from "../components/common/Badge.jsx";

export const HowItWorksPage = ({ setCurrentView }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F4F1EA] border border-[#DDD7CD] rounded-full text-xs font-mono-code text-[#4E534E]">
          <span>ARCHITECTURE & INTEGRITY</span>
        </div>

        <h1 className="font-editorial text-4xl sm:text-6xl font-bold tracking-tight text-[#181918]">
          How it <span className="italic font-serif font-normal text-[#2D483A]">works.</span>
        </h1>

        <p className="text-base sm:text-lg text-[#4E534E] leading-relaxed font-light">
          A clear, rules-enforced engine ensuring transparent score tracking, mathematically verified prize distribution, and non-profit accountability.
        </p>
      </div>

      {/* Step 01: Score Management System */}
      <section className="p-8 sm:p-10 rounded-2xl bg-white border border-[#DDD7CD] space-y-8 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-code uppercase text-[#2D483A] font-semibold mb-2">
            <span>SCORE MANAGEMENT SYSTEM</span>
          </div>
          <h2 className="font-editorial text-3xl font-bold text-[#181918]">
            Input Requirements & Functional Behaviour
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-xs font-mono-code uppercase tracking-wider text-[#787D78]">
              Input Requirements
            </h4>
            <ul className="space-y-3 text-sm text-[#4E534E]">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D483A] shrink-0 mt-2" />
                <span><strong>Last 5 Golf Scores:</strong> Users must enter their latest 5 rounds to enroll in the draw.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D483A] shrink-0 mt-2" />
                <span><strong>Stableford Format (1–45):</strong> Points calculated against course handicap, awarding points for bogeys (1), pars (2), birdies (3), and eagles (4).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D483A] shrink-0 mt-2" />
                <span><strong>Required Date:</strong> Each score submission must be stamped with a verified play date.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-mono-code uppercase tracking-wider text-[#787D78]">
              Functional Behaviour
            </h4>
            <ul className="space-y-3 text-sm text-[#4E534E]">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D483A] shrink-0 mt-2" />
                <span><strong>Latest 5 Retained:</strong> Only the most recent 5 scores are permanently stored in your profile.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D483A] shrink-0 mt-2" />
                <span><strong>Automatic FIFO Replacement:</strong> When you log your 6th score, your oldest historical round is automatically archived.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D483A] shrink-0 mt-2" />
                <span><strong>Reverse Chronological Display:</strong> Your rounds always appear from most recent to oldest.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Note from Slide 3 */}
        <div className="p-4 bg-[#F8F5EE] border-l-4 border-[#2D483A] rounded-r-xl text-xs text-[#575C57]">
          <strong>Note:</strong> Only one score entry is permitted per date. Duplicate scores for the same date are not allowed — an existing entry may only be edited or deleted.
        </div>
      </section>

      {/* Step 02: The Draw Mechanics & Prize Pool */}
      <section className="p-8 sm:p-10 rounded-2xl bg-white border border-[#DDD7CD] space-y-8 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-code uppercase text-[#2D483A] font-semibold mb-2">
            <span>PRIZE POOL LOGIC</span>
          </div>
          <h2 className="font-editorial text-3xl font-bold text-[#181918]">
            Draw Types, Pool Shares & Rollover
          </h2>
          <p className="text-sm text-[#575C57] mt-1 max-w-2xl">
            A fixed portion of each subscription contributes to the prize pool. Distribution is pre-defined and enforced automatically.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-[#DDD7CD] rounded-xl overflow-hidden">
            <thead className="bg-[#F6F3EB] font-mono-code uppercase text-[#787D78] border-b border-[#DDD7CD]">
              <tr>
                <th className="py-3 px-4">Match Type</th>
                <th className="py-3 px-4">Pool Share</th>
                <th className="py-3 px-4">Rollover?</th>
                <th className="py-3 px-4">Rules & Mechanics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEBE3]">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#181918]">5-Number Match</td>
                <td className="py-3.5 px-4 font-mono-code font-bold text-[#2D483A]">40%</td>
                <td className="py-3.5 px-4">
                  <Badge variant="active">Yes — Jackpot</Badge>
                </td>
                <td className="py-3.5 px-4 text-[#575C57]">
                  Grand Prize. If unclaimed in a monthly draw, this 40% pool carries forward into next month's jackpot.
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#181918]">4-Number Match</td>
                <td className="py-3.5 px-4 font-mono-code font-bold text-[#2D483A]">35%</td>
                <td className="py-3.5 px-4">
                  <Badge variant="default">No</Badge>
                </td>
                <td className="py-3.5 px-4 text-[#575C57]">
                  Second tier pool split equally among all qualifying 4-number match subscribers.
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#181918]">3-Number Match</td>
                <td className="py-3.5 px-4 font-mono-code font-bold text-[#2D483A]">25%</td>
                <td className="py-3.5 px-4">
                  <Badge variant="default">No</Badge>
                </td>
                <td className="py-3.5 px-4 text-[#575C57]">
                  Third tier pool split equally among all qualifying 3-number match subscribers.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono-code text-[#737A74]">
          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#DDD7CD]">
            • Auto-calculation of each pool tier based on active subscriber count
          </div>
          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#DDD7CD]">
            • Prizes split equally among multiple winners in the same tier
          </div>
        </div>
      </section>

      {/* Step 03: Verification & Payout System */}
      <section className="p-8 sm:p-10 rounded-2xl bg-white border border-[#DDD7CD] space-y-6 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-code uppercase text-[#2D483A] font-semibold mb-2">
            <span>WINNER VERIFICATION SYSTEM</span>
          </div>
          <h2 className="font-editorial text-3xl font-bold text-[#181918]">
            Verify. Display. Payout.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#DDD7CD] space-y-2">
            <span className="text-xs font-mono-code font-bold text-[#2D483A]">01 · Eligibility</span>
            <p className="text-xs text-[#575C57]">Verification applies strictly to winning tickets to uphold system trust.</p>
          </div>

          <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#DDD7CD] space-y-2">
            <span className="text-xs font-mono-code font-bold text-[#2D483A]">02 · Proof Upload</span>
            <p className="text-xs text-[#575C57]">Winner uploads screenshot of rounds from official golf platform or scorecard.</p>
          </div>

          <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#DDD7CD] space-y-2">
            <span className="text-xs font-mono-code font-bold text-[#2D483A]">03 · Admin Review</span>
            <p className="text-xs text-[#575C57]">Admin audits points against submitted scorecard, approving or rejecting with notes.</p>
          </div>

          <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#DDD7CD] space-y-2">
            <span className="text-xs font-mono-code font-bold text-[#2D483A]">04 · Payout States</span>
            <p className="text-xs text-[#575C57]">Seamless transition from <code>Pending</code> to <code>Paid</code> with recorded reference.</p>
          </div>
        </div>

        <div className="pt-6 border-t border-[#EFEBE3] flex items-center justify-between">
          <p className="text-xs text-[#6B726C]">
            Ready to participate in this month's impact draw?
          </p>
          <button
            onClick={() => setCurrentView("subscribe")}
            className="px-5 py-2.5 bg-[#181918] text-[#FAF8F5] hover:bg-[#2D483A] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>Activate Membership</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
