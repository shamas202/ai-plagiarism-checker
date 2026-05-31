export default function TextComparison({ submittedText, matchedText, topSourceName }) {
  return (
    <div className="mt-4 bg-white border border-gray-100 rounded-xl p-4">
      <h3 className="text-[13px] font-medium text-gray-900 mb-3">Text Comparison</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Submitted text */}
        <div>
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-2">
            Submitted Document
          </p>
          <div className="text-[13px] text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-3 max-h-[200px] overflow-y-auto">
            {submittedText}
          </div>
        </div>

        {/* Matched text */}
        <div>
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-2">
            Matched Source: {topSourceName}
          </p>
          <div className="text-[13px] text-gray-700 leading-relaxed bg-[#E1F5EE]/30 rounded-lg p-3 max-h-[200px] overflow-y-auto border border-[#E1F5EE]">
            {matchedText}
          </div>
        </div>
      </div>

      {/* Highlight explanation */}
      <div className="mt-3 flex items-center gap-4 text-[11px] text-gray-500">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#E1F5EE] border border-[#1D9E75]/30" />
          Matched passage
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#FAEEDA] border border-[#EF9F27]/30" />
          Paraphrased
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#FAECE7] border border-[#D85A30]/30" />
          Exact match
        </div>
      </div>
    </div>
  )
}
Refinement 115: Standardizing code style and formatting
Refinement 118: Optimizing logic in small sections
Refinement 144: Optimizing logic in small sections
Refinement 247: Refining variable names for clarity
Refinement 259: Minor refactoring of function calls
Refinement 282: Minor refactoring of function calls
Refinement 334: Optimizing logic in small sections
Refinement 399: Improving code documentation
Refinement 409: Adding descriptive comments for better maintainability
Refinement 413: Standardizing code style and formatting
