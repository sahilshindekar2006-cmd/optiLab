
import { Header } from './components/ui/Header';
import { LaboratoryWorkspace } from './components/laboratory/LaboratoryWorkspace';
import { ControlsPanel } from './components/laboratory/ControlsPanel';
import { MicroscopePanel } from './components/microscope/MicroscopePanel';
import { MeasurementsPanel } from './components/measurements/MeasurementsPanel';
import { TutorialOverlay } from './components/laboratory/TutorialOverlay';
import { PartnerOverlay } from './components/laboratory/PartnerOverlay';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col text-slate-300 font-sans h-screen overflow-hidden">
      <Header />
      
      {/* Main Layout Grid */}
      <main className="flex-1 p-4 grid grid-cols-12 gap-4 overflow-hidden">
        
        {/* Left Column: 3D Bench and Controls */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4 h-full">
          <div className="flex-1 min-h-[300px]">
            <LaboratoryWorkspace />
          </div>
          <div className="h-auto">
            <ControlsPanel />
          </div>
        </div>

        {/* Middle Column: Microscope Viewfinder */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3 h-full">
          <MicroscopePanel />
        </div>

        {/* Right Column: Measurements and Results */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3 h-full">
          <MeasurementsPanel />
        </div>

      </main>

      <TutorialOverlay />
      <PartnerOverlay />
    </div>
  );
}

export default App;
