'use client';

import { useEffect, useRef } from 'react';

interface ModelViewerProps {
  modelPath: string;
}

export default function ModelViewer({ modelPath }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Importar model-viewer dinámicamente
    import('@google/model-viewer').catch(() => {
      console.warn('Failed to load model-viewer');
    });
  }, []);

  return (
    <div ref={containerRef} className="w-full h-80 bg-slate-50 rounded-lg overflow-hidden">
      <model-viewer
        src={modelPath}
        alt="Modelo 3D del plato"
        auto-rotate
        camera-controls
        style={{
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
}
