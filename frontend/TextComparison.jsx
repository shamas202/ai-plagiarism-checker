/**
 * TextComparison — side-by-side with {{highlighted}} passage syntax
 * Text uses {{...}} to mark matched segments
 */

function parseHighlights(text) {
  // Splits text on {{...}} markers and returns React elements
  const parts = text.split(/\{\{(.*?)\}\}/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark
        key={i}
        style={{ background: '#F5C4B3', borderRadius: '2px', padding: '1px 0', color: 'inherit' }}
      >
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

export default function TextComparison({ submittedText, matchedText, topSourceName }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-medium text-gray-900">Text Comparison</h3>
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 text-[11px] text-gray-400"
          >
            <span
              className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ background: '#F5C4B3' }}
            />
            Matched passage
          </span>
        </div>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-2.5">
            Submitted document
          </p>
          <p className="text-[12.5px] leading-[1.9] text-gray-700">
            {parseHighlights(submittedText)}
          </p>
        </div>

        <div>
          <p
            className="text-[10px] font-medium uppercase tracking-widest mb-2.5"
            style={{ color: '#993C1D' }}
          >
            {topSourceName}
          </p>
          <p className="text-[12.5px] leading-[1.9] text-gray-700">
            {parseHighlights(matchedText)}
          </p>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-[11px] text-gray-400 mt-4 pt-3.5 border-t border-gray-50">
        Showing top matched source. View full report to explore all {' '}
        <button className="underline underline-offset-2 hover:text-gray-600 transition-colors">
          12 sources
        </button>
        .
      </p>
    </div>
  )
}
Refinement 61: Updating documentation for future reference
Refinement 93: Adding internal developer notes
