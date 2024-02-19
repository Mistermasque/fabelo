"use client"
import { NavBarDesktop } from "./NavBarDesktop"
import { useMediaQuery, useTheme } from "@mui/material"
import { NavBarMobile } from "./NavBarMobile"

export interface NavBarProps {
  open: boolean
  onToggle: () => void
  onOpen: () => void
  onClose: () => void
}

export function NavBar(props: NavBarProps) {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"))

  return isDesktop ? <NavBarDesktop {...props} /> : <NavBarMobile {...props} />
}
