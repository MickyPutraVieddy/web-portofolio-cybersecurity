"use client"

import { useEffect, useRef, useState } from "react"

/** True once the element has scrolled into view (and stays true). */
export function useInView<T extends Element>(threshold = 0.3) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || seen) return
    if (typeof IntersectionObserver === "undefined") { setSeen(true); return }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) { setSeen(true); observer.disconnect() }
    }, { threshold })
    observer.observe(element)
    return () => observer.disconnect()
  }, [seen, threshold])

  return { ref, seen }
}
