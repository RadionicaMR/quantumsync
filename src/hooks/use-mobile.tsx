
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  const [isIOS, setIsIOS] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Detect if device is mobile based on screen size
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Detect iOS devices
    const detectIOS = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
      const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream
      setIsIOS(isIOSDevice)
    }
    
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    detectIOS()
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return {
    isMobile: !!isMobile,
    isIOS
  }
}
