import { LinearProgress } from "@mui/material"

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 3000,
        width: "100%",
      }}
    >
      <LinearProgress />
    </div>
  )
}
