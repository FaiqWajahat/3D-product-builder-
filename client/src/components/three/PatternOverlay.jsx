import { useMemo } from 'react'
import * as THREE from 'three'
import useStore from '../../store/useStore'
import PATTERNS from '../../lib/patterns'

// These planes are in world space (model is ~2 units tall, centred at origin)
const OVERLAY_POSITIONS = [
  { pos: [0,     0,    0.20], args: [1.0, 1.6] },  // body front
  { pos: [-0.75, 0.1,  0.16], args: [0.4, 0.8] }, // left sleeve
  { pos: [0.75,  0.1,  0.16], args: [0.4, 0.8] }, // right sleeve
]

export default function PatternOverlay() {
  const patternId = useStore(state => state.patternId)

  const texture = useMemo(() => {
    const pattern = PATTERNS.find(p => p.id === patternId)
    if (!pattern || patternId === 'none') return null

    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    pattern.draw(ctx, canvas)

    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
  }, [patternId])

  if (!texture) return null

  return (
    <group>
      {OVERLAY_POSITIONS.map(({ pos, args }, i) => (
        <mesh key={i} position={pos}>
          <planeGeometry args={args} />
          <meshBasicMaterial
            map={texture}
            transparent={true}
            depthWrite={false}
            opacity={1}
          />
        </mesh>
      ))}
    </group>
  )
}
