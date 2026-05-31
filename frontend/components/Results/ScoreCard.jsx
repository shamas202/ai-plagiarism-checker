const RISK_STYLES = {
  high:   { pill: 'bg-[#FAECE7] text-[#993C1D]', bar: '#D85A30' },
  medium: { pill: 'bg-[#FAEEDA] text-[#854F0B]', bar: '#EF9F27' },
  low:    { pill: 'bg-[#E1F5EE] text-[#0F6E56]', bar: '#1D9E75' },
}

export default function ScoreCard({ score, risk, wordCount, sourceCount, matchCount, exactCount }) {
  const riskStyle = RISK_STYLES[risk] || RISK_STYLES.medium

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col items-center text-center">
      {/* Score ring */}
      <div className="relative w-[80px] h-[80px] mb-3">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle
            className="scan-ring-track"
            cx="40" cy="40" r="32"
            style={{ stroke: '#e5e7eb', strokeWidth: 8, fill: 'none' }}
          />
          <circle
            className="scan-ring-fill"
            cx="40" cy="40" r="32"
            style={{
              stroke: riskStyle.bar,
              strokeWidth: 8,
              fill: 'none',
              strokeDasharray: 201,
              strokeDashoffset: 201 * (1 - score / 100),
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[18px] font-semibold" style={{ color: riskStyle.bar }}>{score}</span>
        </div>
      </div>

      {/* Risk badge */}
      <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full font-mono mb-3 ${riskStyle.pill}`}>
        {risk.toUpperCase()}
      </span>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wide">Words</p>
          <p className="text-[13px] font-medium text-gray-900">{wordCount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wide">Sources</p>
          <p className="text-[13px] font-medium text-gray-900">{sourceCount}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wide">Matches</p>
          <p className="text-[13px] font-medium text-gray-900">{matchCount}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wide">Exact</p>
          <p className="text-[13px] font-medium text-gray-900">{exactCount}</p>
        </div>
      </div>
    </div>
  )
}
Refinement 42: Improving consistency across the module
Refinement 130: Standardizing code style and formatting
Refinement 148: Refining variable names for clarity
