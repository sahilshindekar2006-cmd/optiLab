import { Suspense, Component, ReactNode } from 'react';
import { NewtonRingsScene } from '../../scenes/NewtonRingsScene';

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<{children: ReactNode}, ErrorBoundaryState> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-900 p-8 text-center h-full">
          <p className="text-xl mb-4 text-slate-300 font-semibold text-red-400">WebGL Error</p>
          <p className="text-sm">Sorry, the 3D optical bench could not be loaded. Please ensure WebGL is enabled in your browser.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export function LaboratoryWorkspace() {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 h-full flex flex-col overflow-hidden shadow-lg relative">
      <div className="absolute top-0 left-0 right-0 px-4 py-3 border-b border-slate-700 bg-slate-800/80 backdrop-blur-sm z-10">
        <h2 className="font-semibold text-slate-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Optical Bench (3D View)
        </h2>
      </div>
      <div className="flex-1 relative bg-slate-900">
        <ErrorBoundary>
          <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center text-slate-500">Loading 3D Scene...</div>}>
            <NewtonRingsScene />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
