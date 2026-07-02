import { useCallback, useRef, useState } from "react"

export type ToastMessage = {
  readonly id: number
  readonly kind: "notice" | "error"
  readonly text: string
}

const TOAST_MS = 3_500

export function useToasts(): {
  readonly toasts: readonly ToastMessage[]
  readonly addToast: (text: string, kind: ToastMessage["kind"]) => void
} {
  const [toasts, setToasts] = useState<readonly ToastMessage[]>([])
  const toastIdRef = useRef(1)

  const addToast = useCallback((text: string, kind: ToastMessage["kind"]) => {
    const toast: ToastMessage = { id: toastIdRef.current, text, kind }
    toastIdRef.current += 1
    setToasts((current) => [...current, toast].slice(-4))
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== toast.id))
    }, TOAST_MS)
  }, [])

  return { toasts, addToast }
}
