/**
 * ScoreCard — circular score ring + stats grid
 * Props: score (0-100), risk ('high'|'medium'|'low'), wordCount, sourceCount, matchCount, exactCount
 */

const RISK_CONFIG = {
  high:   { label: 'High Risk',   ringColor: '#D85A30', textColor: '#993C1D', bgColor: '#FAECE7' },
  medium: { label: 'Medium Risk', ringColor: '#EF9F27', textColor: '#854F0B', bgColor: '#FAEEDA' },
  low:    { label: 'Low Risk',    ringColor: '#1D9E75', textColor: '#0F6E56', bgColor: '#E1F5EE' },
}

// Circle circumference for r=36 is ~226.2
const CIRCUMFERENCE = 226

export default function ScoreCard({ score, risk, wordCount, sourceCount, matchCount, exactCount }) {
  const cfg = RISK_CONFIG[risk] ?? RISK_CONFIG.low
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col items-center">
      {/* Ring */}
      <div className="relative w-[90px] h-[90px] mb-2.5">
        <svg width="90" height="90" viewBox="0 0 90 90">
          <circle className="score-ring-track" cx="45" cy="45" r="36" />
          <circle
            className="score-ring-fill"
            cx="45" cy="45" r="36"
            stroke={cfg.ringColor}
            strokeDashoffset={offset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '45px 45px' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-[20px] font-medium font-mono"
            style={{ color: cfg.textColor }}
          >
            {score}%
          </span>
        </div>
      </div>

      <p className="text-[11px] text-gray-400 mb-1.5">Similarity Score</p>

      <span
        className="text-[12px] font-medium px-3 py-1 rounded-full mb-3"
        style={{ background: cfg.bgColor, color: cfg.textColor }}
      >
        {cfg.label}
      </span>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-1.5 w-full">
        {[
          { num: sourceCount,         lbl: 'Sources' },
          { num: wordCount >= 1000 ? `${(wordCount / 1000).toFixed(1)}k` : wordCount, lbl: 'Words' },
          { num: matchCount,          lbl: 'Matches' },
          { num: exactCount,          lbl: 'Exact'   },
        ].map(({ num, lbl }) => (
          <div key={lbl} className="bg-gray-50 rounded-lg px-2.5 py-2">
            <p className="text-[16px] font-medium text-gray-900 font-mono leading-none">{num}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{lbl}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
Refinement 29: Improving consistency across the module
