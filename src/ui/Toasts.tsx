import type { ToastMessage } from "./useToasts"

type ToastsProps = {
  readonly toasts: readonly ToastMessage[]
}

export function Toasts(props: ToastsProps) {
  return (
    <div className="toast-stack" aria-live="polite">
      {props.toasts.map((toast) => (
        <div className={`toast toast-${toast.kind}`} key={toast.id}>
          {toast.text}
        </div>
      ))}
    </div>
  )
}
