import { useEffect, useRef } from 'react'
import useStore from '../../store/useStore'
import PATTERNS from '../../lib/patterns'

function PatternPreview({ pattern, isSelected, onClick }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#6b7280'
    ctx.fillRect(0, 0, 60, 60)
    ctx.save()
    ctx.scale(60 / 512, 60 / 512)
    pattern.draw(ctx, canvas)
    ctx.restore()
  }, [pattern])

  return (
    <button
      onClick={onClick}
      title={pattern.label}
      className={`relative rounded-lg overflow-hidden border-2 transition-all w-14 h-14 flex-shrink-0 ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-400'
      }`}
    >
      {pattern.id === 'none' ? (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-medium">None</div>
      ) : (
        <canvas ref={canvasRef} width={60} height={60} className="w-full h-full" />
      )}
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">✓</span>
        </div>
      )}
    </button>
  )
}

export default function PatternPanel() {
  const patternId = useStore(state => state.patternId)
  const setPatternId = useStore(state => state.setPatternId)

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pattern</h3>
      <div className="flex flex-wrap gap-2">
        {PATTERNS.map(pattern => (
          <PatternPreview
            key={pattern.id}
            pattern={pattern}
            isSelected={patternId === pattern.id}
            onClick={() => setPatternId(pattern.id)}
          />
        ))}
      </div>
      {patternId !== 'none' && (
        <p className="text-xs text-gray-400">
          Pattern: <span className="text-gray-600">{PATTERNS.find(p => p.id === patternId)?.label}</span>
        </p>
      )}
    </div>
  )
}
