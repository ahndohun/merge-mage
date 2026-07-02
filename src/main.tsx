import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { GameShell } from "./ui/GameShell"
import "./styles.css"

const rootElement = document.getElementById("root")

if (rootElement === null) {
  throw new Error("Missing root element")
}

createRoot(rootElement).render(
  <StrictMode>
    <GameShell />
  </StrictMode>,
)
