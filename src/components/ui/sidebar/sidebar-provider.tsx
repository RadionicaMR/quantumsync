
import * as React from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useIsMobileOnly } from "@/hooks/use-mobile"
import { 
  SidebarContext, 
  SidebarState, 
  setSidebarCookie,
  getSidebarCookie,
  SIDEBAR_KEYBOARD_SHORTCUT
} from "@/hooks/use-sidebar"

export const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    // Fix: Use the simpler version that returns a boolean directly
    const isMobile = useIsMobileOnly()
    const [openMobile, setOpenMobile] = React.useState(false)

    // Inicializar el estado con el valor de la cookie si existe
    const initializeOpenState = React.useCallback(() => {
      const savedState = getSidebarCookie();
      return savedState === "true" ? true : defaultOpen;
    }, [defaultOpen]);

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(initializeOpenState)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        // Usar la función mejorada para Safari
        setSidebarCookie(openState.toString());
      },
      [setOpenProp, open]
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    // Adds a keyboard shortcut to toggle the sidebar, mejorado para Safari
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        // Comprobar que no estamos en un input o textarea
        const activeElement = document.activeElement;
        const isInput = activeElement instanceof HTMLInputElement || 
                        activeElement instanceof HTMLTextAreaElement;
        
        if (
          !isInput &&
          event.key.toLowerCase() === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault();
          toggleSidebar();
        }
      }

      // Usar passive: true para mejor rendimiento en dispositivos táctiles
      window.addEventListener("keydown", handleKeyDown, { passive: false });
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSidebar])

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state: SidebarState = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": "16rem",
                "--sidebar-width-icon": "3rem",
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"
