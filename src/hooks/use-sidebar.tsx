
import * as React from "react"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

export type SidebarState = "expanded" | "collapsed"

export type SidebarContext = {
  state: SidebarState
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

// Función de utilidad para gestionar cookies de manera segura en Safari
export function setSidebarCookie(value: string) {
  try {
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}; SameSite=Lax`;
  } catch (e) {
    console.warn("Error setting sidebar cookie:", e);
  }
}

// Función para leer cookies de manera segura en Safari
export function getSidebarCookie(): string | null {
  try {
    const match = document.cookie.match(new RegExp(`(^| )${SIDEBAR_COOKIE_NAME}=([^;]+)`));
    return match ? match[2] : null;
  } catch (e) {
    console.warn("Error reading sidebar cookie:", e);
    return null;
  }
}

export { SidebarContext, SIDEBAR_KEYBOARD_SHORTCUT }
