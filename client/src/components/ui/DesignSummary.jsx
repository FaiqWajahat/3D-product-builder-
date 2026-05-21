import useStore from '../../store/useStore'

function SummaryRow({ label, value, extra }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400">{label}</span>
      <div className="flex items-center gap-1.5">
        {extra}
        <span className="text-xs text-gray-700 font-medium text-right max-w-[7rem] truncate">{value}</span>
      </div>
    </div>
  )
}

function Swatch({ color }) {
  return <div className="w-3.5 h-3.5 rounded-full border border-gray-200 flex-shrink-0" style={{ backgroundColor: color }} />
}

export default function DesignSummary({ onSave, onQuote, onLoadDesign }) {
  const { selectedProduct, colorZones, textConfig, logoUrl, patternId, designName, setDesignName } = useStore()

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <label className="text-xs text-gray-400 block mb-1">Design name</label>
        <input
          type="text"
          value={designName}
          onChange={e => setDesignName(e.target.value)}
          placeholder="Untitled Design"
          maxLength={40}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Summary</p>

        <div className="bg-gray-50 rounded-xl p-3">
          <SummaryRow label="Product" value={selectedProduct?.name || '—'} />
          <SummaryRow label="Category" value={selectedProduct?.category || '—'} />
        </div>

        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-400 mb-1">Colors</p>
          {Object.entries(colorZones).map(([zone, color]) => (
            <SummaryRow key={zone} label={zone.charAt(0).toUpperCase() + zone.slice(1)} value={color.toUpperCase()} extra={<Swatch color={color} />} />
          ))}
        </div>

        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-400 mb-1">Text</p>
          <SummaryRow label="Team name" value={textConfig.teamName || 'None'} />
          <SummaryRow label="Number" value={textConfig.playerNumber || 'None'} />
          <SummaryRow label="Font" value={textConfig.font} />
          <SummaryRow label="Placement" value={textConfig.placement} />
        </div>

        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-400 mb-1">Extras</p>
          <SummaryRow
            label="Logo"
            value={logoUrl ? '✓ Uploaded' : 'None'}
            extra={logoUrl ? <img src={logoUrl} alt="logo" className="w-5 h-5 rounded object-contain border border-gray-200" /> : null}
          />
          <SummaryRow label="Pattern" value={!patternId || patternId === 'none' ? 'None' : patternId} />
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-3 border-t border-gray-100 mt-3">
        <div className="flex gap-2">
          <button onClick={onLoadDesign} className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            Load
          </button>
          <button onClick={onSave} className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            Save
          </button>
        </div>
        <button onClick={onQuote} className="w-full py-2.5 px-4 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
          Submit quote →
        </button>
      </div>
    </div>
  )
}
