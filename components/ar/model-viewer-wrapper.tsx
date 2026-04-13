"use client"

import { forwardRef, useEffect, useState, type ReactNode } from "react"

// Extend JSX types for model-viewer
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string
          alt?: string
          ar?: boolean
          "ar-modes"?: string
          "ar-placement"?: string
          "ar-scale"?: string
          "camera-controls"?: boolean
          "auto-rotate"?: boolean
          "shadow-intensity"?: string
          exposure?: string
          poster?: string
          loading?: "auto" | "lazy" | "eager"
          reveal?: "auto" | "manual"
          "xr-environment"?: boolean
          "environment-image"?: string
        },
        HTMLElement
      >
    }
  }
}

interface ModelViewerWrapperProps {
  src: string
  arModes?: string
  arPlacement?: string
  arScale?: string
  cameraControls?: boolean
  autoRotate?: boolean
  className?: string
  children?: ReactNode
}

const ModelViewerWrapper = forwardRef<HTMLElement, ModelViewerWrapperProps>(
  (
    {
      src,
      arModes = "webxr scene-viewer quick-look",
      arPlacement = "floor",
      arScale = "auto",
      cameraControls = false,
      autoRotate = false,
      className = "",
      children,
    },
    ref
  ) => {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
      // Suppress expected WebXR permission errors in iframe environments
      const originalConsoleError = console.error
      console.error = (...args) => {
        const message = args[0]?.toString?.() || ""
        // Suppress known non-critical warnings from model-viewer
        if (
          message.includes("Lit is in dev mode") ||
          message.includes("xr") ||
          message.includes("WebXR") ||
          message.includes("ar-mode") ||
          message.includes("scheduled an update")
        ) {
          return // Suppress these expected warnings
        }
        originalConsoleError.apply(console, args)
      }

      // Dynamically import model-viewer only on client
      const loadModelViewer = async () => {
        try {
          await import("@google/model-viewer")
          setIsLoaded(true)
        } catch (error) {
          // Only log if it's a real error, not permission-related
          if (!String(error).includes("xr")) {
            originalConsoleError("[v0] Failed to load model-viewer:", error)
          }
        }
      }
      loadModelViewer()

      // Restore original console.error on cleanup
      return () => {
        console.error = originalConsoleError
      }
    }, [])

    if (!isLoaded) {
      return (
        <div className={`flex items-center justify-center bg-menu-bg ${className}`}>
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-2 border-menu-gold border-t-transparent mx-auto" />
            <p className="font-mono text-sm tracking-widest text-menu-gold/80">PREPARANDO VISOR</p>
          </div>
        </div>
      )
    }

    return (
      <model-viewer
        ref={ref as React.RefObject<HTMLElement>}
        src={src}
        ar
        ar-modes={arModes}
        ar-placement={arPlacement}
        ar-scale={arScale}
        camera-controls={cameraControls}
        auto-rotate={autoRotate}
        shadow-intensity="1"
        exposure="1"
        loading="eager"
        xr-environment
        className={className}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#0a0a0a",
        }}
      >
        {children}
      </model-viewer>
    )
  }
)

ModelViewerWrapper.displayName = "ModelViewerWrapper"

export default ModelViewerWrapper
