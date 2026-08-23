"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"

// next-themes injects an inline <script> for its no-flash-of-wrong-theme
// trick. It's server-rendered HTML executed by the browser's parser before
// hydration, so it works correctly — but React 19 warns about any literal
// <script> element in the tree. Upstream is unmaintained (no fix as of
// https://github.com/pacocoursey/next-themes/issues/387), so filter just
// this one known false positive out of the dev console.
if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  const nativeError = console.error as {
    (...args: unknown[]): void
    __filtersNextThemesScriptWarning?: boolean
  }

  if (!nativeError.__filtersNextThemesScriptWarning) {
    const patchedError = (...args: unknown[]) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes(
          "Encountered a script tag while rendering React component"
        )
      ) {
        return
      }
      nativeError(...args)
    }
    patchedError.__filtersNextThemesScriptWarning = true
    console.error = patchedError
  }
}

function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <ThemeHotkey />
      {children}
    </NextThemesProvider>
  )
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (event.key.toLowerCase() !== "d") {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [resolvedTheme, setTheme])

  return null
}

export { ThemeProvider }
