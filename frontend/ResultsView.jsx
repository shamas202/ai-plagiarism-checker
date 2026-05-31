import { useScanStore } from '../../store/scanStore'
import ScoreCard from './ScoreCard'
import SourceMatches from './SourceMatches'
import TextComparison from './TextComparison'

export default function ResultsView() {
  const { results, setView, startScan } = useScanStore()
  const {
    fileName, scannedAt, department,
    score, risk, wordCount, sourceCount, matchCount, exactCount,
    sources, submittedText, matchedText,
  } = results

  const handleExport = () => {
    // Wire to your backend: GET /api/scan/results/:documentId/export
    alert('Export triggered — connect to /api/scan/results/:id/export')
  }

  return (
    <div className="animate-slide-up">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          <h1 className="text-[17px] font-medium text-gray-900 font-display truncate max-w-xs">
            {fileName}
          </h1>
          <p className="text-[13px] text-gray-500 mt-0.5">
            Scanned {scannedAt} &middot; {department} Department
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setView('upload')}
            className="px-3.5 py-[7px] text-[13px] text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            ← Back
          </button>
          <button
            onClick={() => startScan(null)}
            className="px-3.5 py-[7px] text-[13px] text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
          >
            Rescan
          </button>
          <button
            onClick={handleExport}
            className="px-3.5 py-[7px] text-[13px] font-medium text-white rounded-lg transition-colors"
            style={{ background: 'var(--teal)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--teal-dark)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--teal)')}
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Score + Sources grid */}
      <div className="grid gap-4 mb-0" style={{ gridTemplateColumns: '180px 1fr' }}>
        <ScoreCard
          score={score}
          risk={risk}
          wordCount={wordCount}
          sourceCount={sourceCount}
          matchCount={matchCount}
          exactCount={exactCount}
        />

        <SourceMatches sources={sources} />
      </div>

      {/* Text comparison */}
      <TextComparison
        submittedText={submittedText}
        matchedText={matchedText}
        topSourceName={`${sources[0]?.name} (${sources[0]?.pct}%)`}
      />
    </div>
  )
}
Refinement 40: Updating documentation for future reference
Refinement 110: Improving consistency across the module
Refinement 129: Adding descriptive comments for better maintainability
Refinement 240: Refining variable names for clarity
Refinement 337: Adding internal developer notes
Refinement 391: Refining variable names for clarity
Refinement 434: Improving code documentation
