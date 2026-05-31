import { useScanStore } from '../store/scanStore'

const NAV = [
  {
    id: 'upload',
    label: 'New Scan',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="2" y="2" width="11" height="11" rx="1.5" />
        <line x1="5" y1="7.5" x2="10" y2="7.5" />
        <line x1="7.5" y1="5" x2="7.5" y2="10" />
      </svg>
    ),
  },
  {
    id: 'results',
    label: 'Scan History',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="2" y="2" width="11" height="11" rx="1.5" />
        <line x1="4.5" y1="5.5" x2="10.5" y2="5.5" />
        <line x1="4.5" y1="8"   x2="8.5"  y2="8"   />
        <line x1="4.5" y1="10.5" x2="7"  y2="10.5" />
      </svg>
    ),
  },
  {
    id: null,
    label: 'Reports',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="7.5" cy="7.5" r="5" />
        <circle cx="7.5" cy="7.5" r="1.8" />
      </svg>
    ),
  },
  {
    id: null,
    label: 'Departments',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M2 11V9L7.5 3.5 12 8 6.5 13.5Z" />
        <line x1="10" y1="5.5" x2="13" y2="2.5" />
      </svg>
    ),
  },
  {
    id: null,
    label: 'Users',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="7.5" cy="5.5" r="2.2" />
        <path d="M2.5 13c0-2.8 2.2-5 5-5s5 2.2 5 5" />
      </svg>
    ),
  },
  {
    id: null,
    label: 'Settings',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="7.5" cy="7.5" r="2" />
        <path d="M7.5 1.5v1.2M7.5 12.3v1.2M1.5 7.5h1.2M12.3 7.5h1.2M3.4 3.4l.85.85M10.75 10.75l.85.85M3.4 11.6l.85-.85M10.75 4.25l.85-.85" />
      </svg>
    ),
  },
]

export default function Sidebar() {
  const { view, setView, startScan } = useScanStore()

  const handleNav = (id) => {
    if (!id) return
    if (id === 'upload') setView('upload')
    else setView(id)
  }

  return (
    <aside className="w-[196px] min-h-screen bg-white border-r border-gray-100 flex flex-col py-5 px-3.5 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 pb-4 mb-1.5 border-b border-gray-100">
        <div
          className="w-[26px] h-[26px] rounded-[6px] flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--teal)' }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle cx="6.5" cy="6.5" r="4.2" stroke="white" strokeWidth="1.4" />
            <circle cx="6.5" cy="6.5" r="1.4" fill="white" />
            <line x1="6.5" y1="1" x2="6.5" y2="2.3" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="11" y1="6.5" x2="12.3" y2="6.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </div>
        <span className="text-[14px] font-medium text-gray-900 tracking-tight font-display">
          PlagScan AI
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-0.5 mt-1.5">
        {NAV.map(({ id, label, icon }) => {
          const isActive = id && view === id
          return (
            <button
              key={label}
              onClick={() => handleNav(id)}
              disabled={!id}
              className={[
                'flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] transition-all duration-150 text-left w-full',
                isActive
                  ? 'text-[#0F6E56] font-medium'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50',
                !id && 'opacity-40 cursor-default',
              ].join(' ')}
              style={isActive ? { background: 'var(--teal-light)' } : {}}
            >
              <span className={isActive ? 'opacity-100' : 'opacity-60'}>{icon}</span>
              {label}
            </button>
          )
        })}
      </nav>

      {/* Bottom: dept + user */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        <p className="text-[10px] text-gray-400 px-2.5 pb-2 uppercase tracking-widest font-medium">
          Academic Integrity
        </p>
        <div className="flex items-center gap-2 px-2.5 py-1.5">
          <div
            className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[10px] font-medium flex-shrink-0"
            style={{ background: 'var(--teal-light)', color: 'var(--teal-dark)' }}
          >
            AH
          </div>
          <div>
            <p className="text-[13px] font-medium text-gray-900 leading-none">Ali Hassan</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Analyst · RBAC</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
Refinement 12: Adding internal developer notes
Refinement 70: Adding descriptive comments for better maintainability
Refinement 120: Cleaning up whitespace and indentations
Refinement 165: Adding descriptive comments for better maintainability
Refinement 220: Standardizing code style and formatting
Refinement 257: Optimizing logic in small sections
Refinement 285: Standardizing code style and formatting
Refinement 355: Standardizing code style and formatting
Refinement 392: Standardizing code style and formatting
Refinement 402: Updating documentation for future reference
Refinement 427: Standardizing code style and formatting
