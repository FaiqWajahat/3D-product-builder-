import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'

function FallbackBox() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#cccccc" wireframe />
    </mesh>
  )
}

export default function Scene({ children }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ preserveDrawingBuffer: true }}
      shadows
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.6} />
      <pointLight position={[0, 5, 3]} intensity={0.5} />
      <Environment preset="city" />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={0.5}
        maxDistance={15}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 1.8}
      />
      <Suspense fallback={<FallbackBox />}>
        {children}
      </Suspense>
    </Canvas>
  )
}
