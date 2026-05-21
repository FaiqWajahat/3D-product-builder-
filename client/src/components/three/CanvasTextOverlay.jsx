/* eslint-disable react-hooks/refs */
import { useState, useEffect, useRef, useMemo } from 'react'
import * as THREE from 'three'
import { createPortal } from '@react-three/fiber'
import { Decal } from '@react-three/drei'
import useStore from '../../store/useStore'

// Model-specific placement configurations
const GET_PLACEMENT_POSITIONS = (category) => {
  if (category === 'cap') {
    return {
      chest:  { pos: [-0.25, 0.15,  0.00], rot: [0, -Math.PI / 2, 0], size: [0.5, 0.5, 1.0] },
      back:   { pos: [ 0.55, 0.10,  0.00], rot: [0,  Math.PI / 2, 0], size: [0.5, 0.5, 1.0] },
      sleeve: { pos: [ 0.00, 0.10,  0.50], rot: [0,            0, 0], size: [0.5, 0.5, 1.0] },
    }
  }
  if (category === 'pants' || category === 't-shirt' || category === 'tshirt') {
    // t-shirt contains a T-shirt shape
    return {
      chest:  { pos: [0.00,  0.15,  0.70], rot: [0,       0, 0], size: [0.6, 0.6, 1.0] },
      back:   { pos: [0.00,  0.10, -0.80], rot: [0, Math.PI, 0], size: [0.7, 0.7, 1.0] },
      sleeve: { pos: [0.80,  0.10,  0.02], rot: [0, Math.PI / 2, 0], size: [0.4, 0.4, 1.0] },
    }
  }
  // default / jersey
  return {
    chest:  { pos: [0.00,  0.15,  0.24], rot: [0,       0, 0], size: [0.85, 0.85, 1.0] },
    back:   { pos: [0.00,  0.10, -0.27], rot: [0, Math.PI, 0], size: [1.00, 1.00, 1.0] },
    sleeve: { pos: [0.88,  0.10,  0.02], rot: [0, Math.PI / 2, 0], size: [0.38, 0.55, 1.0] },
  }
}

// Build a canvas with text drawn on it (synchronous — no images)
function drawTextOnCanvas(ctx, size, textConfig) {
  if (textConfig.teamName) {
    const fontSize = Math.min(textConfig.fontSize * 2, 120)
    ctx.font = `bold ${fontSize}px ${textConfig.font}`
    ctx.fillStyle = textConfig.color
    ctx.strokeStyle = 'rgba(0,0,0,0.55)'
    ctx.lineWidth = 5
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const y = textConfig.playerNumber ? size * 0.32 : size * 0.5
    ctx.strokeText(textConfig.teamName.toUpperCase(), size / 2, y)
    ctx.fillText(textConfig.teamName.toUpperCase(), size / 2, y)
  }

  if (textConfig.playerNumber) {
    const numSize = Math.min(textConfig.fontSize * 3, 180)
    ctx.font = `bold ${numSize}px ${textConfig.font}`
    ctx.fillStyle = textConfig.color
    ctx.strokeStyle = 'rgba(0,0,0,0.55)'
    ctx.lineWidth = 7
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const y = textConfig.teamName ? size * 0.68 : size * 0.5
    ctx.strokeText(textConfig.playerNumber, size / 2, y)
    ctx.fillText(textConfig.playerNumber, size / 2, y)
  }
}

// Helper: dispose a Three.js texture safely
function disposeTexture(tex) {
  if (tex) tex.dispose()
}

// Helper: convert world to local space based on target mesh
function useLocalTransform(targetMesh, placementKey, category) {
  return useMemo(() => {
    if (!targetMesh) return null
    const placements = GET_PLACEMENT_POSITIONS(category)
    const placement = placements[placementKey] || placements.chest
    
    // Force world matrix calculation to get accurate position and orientation transformations
    targetMesh.updateMatrixWorld(true)
    
    // Convert world position to local position of the targetMesh
    const worldPos = new THREE.Vector3(...placement.pos)
    const localPos = targetMesh.worldToLocal(worldPos.clone())
    
    // Scale size by inverse of world scale to maintain visual size
    const worldScale = new THREE.Vector3()
    targetMesh.getWorldScale(worldScale)
    
    // Convert world rotation of the projector to local rotation of the targetMesh
    const q_world = new THREE.Quaternion().setFromEuler(new THREE.Euler(...placement.rot))
    const q_parent = new THREE.Quaternion()
    targetMesh.getWorldQuaternion(q_parent)
    const q_local = q_parent.clone().invert().multiply(q_world)
    const localRot = new THREE.Euler().setFromQuaternion(q_local)
    
    return {
      position: [localPos.x, localPos.y, localPos.z],
      rotation: [localRot.x, localRot.y, localRot.z],
      scale: [
        placement.size[0] / worldScale.x,
        placement.size[1] / worldScale.y,
        placement.size[2] / worldScale.z
      ]
    }
  }, [targetMesh, placementKey, category])
}

// ─── Text overlay (chest / back / sleeve based on textConfig.placement) ───────
export function TextOverlay({ targetMesh }) {
  const textConfig = useStore(state => state.textConfig)
  const selectedProduct = useStore(state => state.selectedProduct)
  const category = selectedProduct?.category || 'jersey'
  const texRef = useRef(null)

  const texture = useMemo(() => {
    if (texRef.current) {
      texRef.current.dispose()
      texRef.current = null
    }

    const hasText = textConfig.teamName || textConfig.playerNumber
    if (!hasText) return null

    const SIZE = 512
    const canvas = document.createElement('canvas')
    canvas.width = SIZE
    canvas.height = SIZE
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, SIZE, SIZE)

    drawTextOnCanvas(ctx, SIZE, textConfig)

    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    texRef.current = tex
    return tex
  }, [textConfig])

  // Dispose on unmount
  useEffect(() => {
    return () => {
      if (texRef.current) {
        texRef.current.dispose()
      }
    }
  }, [])

  const transform = useLocalTransform(targetMesh, textConfig.placement, category)
  
  if (!texture || !targetMesh || !transform) return null

  return createPortal(
    <Decal position={transform.position} rotation={transform.rotation} scale={transform.scale}>
      <meshBasicMaterial
        map={texture}
        transparent={true}
        depthTest={true}
        depthWrite={false}
        polygonOffset={true}
        polygonOffsetFactor={-10}
        opacity={0.97}
      />
    </Decal>,
    targetMesh
  )
}

// ─── Logo overlay (uses its own logoPlacement state) ──────────────────────────
export function LogoOverlay({ targetMesh }) {
  const logoUrl       = useStore(state => state.logoUrl)
  const logoPlacement = useStore(state => state.logoPlacement)
  const selectedProduct = useStore(state => state.selectedProduct)
  const category = selectedProduct?.category || 'jersey'
  const texRef = useRef(null)
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    if (!logoUrl) {
      disposeTexture(texRef.current)
      texRef.current = null
      Promise.resolve().then(() => {
        setTexture(null)
      })
      return
    }

    const SIZE = 512
    const img = new Image()
    img.crossOrigin = 'anonymous' // prevent tainted canvas for cross-origin images

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = SIZE
      canvas.height = SIZE
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, SIZE, SIZE)

      // Center the logo with padding, maintaining aspect ratio
      const aspect = img.width / img.height
      let drawW, drawH
      if (aspect >= 1) {
        drawW = SIZE * 0.85
        drawH = drawW / aspect
      } else {
        drawH = SIZE * 0.85
        drawW = drawH * aspect
      }
      const x = (SIZE - drawW) / 2
      const y = (SIZE - drawH) / 2
      ctx.drawImage(img, x, y, drawW, drawH)

      const tex = new THREE.CanvasTexture(canvas)
      tex.needsUpdate = true

      disposeTexture(texRef.current)
      texRef.current = tex
      setTexture(tex)
    }

    img.onerror = () => {
      console.warn('CanvasTextOverlay: failed to load logo image')
    }

    img.src = logoUrl // triggers async load
  }, [logoUrl])

  // Dispose on unmount
  useEffect(() => () => disposeTexture(texRef.current), [])

  const transform = useLocalTransform(targetMesh, logoPlacement, category)
  
  if (!texture || !targetMesh || !transform) return null

  return createPortal(
    <Decal position={transform.position} rotation={transform.rotation} scale={transform.scale}>
      <meshBasicMaterial
        map={texture}
        transparent={true}
        depthTest={true}
        depthWrite={false}
        polygonOffset={true}
        polygonOffsetFactor={-10}
        opacity={0.97}
      />
    </Decal>,
    targetMesh
  )
}

// ─── Default export: both overlays together ───────────────────────────────────
export default function CanvasTextOverlay({ meshes }) {
  if (!meshes || meshes.length === 0) return null;
  
  return (
    <>
      {meshes.map((mesh) => (
        <TextOverlay key={`text-${mesh.uuid}`} targetMesh={mesh} />
      ))}
      {meshes.map((mesh) => (
        <LogoOverlay key={`logo-${mesh.uuid}`} targetMesh={mesh} />
      ))}
    </>
  )
}
