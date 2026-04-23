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

  // On-Screen Debugger
  const [debugLogs, setDebugLogs] = useState<string[]>([])
  const addLog = useCallback((msg: string) => {
    setDebugLogs(prev => [...prev.slice(-14), `[${new Date().toLocaleTimeString()}] ${msg}`])
  }, [])
  
  // Debug/Testing HDRI temporal
  const [hdri, setHdri] = useState("/HDRI/Diurno-Hotel.hdr")
  const [exposure, setExposure] = useState<number>(1)
  const [isMirrorMode, setIsMirrorMode] = useState(false)
  const originalMaterialsRef = useRef<{name: string, roughness: number, metallic: number}[]>([])
  
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

  // Feature Detection & Validation WebXR (Estricto Image-Tracking)
  useEffect(() => {
    let isMounted = true
    
    async function checkWebXR() {
      addLog("Iniciando validación estricta WebXR...")
      
      if (typeof navigator === 'undefined') return
      
      if (!navigator.xr) {
        addLog("🔴 ERROR CRÍTICO: navigator.xr no existe en este navegador.")
        addLog("🔴 CAUSA: Navegador no compatible, no es HTTPS, o WebXR bloqueado.")
        return
      }
      
      addLog("✅ API navigator.xr detectada.")
      
      try {
        // 1. Verificamos soporte básico de AR
        const basicSupported = await navigator.xr.isSessionSupported('immersive-ar')
        addLog(`Soporte AR Básico (immersive-ar): ${basicSupported ? "✅ SÍ" : "🔴 NO"}`)
        
        if (!basicSupported) {
          addLog("🔴 ERROR: El dispositivo no soporta AR Básico.")
          return
        }

        // 2. Verificamos soporte ESTRICTO de Image Tracking
        addLog("Evaluando requiredFeatures: ['image-tracking']...")
        const imageTrackingSupported = await navigator.xr.isSessionSupported('immersive-ar', {
          requiredFeatures: ['image-tracking']
        })
        
        if (imageTrackingSupported) {
          addLog("✅ EXITO: Image Tracking Soportado: TRUE")
        } else {
          addLog("🔴 ERROR: Image Tracking Soportado: FALSE")
          addLog("🔴 CAUSA: El navegador bloqueó el rastreo de imágenes o el hardware no lo soporta.")
          addLog("⚠️ ANDROID: Activar 'WebXR Incubations' en chrome://flags")
        }
      } catch (error: any) {
         addLog(`🔴 EXCEPCIÓN en isSessionSupported: ${error.message}`)
         console.error("WebXR check error:", error)
      }
    }
    
    checkWebXR()
    return () => { isMounted = false }
  }, [addLog])

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
    addLog(`AR Status: ${status}`)

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
  }, [arState, id, addLog])

  const handleARError = useCallback((event: CustomEvent) => {
    const error = event.detail
    addLog(`🔴 AR Error: ${error?.message || "Error desconocido / Catastrófico"}`)

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
  }, [id, addLog])

  // Handle model load event - completes the simulated progress
  const handleModelLoad = useCallback(() => {
    if (simulatedProgressRef.current) {
      clearInterval(simulatedProgressRef.current)
    }
    setModelLoadProgress(100)
    setModelLoaded(true)
  }, [])

  // Efecto para Modo Espejo (Debug)
  useEffect(() => {
    if (!modelLoaded || !internalViewerRef.current) return

    // @ts-expect-error accessing model-viewer specific properties
    const model = internalViewerRef.current.model
    if (!model || !model.materials) return

    const materials = model.materials

    if (isMirrorMode) {
      // Guardar originales si la lista está vacía
      if (originalMaterialsRef.current.length === 0) {
        materials.forEach((material: any) => {
          originalMaterialsRef.current.push({
            name: material.name,
            roughness: material.pbrMetallicRoughness.roughnessFactor,
            metallic: material.pbrMetallicRoughness.metallicFactor
          })
        })
      }

      // Aplicar modo espejo (cromo)
      materials.forEach((material: any) => {
        material.pbrMetallicRoughness.setRoughnessFactor(0)
        material.pbrMetallicRoughness.setMetallicFactor(1)
      })
    } else {
      // Restaurar originales
      if (originalMaterialsRef.current.length > 0) {
        materials.forEach((material: any, index: number) => {
          const original = originalMaterialsRef.current[index]
          if (original) {
            material.pbrMetallicRoughness.setRoughnessFactor(original.roughness)
            material.pbrMetallicRoughness.setMetallicFactor(original.metallic)
          }
        })
      }
    }
  }, [isMirrorMode, modelLoaded])

  // SETUP WebXR Image Tracking (FASE 2)
  const QR_SIZE_IN_METERS = 0.055 // 5.5cm
  const DISH_OFFSET = { x: 0, y: 0.1, z: -0.2 } // Vector M_Dish respecto al QR

  // EL ARREGLO: Callback Ref limpio
  const modelViewerRef = useCallback((node: HTMLElement | null) => {
    if (node !== null) {
      // Eventos estándar
      node.addEventListener("ar-status", handleARStatus as EventListener)
      node.addEventListener("error", handleARError as EventListener)
      node.addEventListener("load", handleModelLoad as EventListener)
      internalViewerRef.current = node

      // Intento de Hook experimental WebXR Image Tracking
      node.addEventListener('ar-button', async (event: any) => {
         addLog("AR-BUTTON: Botón de AR presionado.")
         
         // Verificamos si estamos invocando WebXR nativo
         if (navigator.xr && 'isSessionSupported' in navigator.xr) {
           try {
             addLog("Buscando inyectar requiredFeatures: ['image-tracking']...")
             
             // NOTA DE DIAGNÓSTICO ESTRICTO:
             // Model-viewer NO EXPONE de forma nativa una API para pasar `trackedImages` 
             // ni para interceptar su `requestSession` y pasarle `requiredFeatures: ['image-tracking']`.
             // Internamente, siempre usa ['hit-test'] si ar-modes="webxr" está activo.
             
             const viewer = node as any
             if (viewer.xrEnvironment) {
                console.log("[AR Marker Tracking] Preparando anclajes (Intento):", DISH_OFFSET, QR_SIZE_IN_METERS)
                // Si el entorno tiene soporte (custom fork de model-viewer), intentamos leer el tracker.
             } else {
                addLog("⚠️ ADVERTENCIA: model-viewer está forzando sesión estándar sin marcadores.")
             }
           } catch (e: any) {
             console.warn("Image tracking config failed, falling back to surface tracking", e)
             addLog(`🔴 Error config tracking: ${e.message}`)
           }
         }
      })
    }
  }, [handleARStatus, handleARError, handleModelLoad, addLog])

  return (
    <div className="relative h-screen w-full overflow-hidden bg-menu-bg">
      {/* Model Viewer - Render only when URL is successfully generated */}
      {urlStatus === "success" && (
        <ModelViewerWrapper
          ref={modelViewerRef}
          src={modelPath}
          arModes="webxr"
          arTrackingMethod="image"
          arMarker="/codigoQR.jpeg"
          arMarkerWidth="0.055"
          // Hemos removido arPlacement="floor" explícitamente para intentar PROHIBIR 
          // el hit-test estándar (colocación en el suelo), 
          // pero model-viewer estándar ignorará esto y hará fallback a free-roam.
          arPlacement="none" // Valor custom para probar si evita el hit-test
          arScale="fixed"
          cameraControls={false}
          autoRotate={false}
          environmentImage={hdri}
          exposure={exposure}
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

            {/* Loading State: Circular Spinner + Environmental Animation */}
            {(!modelLoaded || urlStatus === "fetching" || arState === "loading") && urlStatus !== "error" && arState !== "denied" && arState !== "error" && (
              <div className="flex flex-col items-center justify-center w-full">
                
                {/* Nueva Animación de Mapeo Ambiental de Fase 3 */}
                <div className="mb-6 w-full opacity-80 mix-blend-screen">
                  <EnvironmentalMapping />
                </div>

                <div className="relative mb-6">
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
              <div className="flex flex-col items-center justify-center w-full animate-in fade-in zoom-in duration-500">
                <div className="mb-8 relative">
                  <div className="absolute inset-0 animate-ping rounded-full bg-menu-gold/20" style={{ animationDuration: "2s" }} />
                  <div className="relative rounded-full border border-menu-gold/40 p-6 bg-menu-bg">
                    <svg className="h-12 w-12 text-menu-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                </div>

                {/* SECCIÓN TEMPORAL DEBUG/TESTING HDRI */}
                <div className="mb-6 w-full flex flex-col gap-3 p-4 border border-menu-gold/40 rounded-sm bg-menu-bg/80 relative z-50 pointer-events-auto">
                  <p className="font-mono text-[10px] tracking-widest text-menu-gold text-center uppercase">Debug/Testing HDRI</p>
                  
                  <select 
                    value={hdri}
                    onChange={(e) => setHdri(e.target.value)}
                    className="w-full bg-menu-bg border border-menu-gold/30 text-menu-cream font-mono text-xs p-2 rounded-sm focus:outline-none focus:border-menu-gold"
                  >
                    <option value="/HDRI/Diurno-Hotel.hdr">Diurno-Hotel</option>
                    <option value="/HDRI/Nocturno-Christmas.hdr">Nocturno-Christmas</option>
                    <option value="/HDRI/Nocturno-Fireplace.hdr">Nocturno-Fireplace</option>
                    <option value="/HDRI/Nocturno-Studio.hdr">Nocturno-Studio</option>
                  </select>

                  <p className="font-mono text-[10px] text-menu-cream/70 text-center">
                    HDRI Activo: {hdri}
                  </p>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between font-mono text-xs text-menu-cream/80">
                      <span>Exposición</span>
                      <span>{exposure.toFixed(1)}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="2.5" 
                      step="0.1" 
                      value={exposure}
                      onChange={(e) => setExposure(parseFloat(e.target.value))}
                      className="w-full accent-menu-gold"
                    />
                  </div>
                  
                  <button
                    onClick={() => setIsMirrorMode(!isMirrorMode)}
                    className={`mt-2 w-full border font-mono text-xs px-4 py-2 transition-all rounded-sm uppercase tracking-widest ${
                      isMirrorMode 
                        ? "bg-menu-gold text-menu-bg border-menu-gold" 
                        : "bg-transparent text-menu-gold/80 border-menu-gold/40 hover:bg-menu-gold/10 hover:text-menu-gold"
                    }`}
                  >
                    {isMirrorMode ? "Test de Espejo: ACTIVO" : "Activar Test de Espejo"}
                  </button>
                </div>
                {/* FIN SECCIÓN TEMPORAL */}

                <button
                  onClick={handleActivateAR}
                  className="group relative mb-6 w-full overflow-hidden rounded-sm border border-menu-gold bg-menu-gold px-6 py-5 font-mono text-sm tracking-widest text-menu-bg transition-all hover:bg-menu-gold-light"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3 font-semibold">
                    ABRIR CÁMARA
                  </span>
                </button>

                <p className="max-w-xs font-mono text-xs tracking-wide text-menu-cream/50 leading-relaxed">
                  Apunta la cámara al <span className="text-menu-gold">código QR</span> en la mesa o directamente sobre una superficie plana.
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

      {/* On-Screen Debugger Panel */}
      <div className="fixed top-0 left-0 w-full h-1/3 bg-black/80 text-green-400 font-mono text-xs p-2 overflow-y-auto z-50 pointer-events-none flex flex-col justify-end">
        {debugLogs.map((log, i) => (
          <div key={i} className={`${log.includes("🔴") ? "text-red-500" : log.includes("⚠️") ? "text-yellow-400" : "text-green-400"}`}>
            {log}
          </div>
        ))}
      </div>
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
