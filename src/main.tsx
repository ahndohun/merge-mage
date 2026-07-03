import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { GameShell } from "./ui/GameShell"
import { LocaleProvider } from "./ui/useLocale"
import "@fontsource/silkscreen/400.css"
import "@fontsource/silkscreen/700.css"
import "@fontsource/vt323/400.css"
import "./styles.css"
import "./ui/overlay.css"

const rootElement = document.getElementById("root")

if (rootElement === null) {
  throw new Error("Missing root element")
}

createRoot(rootElement).render(
  <StrictMode>
    <LocaleProvider>
      <GameShell />
    </LocaleProvider>
  </StrictMode>,
)
