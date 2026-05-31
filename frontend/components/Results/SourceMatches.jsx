export default function SourceMatches({ sources }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <h3 className="text-[13px] font-medium text-gray-900 mb-3">Top Sources</h3>

      <div className="flex flex-col gap-2.5">
        {sources.map((source) => (
          <div key={source.id} className="flex items-center gap-3">
            {/* Source icon */}
            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#9ca3af" strokeWidth="1.2">
                <rect x="2" y="2" width="10" height="10" rx="1.5" />
                <line x1="4.5" y1="5.5" x2="9.5" y2="5.5" />
                <line x1="4.5" y1="8" x2="8" y2="8" />
              </svg>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-gray-900 truncate">{source.name}</p>
              <p className="text-[11px] text-gray-400 truncate">{source.url} · {source.matches} matches</p>
            </div>

            {/* Percentage */}
            <span className="text-[12px] font-mono font-medium text-gray-700 w-10 text-right">
              {source.pct}%
            </span>
          </div>
        ))}
      </div>

      {/* View all link */}
      <button className="mt-3 text-[12px] text-[#1D9E75] hover:text-[#0F6E56] transition-colors font-medium">
        View all 12 sources →
      </button>
    </div>
  )
}
Refinement 72: Optimizing logic in small sections
Refinement 74: Minor refactoring of function calls
