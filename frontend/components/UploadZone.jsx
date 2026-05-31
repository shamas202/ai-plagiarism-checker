import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useScanStore } from '../store/scanStore'

const RISK_STYLES = {
  high:   { pill: 'bg-[#FAECE7] text-[#993C1D]', dot: '#D85A30', icon: '#D85A30' },
  medium: { pill: 'bg-[#FAEEDA] text-[#854F0B]', dot: '#EF9F27', icon: '#EF9F27' },
  low:    { pill: 'bg-[#E1F5EE] text-[#0F6E56]', dot: '#1D9E75', icon: '#1D9E75' },
}

function FileIcon({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4">
      <rect x="3" y="1" width="10" height="14" rx="1.5" />
      <line x1="5.5" y1="6"  x2="10.5" y2="6"  />
      <line x1="5.5" y1="8.5" x2="9"  y2="8.5" />
      <line x1="5.5" y1="11" x2="8"   y2="11"  />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg
      width="46" height="46" viewBox="0 0 46 46" fill="none"
      stroke="#d1d5db" strokeWidth="1.3"
      className="mx-auto mb-3"
    >
      <rect x="8" y="5" width="30" height="34" rx="3" />
      <line x1="14" y1="17" x2="32" y2="17" />
      <line x1="14" y1="22" x2="27" y2="22" />
      <line x1="14" y1="27" x2="22" y2="27" />
      <circle cx="33" cy="33" r="9" fill="white" stroke="#d1d5db" />
      <line x1="30" y1="33" x2="36" y2="33" />
      <line x1="33" y1="30" x2="33" y2="36" />
    </svg>
  )
}

export default function UploadZone() {
  const { startScan, recentScans, urlInput, setUrlInput, setView } = useScanStore()
  const [dragging, setDragging] = useState(false)

  const onDrop = useCallback(
    (files) => {
      if (files.length) startScan(files[0])
      setDragging(false)
    },
    [startScan],
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setDragging(true),
    onDragLeave: () => setDragging(false),
    accept: {
      'application/pdf':  ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain':       ['.txt'],
      'text/html':        ['.html'],
    },
    maxSize: 50 * 1024 * 1024,
  })

  return (
    <div className="animate-slide-up">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-[17px] font-medium text-gray-900 font-display">New Scan</h1>
        <p className="text-[13px] text-gray-500 mt-1">
          Upload a document or paste a URL to check for plagiarism
        </p>
      </div>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={[
          'border-[1.5px] border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 mb-5',
          dragging
            ? 'border-[#1D9E75] bg-[#E1F5EE]/40'
            : 'border-gray-200 bg-white hover:border-[#1D9E75] hover:bg-[#E1F5EE]/20',
        ].join(' ')}
      >
        <input {...getInputProps()} />
        <UploadIcon />
        <p className="text-[14px] font-medium text-gray-800 mb-1">
          {dragging ? 'Drop to scan' : 'Drop your document here'}
        </p>
        <p className="text-[13px] text-gray-500">or click to browse</p>
        <p className="text-[11px] text-gray-400 mt-2">
          PDF · DOCX · TXT · HTML &mdash; up to 50 MB
        </p>
      </div>

      {/* URL row */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="#9ca3af" strokeWidth="1.3">
              <path d="M5.2 8.8A3.4 3.4 0 1 0 7.8 4.2m-2.6 4.6L7.8 6m0 0A3.4 3.4 0 1 0 5.2 2.2" />
            </svg>
          </div>
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/article"
            className="w-full pl-8 pr-3 py-[8px] text-[13px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75]/20 transition-all"
          />
        </div>
        <button
          onClick={() => startScan(null)}
          className="px-4 py-[8px] text-[13px] font-medium text-white rounded-lg transition-colors flex-shrink-0"
          style={{ background: 'var(--teal)' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--teal-dark)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--teal)')}
        >
          Scan URL
        </button>
      </div>

      {/* Recent scans */}
      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-2.5">
        Recent Scans
      </p>

      <div className="flex flex-col gap-2">
        {recentScans.map((scan) => {
          const rs = RISK_STYLES[scan.risk]
          return (
            <button
              key={scan.id}
              onClick={() => setView('results')}
              className="flex items-center gap-3 px-3 py-2.5 bg-white border border-gray-100 rounded-xl text-left hover:border-gray-200 hover:shadow-sm transition-all duration-150 w-full"
            >
              <div
                className="w-[30px] h-[30px] rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: rs.pill.includes('E1F5EE') ? '#E1F5EE' : rs.pill.includes('FAEEDA') ? '#FAEEDA' : '#FAECE7' }}
              >
                <FileIcon color={rs.icon} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-gray-900 truncate">{scan.name}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Scanned {scan.scannedAt} &middot; {scan.words.toLocaleString()} words
                </p>
              </div>
              <span
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full font-mono flex-shrink-0 ${rs.pill}`}
              >
                {scan.score}%
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
Refinement 4: Standardizing code style and formatting
Refinement 30: Cleaning up whitespace and indentations
Refinement 142: Updating documentation for future reference
Refinement 166: Improving consistency across the module
Refinement 190: Cleaning up whitespace and indentations
Refinement 400: Improving code documentation
Refinement 67: Improving consistency across the module
Refinement 102: Refining variable names for clarity
Refinement 153: Minor refactoring of function calls
