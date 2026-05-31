import Sidebar from '../components/Sidebar'
import UploadZone from '../components/UploadZone'
import ScanProgress from '../components/ScanProgress'
import ResultsView from '../components/Results/ResultsView'
import { useScanStore } from '../store/scanStore'

export default function Dashboard() {
  const { view } = useScanStore()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[12px] text-gray-400">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-gray-700 font-medium capitalize">{view === 'upload' ? 'New Scan' : view === 'scan' ? 'Scanning' : 'Results'}</span>
          </div>
          <div className="flex items-center gap-3">
            {/* API status indicator */}
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] animate-pulse" />
              AI Engine Online
            </div>
            {/* Notifications */}
            <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#9ca3af" strokeWidth="1.4">
                <path d="M7 1.5A4 4 0 0 0 3 5.5v2L2 9h10l-1-1.5V5.5A4 4 0 0 0 7 1.5Z" />
                <line x1="5.8" y1="11" x2="8.2" y2="11" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="px-6 py-5 max-w-4xl">
          {view === 'upload'  && <UploadZone />}
          {view === 'scan'    && <ScanProgress />}
          {view === 'results' && <ResultsView />}
        </div>
      </main>
    </div>
  )
}
Refinement 80: Adding descriptive comments for better maintainability
Refinement 87: Refining variable names for clarity
