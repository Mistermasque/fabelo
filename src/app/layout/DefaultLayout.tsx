"use client"
import { Box, CssBaseline, Stack } from "@mui/material"
import { NavBar } from "@/src/app/layout/nav-bar/NavBar"
import { TopBar, TopBarOffset } from "./nav-bar/TopBar"
import { ReactNode, useState } from "react"

export function DefaultLayout({ children }: { children: ReactNode }) {
  const [isNavBarOpened, setisNavBarOpened] = useState(false)

  const handleNavBarToggle = () => {
    setisNavBarOpened(!isNavBarOpened)
  }

  const handleNavBarClose = () => {
    setisNavBarOpened(false)
  }

  const handleNavBarOpen = () => {
    setisNavBarOpened(true)
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Stack direction="column">
        <TopBar onNavBarToggle={handleNavBarToggle} />
        <TopBarOffset />
        <Stack direction="row">
          <NavBar
            open={isNavBarOpened}
            onOpen={handleNavBarOpen}
            onClose={handleNavBarClose}
            onToggle={handleNavBarOpen}
          />
          <Box component="main" sx={{ p: 2 }}>
            {children}
          </Box>
        </Stack>
      </Stack>
    </Box>
  )
}
