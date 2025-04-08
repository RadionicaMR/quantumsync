
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  const [isIOS, setIsIOS] = React.useState<boolean>(false)
  const [isSafari, setIsSafari] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Optimizado: Usar ResizeObserver en vez de matchMedia para mejor rendimiento en Safari
    const updateMobileState = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Detección más precisa de dispositivos iOS y Safari
    const detectBrowser = () => {
      // Detectar iOS
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
      const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream
      
      // Detectar Safari específicamente
      const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(userAgent) || 
                             (navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
                              navigator.userAgent && !navigator.userAgent.match(/CriOS/i) &&
                              !navigator.userAgent.match(/FxiOS/i));
      
      setIsIOS(isIOSDevice)
      setIsSafari(isSafariBrowser)
      
      // Safari en iOS tiene problemas con ciertas APIs, aplicar optimizaciones
      if (isIOSDevice || isSafariBrowser) {
        // Aplicar optimizaciones específicas para Safari
        document.documentElement.classList.add('is-safari')
        if (isIOSDevice) document.documentElement.classList.add('is-ios')
      }
    }
    
    // Ejecutar detecciones iniciales
    updateMobileState()
    detectBrowser()
    
    // Usar ResizeObserver es más eficiente que window.resize en Safari
    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(() => {
        window.requestAnimationFrame(updateMobileState)
      })
      resizeObserver.observe(document.documentElement)
      return () => resizeObserver.disconnect()
    } else {
      // Fallback para navegadores antiguos
      window.addEventListener("resize", updateMobileState, { passive: true })
      return () => window.removeEventListener("resize", updateMobileState)
    }
  }, [])

  return {
    isMobile: !!isMobile,
    isIOS,
    isSafari
  }
}

// Versión simplificada para componentes que solo necesitan el boolean
export function useIsMobileOnly(): boolean {
  const { isMobile } = useIsMobile()
  return isMobile
}
