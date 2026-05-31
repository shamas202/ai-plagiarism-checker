import { useEffect, useRef } from 'react'
import { useScanStore } from '../store/scanStore'

export default function ScanProgress() {
  const { scanProgress, scanStepIndex, scanSteps, tickScan, setView, currentFile } = useScanStore()
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      const done = tickScan()
      if (done) clearInterval(timerRef.current)
    }, 50)
    return () => clearInterval(timerRef.current)
  }, [])

  const pct = Math.round(scanProgress)

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] animate-fade-in">
      {/* Animated ring */}
      <div className="relative w-[110px] h-[110px] mb-6">
        <svg width="110" height="110" viewBox="0 0 110 110">
          <circle className="scan-ring-track" cx="55" cy="55" r="42" />
          <circle className="scan-ring-fill"  cx="55" cy="55" r="42" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[19px] font-medium text-gray-900 font-mono">{pct}%</span>
        </div>
      </div>

      {/* Status text */}
      <h2 className="text-[15px] font-medium text-gray-900 mb-1.5">Analyzing document…</h2>
      <p className="text-[13px] text-gray-500 mb-1">
        {currentFile ? currentFile.name : 'Processing URL'}
      </p>
      <p className="text-[12px] text-gray-400">{scanSteps[scanStepIndex]}</p>

      {/* Step list */}
      <div className="mt-7 w-full max-w-[300px] flex flex-col gap-0.5">
        {scanSteps.map((step, i) => {
          const isDone   = i < scanStepIndex
          const isActive = i === scanStepIndex
          return (
            <div
              key={step}
              className={[
                'flex items-center gap-3 py-1.5 px-2 rounded-lg text-[13px] transition-colors duration-300',
                isDone   ? 'text-gray-800' : '',
                isActive ? 'text-[#1D9E75] bg-[#E1F5EE]/50' : '',
                !isDone && !isActive ? 'text-gray-300' : '',
              ].join(' ')}
            >
              <span
                className={[
                  'w-[7px] h-[7px] rounded-full flex-shrink-0 transition-all duration-300',
                  isDone   ? 'bg-[#1D9E75]' : '',
                  isActive ? 'bg-[#1D9E75] animate-pulse-dot' : '',
                  !isDone && !isActive ? 'bg-gray-200' : '',
                ].join(' ')}
              />
              {step}
              {isDone && (
                <svg
                  className="ml-auto flex-shrink-0"
                  width="12" height="12" viewBox="0 0 12 12"
                  fill="none" stroke="#1D9E75" strokeWidth="1.6" strokeLinecap="round"
                >
                  <polyline points="2,6 5,9 10,3" />
                </svg>
              )}
            </div>
          )
        })}
      </div>

      {/* Cancel */}
      <button
        onClick={() => setView('upload')}
        className="mt-8 text-[13px] text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
      >
        Cancel scan
      </button>
    </div>
  )
}
Refinement 8: Improving consistency across the module
Refinement 67: Refining variable names for clarity
Refinement 227: Cleaning up whitespace and indentations
Refinement 242: Improving code documentation
Refinement 305: Adding internal developer notes
Refinement 320: Improving consistency across the module
Refinement 333: Adding internal developer notes
