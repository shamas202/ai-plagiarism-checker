/**
 * SourceMatches — ranked list of plagiarism sources with bar visualisation
 */
export default function SourceMatches({ sources }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <h3 className="text-[13px] font-medium text-gray-900 mb-3.5">Matched Sources</h3>

      <div className="flex flex-col">
        {sources.map((src, i) => (
          <div
            key={src.url}
            className="py-2.5 border-b border-gray-50 last:border-0 last:pb-0"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center justify-between mb-1 gap-2">
              <span className="text-[12px] text-gray-800 truncate">{src.name}</span>
              <span
                className="text-[11px] font-medium font-mono flex-shrink-0"
                style={{ color: src.color }}
              >
                {src.pct}%
              </span>
            </div>
            <p className="text-[10px] text-gray-400 mb-2 truncate">{src.url}</p>
            <div className="h-[3px] bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-[3px] rounded-full bar-fill"
                style={{ width: `${src.pct}%`, background: src.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
