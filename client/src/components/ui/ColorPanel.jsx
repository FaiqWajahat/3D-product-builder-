import useStore from '../../store/useStore'

export default function ColorPanel() {
  const colorZones = useStore(state => state.colorZones)
  const setColorZone = useStore(state => state.setColorZone)

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Colors</h3>
      {Object.entries(colorZones).map(([zone, color], index) => (
        <div key={zone} className="flex items-center justify-between">
          <label className="text-sm text-gray-700">
            Area {index + 1}
          </label>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full border border-gray-300"
              style={{ backgroundColor: color }}
            />
            <input
              type="color"
              value={color}
              onChange={e => setColorZone(zone, e.target.value)}
              className="w-8 h-8 cursor-pointer rounded border-0 bg-transparent"
            />
          </div>
        </div>
      ))}
    </div>
  )
}
