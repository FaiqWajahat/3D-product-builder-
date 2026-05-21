import { useMemo, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import useStore from '../../store/useStore'
import PatternOverlay from './PatternOverlay'

/**
 * Maps a material name or node name to its color zone.
 */
function getMaterialZone(matName = '', objName = '', parentName = '') {
  const m = matName.toLowerCase()
  const o = objName.toLowerCase()
  const p = parentName.toLowerCase()

  // 1. Cap checks (M04 = brim, M02 = button, others = body)
  if (o.includes('m04') || p.includes('m04')) return 'brim'
  if (o.includes('m02') || p.includes('m02')) return 'button'
  if (o.includes('m01') || o.includes('m03') || o.includes('m05') || o.includes('m06') || o.includes('m07') ||
      p.includes('m01') || p.includes('m03') || p.includes('m05') || p.includes('m06') || p.includes('m07')) {
    return 'body'
  }

  // 2. Pants checks (outside = body, inside/label = waistband, neck = piping)
  if (m.includes('outside')) return 'body'
  if (m.includes('inside') || m.includes('label')) return 'waistband'
  if (m.includes('neck') || m.includes('piping')) return 'piping'

  // 3. Jersey checks (btn_fabric = body, copy = sleeves, rib/collar/neck = collar)
  if (m.includes('btn_fabric')) return 'body'
  if (m.includes('copy')) return 'sleeves'
  if (m.includes('rib') || m.includes('collar') || m.includes('neck')) return 'collar'

  // Default fallback
  return 'body'
}

export default function GarmentModel({ modelPath, onMeshesFound }) {
  const { scene } = useGLTF(modelPath)
  const colorZones = useStore(state => state.colorZones)

  // Track which material UUIDs have already been cloned so that shared
  // materials are cached correctly.
  // Key format: `${meshUUID}-${originalMaterialUUID}`
  const clonedMaterials = useRef(new Map())

  // Compute scale + centering offset BEFORE first render
  const { scale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

    const maxDim = Math.max(size.x, size.y, size.z)
    if (maxDim === 0) return { scale: 1, offset: new THREE.Vector3() }

    const targetSize = 2.0
    const s = targetSize / maxDim
    return {
      scale: s,
      offset: new THREE.Vector3(-center.x, -center.y, -center.z),
    }
  }, [scene])

  // Collect all meshes in the scene and notify parent
  useEffect(() => {
    const meshes = []
    scene.traverse((obj) => {
      if (obj.isMesh) {
        meshes.push(obj)
      }
    })
    if (onMeshesFound) {
      onMeshesFound(meshes)
    }
  }, [scene, onMeshesFound])

  // Apply zone colours whenever colorZones or scene changes
  useEffect(() => {
    const cloneMap = clonedMaterials.current

    scene.traverse((obj) => {
      if (!obj.isMesh) return

      // Handle both single material and material arrays
      const applyToMaterial = (originalMat) => {
        const cacheKey = `${obj.uuid}-${originalMat.uuid}`
        let mat
        if (cloneMap.has(cacheKey)) {
          mat = cloneMap.get(cacheKey)
        } else {
          mat = originalMat.clone()
          cloneMap.set(cacheKey, mat)
        }
        const zone = getMaterialZone(mat.name, obj.name, obj.parent?.name)
        const targetColor = colorZones[zone]
        if (targetColor) {
          mat.color.set(targetColor)
          mat.needsUpdate = true
        }
        return mat
      }

      if (Array.isArray(obj.material)) {
        obj.material = obj.material.map(applyToMaterial)
      } else {
        obj.material = applyToMaterial(obj.material)
      }
    })
  }, [scene, colorZones])

  return (
    <group scale={scale} position={[offset.x * scale, offset.y * scale, offset.z * scale]}>
      <primitive object={scene} />
      <PatternOverlay />
    </group>
  )
}

useGLTF.preload('/models/jersey.glb')
useGLTF.preload('/models/cap.glb')
useGLTF.preload('/models/pants.glb')
