import { create } from 'zustand'

const mockSources = [
  { id: 1, name: 'Wikipedia', url: 'wikipedia.org', pct: 18, matches: 12 },
  { id: 2, name: 'Journal Article', url: 'doi.org/10.xxxx', pct: 12, matches: 5 },
  { id: 3, name: 'Course Hero', url: 'coursehero.com', pct: 8, matches: 3 },
]

const mockSubmittedText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`

const mockMatchedText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`

export const useScanStore = create((set, get) => ({
  // Navigation
  view: 'upload',
  setView: (view) => set({ view }),

  // URL input
  urlInput: '',
  setUrlInput: (urlInput) => set({ urlInput }),

  // Current file being scanned
  currentFile: null,

  // Scan progress
  scanProgress: 0,
  scanStepIndex: 0,
  scanSteps: [
    'Uploading document...',
    'Extracting text...',
    'Generating embeddings...',
    'Searching database...',
    'Analyzing stylometry...',
    'Finalizing report...',
  ],

  tickScan: () => {
    const { scanProgress, scanStepIndex, scanSteps } = get()
    const newProgress = scanProgress + 2

    const newStepIndex = Math.min(
      Math.floor((newProgress / 100) * scanSteps.length),
      scanSteps.length - 1,
    )

    if (newProgress >= 100) {
      set({
        scanProgress: 100,
        scanStepIndex: newStepIndex,
        view: 'results',
      })
      return true
    }

    set({ scanProgress: newProgress, scanStepIndex: newStepIndex })
    return false
  },

  // Start scan
  startScan: (file) => {
    set({
      currentFile: file,
      scanProgress: 0,
      scanStepIndex: 0,
      view: 'scan',
    })
  },

  // Results
  results: {
    fileName: 'Research Paper Draft.pdf',
    scannedAt: '2 mins ago',
    department: 'Computer Science',
    score: 24,
    risk: 'medium',
    wordCount: 3420,
    sourceCount: 12,
    matchCount: 47,
    exactCount: 8,
    sources: mockSources,
    submittedText: mockSubmittedText,
    matchedText: mockMatchedText,
  },

  // Recent scans
  recentScans: [
    {
      id: 1,
      name: 'Research Paper Draft.pdf',
      scannedAt: '2 mins ago',
      words: 3420,
      score: 24,
      risk: 'medium',
    },
    {
      id: 2,
      name: 'Essay Final.docx',
      scannedAt: '1 hour ago',
      words: 1850,
      score: 8,
      risk: 'low',
    },
    {
      id: 3,
      name: 'Thesis Chapter 3.pdf',
      scannedAt: '3 hours ago',
      words: 5200,
      score: 42,
      risk: 'high',
    },
  ],
}))
# Refinement 21: Adding internal developer notes
# Refinement 37: Improving code documentation
# Refinement 68: Standardizing code style and formatting
# Refinement 76: Improving consistency across the module
# Refinement 105: Updating documentation for future reference
# Refinement 203: Standardizing code style and formatting
# Refinement 206: Improving consistency across the module
# Refinement 324: Adding internal developer notes
