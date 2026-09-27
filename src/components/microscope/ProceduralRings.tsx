import { useRef, useEffect } from 'react';
import { useExperiment } from '../../stores/experimentStore';

interface ProceduralRingsProps {
  width?: number;
  height?: number;
}

export function ProceduralRings({ width = 400, height = 400 }: ProceduralRingsProps) {
  const { state } = useExperiment();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const lambdaNm = state.settings.wavelength;
  const R = state.settings.radiusOfCurvature;
  const isOn = state.settings.lampOn;
  const positionMm = state.instrument.trueMicroscopePosition;
  const focus = state.instrument.focus;
  
  // The viewfinder represents a physical area in the focal plane.
  // We'll show an area of 10mm x 10mm.
  const viewSizeMm = 10; 
  const centerReferenceMm = 25.0; // The true center of the rings
  const offsetMm = positionMm - centerReferenceMm;
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!isOn) {
      // Lamp is off, draw pitch black
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);
      return;
    }

    // Generate the interference pattern pixel by pixel
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    const lambdaM = lambdaNm * 1e-9;
    const rM = R;

    const cx = width / 2;
    const cy = height / 2;
    
    // Scale: physical meters per canvas pixel
    const metersPerPixel = (viewSizeMm / 1000) / width;

    // To add a bit of realism, we'll use a sodium-yellow base color
    // RGB: 255, 215, 0 
    const baseR = 255;
    const baseG = 215;
    const baseB = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Physical distance from center in meters
        // If microscope moves +offsetMm (right), the rings appear to shift left (-offset)
        const dx = (x - cx) * metersPerPixel + (offsetMm / 1000);
        const dy = (y - cy) * metersPerPixel;
        const rSq = dx * dx + dy * dy;

        // Intensity of Newton's rings (reflected):
        // Dark center: phase = pi * r^2 / (lambda * R)
        // Intensity = I0 * sin^2(phase)
        const phase = (Math.PI * rSq) / (lambdaM * rM);
        const intensity = Math.pow(Math.sin(phase), 2);

        // We map intensity 0..1 to color.
        // Even the dark bands have some ambient light, so we constrain it to 0.1 - 1.0.
        const iVal = 0.1 + 0.9 * intensity;

        const idx = (y * width + x) * 4;
        data[idx] = Math.min(255, baseR * iVal); // R
        data[idx + 1] = Math.min(255, baseG * iVal); // G
        data[idx + 2] = Math.min(255, baseB * iVal); // B
        data[idx + 3] = 255; // Alpha
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Draw a subtle central reference point (crosshair anchor)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(cx, cy, 2, 0, Math.PI * 2);
    ctx.fill();

  }, [lambdaNm, R, isOn, width, height]);

  const blurPx = Math.max(0, (1 - focus) * 8);

  return (
    <canvas 
      ref={canvasRef} 
      width={width} 
      height={height} 
      className="w-full h-full object-cover pointer-events-none transition-all duration-75"
      style={{ filter: `blur(${blurPx}px)` }}
    />
  );
}
