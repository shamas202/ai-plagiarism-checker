import { create } from 'zustand'

const RECENT_SCANS = [
  {
    id: '1',
    name: 'research_paper_final.pdf',
    words: 4820,
    score: 78,
    risk: 'high',
    scannedAt: '2 hours ago',
    sources: 12,
    matches: 37,
  },
  {
    id: '2',
    name: 'quarterly_report_q1.docx',
    words: 2100,
    score: 34,
    risk: 'medium',
    scannedAt: 'Yesterday',
    sources: 5,
    matches: 11,
  },
  {
    id: '3',
    name: 'employee_handbook_v3.pdf',
    words: 8740,
    score: 12,
    risk: 'low',
    scannedAt: '3 days ago',
    sources: 2,
    matches: 4,
  },
]

const SCAN_STEPS = [
  'Extracting text content',
  'NLP preprocessing',
  'Semantic similarity analysis',
  'Cross-referencing 40M+ sources',
  'Generating report',
]

export const useScanStore = create((set, get) => ({
  // Navigation
  view: 'upload', // 'upload' | 'scan' | 'results'
  setView: (view) => set({ view }),

  // Upload
  recentScans: RECENT_SCANS,
  urlInput: '',
  setUrlInput: (v) => set({ urlInput: v }),

  // Active scan
  currentFile: null,
  scanProgress: 0,
  scanStepIndex: 0,
  scanSteps: SCAN_STEPS,

  startScan: (file = null) => {
    set({ view: 'scan', currentFile: file, scanProgress: 0, scanStepIndex: 0 })
  },

  tickScan: () => {
    const { scanProgress, scanStepIndex, scanSteps } = get()
    const next = Math.min(scanProgress + 1.6, 100)
    const nextStep = Math.min(Math.floor(next / 20), scanSteps.length - 1)
    set({ scanProgress: next, scanStepIndex: nextStep })
    if (next >= 100) {
      setTimeout(() => set({ view: 'results' }), 600)
      return true // signal done
    }
    return false
  },

  // Results (static demo data — replace with API response)
  results: {
    fileName: 'research_paper_final.pdf',
    scannedAt: '2 hours ago',
    department: 'Academic Integrity',
    score: 78,
    risk: 'high',
    wordCount: 4820,
    sourceCount: 12,
    matchCount: 37,
    exactCount: 3,
    sources: [
      { name: 'Wikipedia — Quantum Entanglement', url: 'en.wikipedia.org/wiki/Quantum_entanglement', pct: 42, color: '#D85A30' },
      { name: 'Physical Review Letters, 2023',    url: 'journals.aps.org/prl/abstract/10.1103/...',  pct: 21, color: '#EF9F27' },
      { name: 'arXiv — Bell Inequality Tests',    url: 'arxiv.org/abs/2301.14567',                  pct:  9, color: '#EF9F27' },
      { name: 'Nature Physics — Quantum Networks',url: 'nature.com/articles/s41567-023-...',         pct:  4, color: '#1D9E75' },
      { name: 'Springer — Quantum Cryptography',  url: 'link.springer.com/book/9783030...',          pct:  2, color: '#5DCAA5' },
    ],
    submittedText: `Quantum entanglement is a phenomenon in quantum mechanics where {{two or more particles become correlated in such a way that the quantum state of each particle cannot be described independently of the others}}, even when separated by large distances. Einstein famously referred to this as {{"spooky action at a distance."}} This nonlocal correlation has been verified through Bell inequality tests. {{Measuring one particle instantaneously affects the measurement outcomes of the other particles.}}`,
    matchedText: `Quantum entanglement is the phenomenon where {{two or more particles become correlated in such a way that the quantum state of each particle cannot be described independently of the others}}, even when separated by a large distance. The term {{"spooky action at a distance"}} was coined by Einstein to criticize this phenomenon. {{Measuring one particle instantaneously affects the measurement outcomes of the other particles.}}`,
  },
}))
