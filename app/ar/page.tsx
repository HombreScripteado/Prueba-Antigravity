"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Suspense, useEffect, useState, useRef, useCallback } from "react"
import dynamic from "next/dynamic"

// Import model-viewer dynamically to avoid SSR issues
const ModelViewerWrapper = dynamic(() => import("@/components/ar/model-viewer-wrapper"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-menu-bg">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-2 border-menu-gold border-t-transparent mx-auto" />
        <p className="font-mono text-sm tracking-widest text-menu-gold/80">CARGANDO MODELO</p>
      </div>
    </div>
  ),
})

function ARViewerContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const modelo = searchParams.get("modelo") || "default"
  const [retryCount, setRetryCount] = useState(0)
  const modelPath = `/modelos/${modelo}.glb${retryCount > 0 ? `?retry=${retryCount}` : ""}`

  const [arState, setArState] = useState<"idle" | "loading" | "active" | "error" | "denied">("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [modelLoaded, setModelLoaded] = useState(false)
  const [modelLoadProgress, setModelLoadProgress] = useState(0)
  const internalViewerRef = useRef<HTMLElement | null>(null)
  const arTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const simulatedProgressRef = useRef<NodeJS.Timeout | null>(null)

  const handleBackToMenu = useCallback(() => {
    router.push("/comidas")
  }, [router])

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      if (arTimeoutRef.current) {
        clearTimeout(arTimeoutRef.current)
      }
      if (simulatedProgressRef.current) {
        clearInterval(simulatedProgressRef.current)
      }
    }
  }, [])

  // Timer para carga del modelo 3D (7 segundos)
  useEffect(() => {
    if (modelLoaded || arState === "error" || arState === "denied") {
      return
    }

    const timer = setTimeout(() => {
      if (!modelLoaded) {
        setArState("error")
        setErrorMessage("Tiempo de espera agotado al cargar el modelo 3D. Verifica tu conexión o intenta de nuevo.")
      }
    }, 7000)

    return () => clearTimeout(timer)
  }, [modelLoaded, arState, retryCount])

  // Simulated progress: increment from 0 to 90% automatically, model load event completes to 100%
  useEffect(() => {
    if (modelLoaded || arState === "error" || arState === "denied") {
      // Model already loaded or error occurred, clear interval
      if (simulatedProgressRef.current) {
        clearInterval(simulatedProgressRef.current)
      }
      return
    }

    // Start simulated progress
    simulatedProgressRef.current = setInterval(() => {
      setModelLoadProgress((prev) => {
        if (prev >= 90) {
          // Stop at 90%, wait for actual load event
          return 90
        }
        // Increment by random amount (3-8%) for natural feel
        const increment = Math.random() * 5 + 3
        return Math.min(prev + increment, 90)
      })
    }, 300)

    return () => {
      if (simulatedProgressRef.current) {
        clearInterval(simulatedProgressRef.current)
      }
    }
  }, [modelLoaded, arState, retryCount])

  const handleActivateAR = useCallback(async () => {
    if (!internalViewerRef.current || !modelLoaded) return

    setArState("loading")
    setErrorMessage("")

    // Set 5-second timeout for AR initialization
    arTimeoutRef.current = setTimeout(() => {
      if (arState === "loading") {
        setArState("error")
        setErrorMessage("Hubo un problema al iniciar la cámara. Inténtalo de nuevo.")
      }
    }, 5000)

    try {
      // @ts-expect-error model-viewer methods
      await internalViewerRef.current.activateAR()
    } catch {
      if (arTimeoutRef.current) {
        clearTimeout(arTimeoutRef.current)
      }
      setArState("error")
      setErrorMessage("No se pudo iniciar la experiencia AR. Verifica que tu dispositivo sea compatible.")
    }
  }, [modelLoaded, arState])

  const handleRetryPermission = useCallback(async () => {
    setArState("idle")
    setErrorMessage("")

    if (!modelLoaded) {
      // Es un error de carga del modelo, reiniciamos progreso e intentamos recargar
      setModelLoadProgress(0)
      setRetryCount((prev) => prev + 1)
      return
    }

    // Small delay before retrying AR
    setTimeout(() => {
      handleActivateAR()
    }, 500)
  }, [handleActivateAR, modelLoaded])

  const handleARStatus = useCallback((event: CustomEvent) => {
    const status = event.detail.status

    // Clear timeout when AR actually starts
    if (arTimeoutRef.current) {
      clearTimeout(arTimeoutRef.current)
      arTimeoutRef.current = null
    }

    if (status === "session-started") {
      setArState("active")
    } else if (status === "not-presenting") {
      setArState("idle")
    } else if (status === "failed") {
      setArState("error")
      setErrorMessage("Hubo un problema al iniciar la cámara. Inténtalo de nuevo.")
    }
  }, [arState])

  const handleARError = useCallback((event: CustomEvent) => {
    const error = event.detail

    // Clear timeout on error
    if (arTimeoutRef.current) {
      clearTimeout(arTimeoutRef.current)
      arTimeoutRef.current = null
    }

    // Check if it's a camera permission error
    if (error?.message?.includes("camera") || error?.message?.includes("permission") || error?.message?.includes("NotAllowedError")) {
      setArState("denied")
      setErrorMessage("Para ver el plato en tu mesa, necesitamos acceso a la cámara.")
    } else if (error?.message?.includes("not supported") || error?.message?.includes("WebXR")) {
      setArState("error")
      setErrorMessage("Tu dispositivo no soporta experiencias de Realidad Aumentada.")
    } else {
      setArState("error")
      setErrorMessage("Ocurrió un error al cargar la experiencia AR. Por favor, intenta nuevamente.")
    }
  }, [])

  // Handle model load event - completes the simulated progress
  const handleModelLoad = useCallback(() => {
    if (simulatedProgressRef.current) {
      clearInterval(simulatedProgressRef.current)
    }
    setModelLoadProgress(100)
    setModelLoaded(true)
  }, [])

  // EL ARREGLO: Callback Ref limpio, directo en la raíz del componente
  const modelViewerRef = useCallback((node: HTMLElement | null) => {
    if (node !== null) {
      // Conectamos los eventos apenas el nodo aparece en pantalla
      node.addEventListener("ar-status", handleARStatus as EventListener)
      node.addEventListener("error", handleARError as EventListener)
      node.addEventListener("load", handleModelLoad as EventListener)
      // Guardamos la referencia interna para poder usar el botón de abrir cámara
      internalViewerRef.current = node
    }
  }, [handleARStatus, handleARError, handleModelLoad])

  return (
    <div className="relative h-screen w-full overflow-hidden bg-menu-bg">
      {/* Model Viewer - always rendered (never hidden) to allow asset download */}
      <ModelViewerWrapper
        ref={modelViewerRef}
        src={modelPath}
        arModes="webxr scene-viewer quick-look"
        arPlacement="floor"
        arScale="auto"
        cameraControls={false}
        autoRotate={false}
        className="h-full w-full absolute inset-0"
      >
        {/* Custom AR UI Overlay */}
        <div slot="ar-ui" className="absolute inset-0 pointer-events-auto">
          {/* Back button - top left */}
          <button
            onClick={handleBackToMenu}
            className="absolute left-4 top-4 z-50 flex items-center gap-2 rounded-full bg-menu-bg/80 backdrop-blur-sm px-4 py-2 text-menu-cream border border-menu-gold/30 transition-all hover:bg-menu-bg hover:border-menu-gold"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-mono text-xs tracking-wider">VOLVER</span>
          </button>

          {/* Promo text - bottom center */}
          <div className="absolute bottom-8 left-0 right-0 z-50 text-center px-4">
            <p className="font-mono text-xs tracking-wide text-menu-cream/50 bg-menu-bg/40 backdrop-blur-sm inline-block px-4 py-2 rounded-full">
              {"Si querés armar tu propio menú en AR entrá a "}
              <span className="text-menu-gold/70">www.menu-ar-ejemplo.com</span>
            </p>
          </div>
        </div>
      </ModelViewerWrapper>

      {/* Initial UI - shown when AR is not active */}
      {arState !== "active" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-menu-bg z-40">
          {/* Decorative corners */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-4 top-4 h-16 w-16 border-l border-t border-menu-gold/40" />
            <div className="absolute right-4 top-4 h-16 w-16 border-r border-t border-menu-gold/40" />
            <div className="absolute bottom-4 left-4 h-16 w-16 border-b border-l border-menu-gold/40" />
            <div className="absolute bottom-4 right-4 h-16 w-16 border-b border-r border-menu-gold/40" />
          </div>

          {/* Back button */}
          <button
            onClick={handleBackToMenu}
            className="absolute left-6 top-6 flex items-center gap-2 text-menu-gold/80 transition-colors hover:text-menu-gold"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-mono text-xs tracking-wider">VOLVER</span>
          </button>

          {/* Main content */}
          <div className="flex flex-col items-center px-6 text-center">
            {/* AR Icon */}
            <div className="mb-8">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-menu-gold/20" style={{ animationDuration: "2s" }} />
                <div className="relative rounded-full border border-menu-gold/40 p-6">
                  <svg className="h-16 w-16 text-menu-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Model name */}
            <h1 className="mb-2 font-serif text-3xl font-light tracking-wide text-menu-cream capitalize">
              {modelo.replace(/-/g, " ")}
            </h1>
            <div className="mb-8 h-px w-24 bg-gradient-to-r from-transparent via-menu-gold to-transparent" />

            {/* Loading progress indicator */}
            {!modelLoaded && (
              <div className="mb-6 w-48">
                <div className="h-1 w-full bg-menu-gold/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-menu-gold transition-all duration-300 rounded-full"
                    style={{ width: `${Math.round(modelLoadProgress)}%` }}
                  />
                </div>
                <p className="mt-2 font-mono text-xs tracking-wide text-menu-cream/50">
                  Cargando plato... {Math.round(modelLoadProgress)}%
                </p>
              </div>
            )}

            {/* Error State - Camera Denied */}
            {arState === "denied" && (
              <div className="mb-8 max-w-sm">
                <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                  <p className="font-serif text-lg text-menu-cream">{errorMessage}</p>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleRetryPermission}
                    className="w-full rounded-sm border border-menu-gold bg-menu-gold px-8 py-4 font-mono text-sm tracking-widest text-menu-bg transition-all hover:bg-menu-gold-light"
                  >
                    CONCEDER ACCESO / REINTENTAR
                  </button>
                  <button
                    onClick={handleBackToMenu}
                    className="w-full rounded-sm border border-menu-gold/50 bg-transparent px-8 py-4 font-mono text-sm tracking-widest text-menu-gold transition-all hover:border-menu-gold hover:bg-menu-gold/10"
                  >
                    VOLVER A LA CARTA
                  </button>
                </div>
              </div>
            )}

            {/* Error State - General Error (including timeout) */}
            {arState === "error" && (
              <div className="mb-8 max-w-sm">
                <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                  <p className="font-serif text-lg text-menu-cream">{errorMessage}</p>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleRetryPermission}
                    className="w-full rounded-sm border border-menu-gold bg-menu-gold px-8 py-4 font-mono text-sm tracking-widest text-menu-bg transition-all hover:bg-menu-gold-light"
                  >
                    REINTENTAR
                  </button>
                  <button
                    onClick={handleBackToMenu}
                    className="w-full rounded-sm border border-menu-gold/50 bg-transparent px-8 py-4 font-mono text-sm tracking-widest text-menu-gold transition-all hover:border-menu-gold hover:bg-menu-gold/10"
                  >
                    VOLVER A LA CARTA
                  </button>
                </div>
              </div>
            )}

            {/* Idle State - Main CTA */}
            {(arState === "idle" || arState === "loading") && (
              <>
                <button
                  onClick={handleActivateAR}
                  disabled={arState === "loading" || !modelLoaded}
                  className="group relative mb-6 overflow-hidden rounded-sm border border-menu-gold bg-transparent px-10 py-5 font-mono text-sm tracking-widest text-menu-gold transition-all hover:bg-menu-gold hover:text-menu-bg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-menu-gold"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {!modelLoaded ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        CARGANDO PLATO...
                      </>
                    ) : arState === "loading" ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        INICIANDO AR...
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        TOCAR PARA POSICIONAR EN LA MESA
                      </>
                    )}
                  </span>
                </button>

                <p className="max-w-xs font-mono text-xs tracking-wide text-menu-cream/40">
                  Apunta la cámara hacia una superficie plana como una mesa
                </p>
              </>
            )}
          </div>

          {/* Promo footer */}
          <div className="absolute bottom-8 left-0 right-0 text-center px-4">
            <p className="font-mono text-xs tracking-wide text-menu-cream/30">
              {"Si querés armar tu propio menú en AR entrá a "}
              <span className="text-menu-gold/50">www.menu-ar-ejemplo.com</span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ARPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-menu-bg">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-2 border-menu-gold border-t-transparent mx-auto" />
            <p className="font-mono text-sm tracking-widest text-menu-gold/80">CARGANDO</p>
          </div>
        </div>
      }
    >
      <ARViewerContent />
    </Suspense>
  )
}
