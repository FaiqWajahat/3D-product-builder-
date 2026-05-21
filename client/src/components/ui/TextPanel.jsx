import useStore from '../../store/useStore'

const FONTS = ['Arial', 'Impact', 'Georgia', 'Courier New']
const PLACEMENTS = ['chest', 'back', 'sleeve']

export default function TextPanel() {
  const textConfig = useStore(state => state.textConfig)
  const setTextConfig = useStore(state => state.setTextConfig)

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Text</h3>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Team name</label>
        <input
          type="text"
          maxLength={20}
          placeholder="e.g. EAGLES"
          value={textConfig.teamName}
          onChange={e => setTextConfig({ teamName: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Player number</label>
        <input
          type="text"
          maxLength={3}
          placeholder="e.g. 23"
          value={textConfig.playerNumber}
          onChange={e => setTextConfig({ playerNumber: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Font</label>
        <select
          value={textConfig.font}
          onChange={e => setTextConfig({ font: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
        >
          {FONTS.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Size — <span className="font-medium">{textConfig.fontSize}px</span></label>
        <input
          type="range" min={24} max={96} step={4}
          value={textConfig.fontSize}
          onChange={e => setTextConfig({ fontSize: Number(e.target.value) })}
          className="w-full accent-blue-600"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="text-xs text-gray-500">Text color</label>
        <input
          type="color"
          value={textConfig.color}
          onChange={e => setTextConfig({ color: e.target.value })}
          className="w-8 h-8 cursor-pointer rounded border-0 bg-transparent"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Placement</label>
        <div className="flex gap-2">
          {PLACEMENTS.map(p => (
            <button
              key={p}
              onClick={() => setTextConfig({ placement: p })}
              className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${
                textConfig.placement === p
                  ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {(textConfig.teamName || textConfig.playerNumber) && (
        <div className="mt-1 p-3 bg-gray-50 rounded-lg text-center border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">Preview</p>
          <p style={{ fontFamily: textConfig.font, color: textConfig.color, fontSize: '18px', fontWeight: 'bold' }}>
            {textConfig.teamName && <span className="block">{textConfig.teamName.toUpperCase()}</span>}
            {textConfig.playerNumber && <span className="block text-3xl">{textConfig.playerNumber}</span>}
          </p>
        </div>
      )}
    </div>
  )
}
