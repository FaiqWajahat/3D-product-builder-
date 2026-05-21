import { Suspense, useState } from 'react'
import Scene from './Scene'
import GarmentModel from './GarmentModel'
import CanvasTextOverlay from './CanvasTextOverlay'
import useStore from '../../store/useStore'

function ModelWithOverlays({ modelPath }) {
  const [meshes, setMeshes] = useState([])
  
  return (
    <>
      <GarmentModel modelPath={modelPath} onMeshesFound={setMeshes} />
      {meshes.length > 0 && <CanvasTextOverlay meshes={meshes} />}
    </>
  )
}

export default function ModelViewer() {
  const selectedProduct = useStore(state => state.selectedProduct)
  const modelPath = selectedProduct?.modelFilePath || '/models/jersey.glb'

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Scene>
        <Suspense fallback={null}>
          <ModelWithOverlays
            key={modelPath}
            modelPath={modelPath}
          />
        </Suspense>
      </Scene>
    </div>
  )
}
