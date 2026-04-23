"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Suspense, useEffect, useState, useRef, useCallback } from "react"
import dynamic from "next/dynamic"
import { getARModelSignedUrl, recordARView, recordARError } from "@/app/actions/ar"

// Import model-viewer dynamically to avoid SSR issues
const ModelViewerWrapper = dynamic(() => import("@/components/ar/model-viewer-wrapper"), {
  ssr: false,
  loading: () => null, // Dejaremos que ARViewerContent maneje la UI de carga principal
})

import { EnvironmentalMapping } from "@/components/ar/environmental-mapping"

function ARViewerContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get("id")
  const menuName = searchParams.get("name") || "Plato"
  const returnTo = searchParams.get("returnTo")
  const [retryCount, setRetryCount] = useState(0)


  const [modelPath, setModelPath] = useState<string>("")
  const [urlStatus, setUrlStatus] = useState<"fetching" | "success" | "error">("fetching")

  const [arState, setArState] = useState<"idle" | "loading" | "active" | "error" | "denied">("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [modelLoaded, setModelLoaded] = useState(false)
  const [modelLoadProgress, setModelLoadProgress] = useState(0)
  const internalViewerRef = useRef<HTMLElement | null>(null)
  const arTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const simulatedProgressRef = useRef<NodeJS.Timeout | null>(null)
  const sessionStartTimeRef = useRef<number | null>(null)

  const handleBackToMenu = useCallback(() => {
    if (returnTo) {
      router.push(`/${returnTo}`)
    } else {
      router.push("/")
    }
  }, [router, returnTo])



  // Fetch Signed URL from Supabase backend
  useEffect(() => {
    if (!id) {
       setUrlStatus("error")
       setArState("error")
       return
    }
    
    let isMounted = true
    
    async function fetchUrl() {
      setUrlStatus("fetching")
      try {
        const result = await getARModelSignedUrl(id as string)
        if (!isMounted) return
        
        if (result.success) {
          // Appending retry cache bust for subsequent fetches
          setModelPath(result.url + (retryCount > 0 ? `&retry=${retryCount}` : ""))
          setUrlStatus("success")
        } else {
          // Error logged to Supabase inside action
           setUrlStatus("error")
           setArState("error")
        }
      } catch (error) {
        if (!isMounted) return
        console.error("Critical error invoking Server Action:", error)
        setUrlStatus("error")
        setArState("error")
        setErrorMessage("Lamentamos que este plato no está disponible en este momento para ver en AR.")
      }
    }
    
    fetchUrl()
    
    return () => { isMounted = false }
  }, [id, retryCount])

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
        if (id) {
          recordARError(id, "Tiempo de espera agotado al descargar el modelo 3D (Timeout 7s).")
        }
      }
    }, 7000)

    return () => clearTimeout(timer)
  }, [modelLoaded, arState, retryCount, urlStatus, id])

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
  }, [modelLoaded, arState, retryCount, urlStatus])

  // Descongelar el UI de AR si el usuario regresa de iOS Quick Look (Safari/Chrome hide tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setArState((current) => {
          if (current === 'loading' || current === 'active') {
            return 'idle';
          }
          return current;
        });
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const handleActivateAR = useCallback(async () => {
    if (!internalViewerRef.current || !modelLoaded) return

    setArState("loading")
    setErrorMessage("")

    // Set 5-second timeout for AR initialization
    arTimeoutRef.current = setTimeout(() => {
      if (arState === "loading") {
        setArState("error")
        setErrorMessage("Hubo un problema al iniciar la cámara. Inténtalo de nuevo.")
        if (id) recordARError(id as string, "Timeout al intentar iniciar la cámara para AR.")
      }
    }, 5000)

    try {
      // @ts-expect-error model-viewer methods
      await internalViewerRef.current.activateAR()
    } catch (e: any) {
      if (arTimeoutRef.current) {
        clearTimeout(arTimeoutRef.current)
      }
      setArState("error")
      setErrorMessage("No se pudo iniciar la experiencia AR. Verifica que tu dispositivo sea compatible.")
      if (id) recordARError(id as string, `Excepción al invocar activateAR: ${e?.message || 'Unknown'}`)
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
      sessionStartTimeRef.current = Date.now()
    } else if (status === "not-presenting") {
      setArState("idle")
      if (sessionStartTimeRef.current && id) {
        const durationSeconds = (Date.now() - sessionStartTimeRef.current) / 1000
        recordARView(id as string, durationSeconds)
      }
      sessionStartTimeRef.current = null
    } else if (status === "failed") {
      setArState("error")
      setErrorMessage("Hubo un problema al iniciar la cámara. Inténtalo de nuevo.")
      if (id) recordARError(id as string, "Fallo emitido por el evento ar-status (failed).")
    }
  }, [arState, id])

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
      if(id) recordARError(id as string, `Permiso de cámara denegado: ${error.message}`)
    } else if (error?.message?.includes("not supported") || error?.message?.includes("WebXR")) {
      setArState("error")
      setErrorMessage("Tu dispositivo no soporta experiencias de Realidad Aumentada.")
      if(id) recordARError(id as string, `Dispositivo no soportado: ${error.message}`)
    } else {
      setArState("error")
      setErrorMessage("Ocurrió un error al cargar la experiencia AR. Por favor, intenta nuevamente.")
      if(id) recordARError(id as string, `Error inesperado devuelto por model-viewer: ${error?.message || "Desconocido"}`)
    }
  }, [id])

  // Handle model load event - completes the simulated progress
  const handleModelLoad = useCallback(() => {
    if (simulatedProgressRef.current) {
      clearInterval(simulatedProgressRef.current)
    }
    setModelLoadProgress(100)
    setModelLoaded(true)
  }, [])

  const modelViewerRef = useCallback((node: HTMLElement | null) => {
    if (node !== null) {
      // Eventos estándar
      node.addEventListener("ar-status", handleARStatus as EventListener)
      node.addEventListener("error", handleARError as EventListener)
      node.addEventListener("load", handleModelLoad as EventListener)
      internalViewerRef.current = node
    }
  }, [handleARStatus, handleARError, handleModelLoad])

  return (
    <div className="relative h-screen w-full overflow-hidden bg-menu-bg">
      {/* Model Viewer - Render only when URL is successfully generated */}
      {urlStatus === "success" && (
        <ModelViewerWrapper
          ref={modelViewerRef}
          src={modelPath}
          arModes="webxr scene-viewer quick-look"
          arPlacement="floor"
          arScale="fixed"
          cameraControls={false}
          autoRotate={false}
          environmentImage="/HDRI/Diurno-Hotel.hdr"
          exposure={0.8}
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
      )}

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
          <div className="flex flex-col items-center px-6 text-center w-full max-w-sm">
            {/* Model name */}
            <h1 className="mb-2 mt-12 font-serif text-3xl font-light tracking-wide text-menu-cream capitalize">
              {menuName}
            </h1>
            <div className="mb-8 h-px w-24 bg-gradient-to-r from-transparent via-menu-gold to-transparent" />

            {/* Animación de Mapeo Ambiental Permanente */}
            <div className="mb-6 w-full opacity-80 mix-blend-screen transition-opacity duration-1000">
              <EnvironmentalMapping />
            </div>

            {/* Contenedor relativo para alojar el Spinner y el Botón con transiciones suaves */}
            <div className="relative w-full flex flex-col items-center justify-center min-h-[120px]">
              {/* Loading State: Circular Spinner (Fades out when loaded) */}
              {(!modelLoaded || urlStatus === "fetching" || arState === "loading") && urlStatus !== "error" && arState !== "denied" && arState !== "error" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center w-full animate-out fade-out duration-1000 fill-mode-forwards" style={{ animationDelay: modelLoaded ? '0ms' : '9999s' }}>
                  <div className="relative mb-4">
                    {/* Spinner SVG elegante */}
                    <svg className="w-16 h-16 animate-spin text-menu-gold/20" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" fill="none" />
                      <path className="opacity-75 text-menu-gold" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {/* Progreso en el centro */}
                    <div className="absolute inset-0 flex items-center justify-center font-mono text-[0.6rem] text-menu-gold">
                      {urlStatus === "fetching" ? "..." : `${Math.round(modelLoadProgress)}%`}
                    </div>
                  </div>
                  <p className="font-mono text-xs tracking-widest text-menu-cream/60 uppercase">
                    Preparando Entorno 3D...
                  </p>
                </div>
              )}

            {/* Error State - Camera Denied */}
            {arState === "denied" && (
              <div className="mb-8 w-full">
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
                </div>
              </div>
            )}

            {/* Error State - General Error */}
            {arState === "error" && (
              <div className="mb-8 w-full">
                <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                  <p className="font-serif text-lg text-menu-cream">
                    {urlStatus === "error" ? "Plato no disponible en AR." : errorMessage}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  {urlStatus !== "error" && (
                    <button
                      onClick={handleRetryPermission}
                      className="w-full rounded-sm border border-menu-gold bg-menu-gold px-8 py-4 font-mono text-sm tracking-widest text-menu-bg transition-all hover:bg-menu-gold-light"
                    >
                      REINTENTAR
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Idle/Ready State - MAIN CTA */}
            {arState === "idle" && urlStatus === "success" && modelLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-backwards delay-500">
                <button
                  onClick={handleActivateAR}
                  className="group relative mb-6 w-full overflow-hidden rounded-sm border border-menu-gold bg-menu-gold px-6 py-5 font-mono text-sm tracking-widest text-menu-bg transition-all hover:bg-menu-gold-light hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3 font-semibold">
                    ABRIR CÁMARA
                  </span>
                  {/* Destello de luz sobre el botón */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                </button>

                <p className="max-w-xs font-mono text-xs tracking-wide text-menu-cream/50 leading-relaxed">
                  Apunta la cámara al <span className="text-menu-gold">código QR</span> para colocar el plato en tu mesa en tamaño real.
                </p>
              </div>
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
