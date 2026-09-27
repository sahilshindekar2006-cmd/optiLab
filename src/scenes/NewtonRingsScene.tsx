
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Box, Cylinder, Sphere } from '@react-three/drei';
import { useExperiment } from '../stores/experimentStore';

function OpticalBench() {
  return (
    <Box args={[10, 0.5, 3]} position={[0, -0.25, 0]}>
      <meshStandardMaterial color="#334155" />
    </Box>
  );
}

function SodiumLamp({ isOn }: { isOn: boolean }) {
  return (
    <group position={[-4, 1.5, 0]}>
      <Box args={[1.5, 3, 1.5]}>
        <meshStandardMaterial color="#475569" />
      </Box>
      <Box args={[0.8, 1, 0.8]} position={[1, 0, 0]}>
        <meshStandardMaterial 
          color={isOn ? "#fde047" : "#451a03"} 
          emissive={isOn ? "#fbbf24" : "#000000"} 
          emissiveIntensity={isOn ? 2 : 0} 
        />
      </Box>
      <Html position={[0, 2.5, 0]} center className="pointer-events-none">
        <div className="bg-black/70 text-slate-200 text-xs px-2 py-1 rounded whitespace-nowrap">
          Sodium Lamp
        </div>
      </Html>
    </group>
  );
}

function Condenser({ positionOffset }: { positionOffset: number }) {
  // Translate condenser position 0..1 to an actual local offset -0.5..0.5
  const offset = (positionOffset - 0.5) * 1.0; 
  return (
    <group position={[-2 + offset, 1.5, 0]}>
      <Cylinder args={[0.1, 0.1, 1.5]} position={[0, -0.75, 0]}>
        <meshStandardMaterial color="#94a3b8" />
      </Cylinder>
      <Cylinder args={[0.8, 0.8, 0.2]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <meshPhysicalMaterial color="#bae6fd" transmission={0.9} opacity={1} transparent roughness={0.1} />
      </Cylinder>
      <Html position={[0, 1.5, 0]} center className="pointer-events-none">
        <div className="bg-black/70 text-slate-200 text-xs px-2 py-1 rounded whitespace-nowrap mt-4">
          Condenser
        </div>
      </Html>
    </group>
  );
}

function GlassPlate45() {
  return (
    <group position={[0, 1.5, 0]}>
      <Box args={[1.5, 0.05, 1.5]} rotation={[0, 0, Math.PI / 4]}>
        <meshPhysicalMaterial color="#e0f2fe" transmission={0.95} opacity={1} transparent roughness={0.05} />
      </Box>
      <Html position={[0, 1.2, 0]} center className="pointer-events-none">
        <div className="bg-black/70 text-slate-200 text-xs px-2 py-1 rounded whitespace-nowrap mt-4">
          45° Plate
        </div>
      </Html>
    </group>
  );
}

function LensAssembly() {
  return (
    <group position={[0, 0.5, 0]}>
      <Box args={[2, 0.1, 2]}>
        <meshPhysicalMaterial color="#e0f2fe" transmission={0.9} opacity={1} transparent roughness={0.1} />
      </Box>
      <Sphere args={[1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} position={[0, 0.05, 0]} scale={[1, 0.15, 1]}>
        <meshPhysicalMaterial color="#e0f2fe" transmission={0.9} opacity={1} transparent roughness={0.1} />
      </Sphere>
      <Html position={[1.5, 0.5, 1.5]} center className="pointer-events-none">
        <div className="bg-black/70 text-slate-200 text-xs px-2 py-1 rounded whitespace-nowrap">
          Lens Assembly
        </div>
      </Html>
    </group>
  );
}

function TravellingMicroscope() {
  return (
    <group position={[0, 4, 0]}>
      <Box args={[3, 0.2, 1]} position={[0, -2, -1.5]}>
        <meshStandardMaterial color="#cbd5e1" />
      </Box>
      <Cylinder args={[0.2, 0.2, 3]} position={[0, -1, -1.5]}>
        <meshStandardMaterial color="#cbd5e1" />
      </Cylinder>
      <Cylinder args={[0.3, 0.3, 2.5]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1e293b" />
      </Cylinder>
      <Cylinder args={[0.2, 0.2, 0.5]} position={[0, 1.3, 0]}>
        <meshStandardMaterial color="#334155" />
      </Cylinder>
      <Cylinder args={[0.15, 0.2, 0.5]} position={[0, -1.3, 0]}>
        <meshStandardMaterial color="#94a3b8" />
      </Cylinder>
      <Box args={[0.4, 0.4, 1.5]} position={[0, 0, -0.75]}>
        <meshStandardMaterial color="#475569" />
      </Box>
      <Html position={[0, 2, 0]} center className="pointer-events-none">
        <div className="bg-black/70 text-slate-200 text-xs px-2 py-1 rounded whitespace-nowrap">
          Microscope
        </div>
      </Html>
    </group>
  );
}

function ExplanatoryLightPath({ isOn, condenserPosition }: { isOn: boolean, condenserPosition: number }) {
  if (!isOn) return null;
  
  // Condenser modifies the beam thickness visually to demonstrate its purpose
  const beamThickness = 0.3 + (condenserPosition * 0.4);

  return (
    <group>
      {/* Horizontal beam from lamp to 45 degree plate */}
      <Cylinder args={[beamThickness, beamThickness, 3]} position={[-1.5, 1.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshBasicMaterial color="#fef08a" transparent opacity={0.4} depthWrite={false} />
      </Cylinder>
      
      {/* Reflected beam downwards to lens assembly */}
      <Cylinder args={[beamThickness, beamThickness, 1]} position={[0, 1.0, 0]} rotation={[0, 0, 0]}>
        <meshBasicMaterial color="#fef08a" transparent opacity={0.4} depthWrite={false} />
      </Cylinder>

      <Html position={[-1.5, 2.2, 0]} center className="pointer-events-none">
        <div className="text-amber-300 text-[10px] uppercase font-bold tracking-widest opacity-80 whitespace-nowrap">
          Explanatory Light Path
        </div>
      </Html>
    </group>
  );
}

export function NewtonRingsScene() {
  const { state } = useExperiment();
  const isOn = state.settings.lampOn;
  const condenserPosition = state.instrument.condenserPosition;

  return (
    <Canvas
      camera={{ position: [0, 5, 8], fov: 50 }}
      className="w-full h-full"
    >
      <color attach="background" args={['#0f172a']} />
      <ambientLight intensity={0.5} />
      {/* Main room light */}
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Point light for the sodium lamp when on */}
      {isOn && <pointLight position={[-3, 1.5, 0]} color="#fbbf24" intensity={2} distance={10} />}

      <OrbitControls 
        enablePan={false} 
        minDistance={5} 
        maxDistance={15} 
        maxPolarAngle={Math.PI / 2 - 0.1}
      />

      <group position={[0, -1, 0]}>
        <OpticalBench />
        <SodiumLamp isOn={isOn} />
        <Condenser positionOffset={condenserPosition} />
        <GlassPlate45 />
        <LensAssembly />
        <TravellingMicroscope />
        <ExplanatoryLightPath isOn={isOn} condenserPosition={condenserPosition} />
      </group>
    </Canvas>
  );
}
