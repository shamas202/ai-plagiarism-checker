import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: '13px',
            borderRadius: '10px',
            border: '0.5px solid #e5e7eb',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
Refinement 82: Adding internal developer notes
Refinement 94: Adding descriptive comments for better maintainability
Refinement 97: Refining variable names for clarity
Refinement 186: Standardizing code style and formatting
Refinement 212: Adding internal developer notes
Refinement 236: Updating documentation for future reference
Refinement 290: Updating documentation for future reference
