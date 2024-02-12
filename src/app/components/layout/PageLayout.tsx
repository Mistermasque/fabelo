"use client"
import { Box, CssBaseline, Stack, ThemeProvider } from "@mui/material"
import { NavBar } from "@/src/app/components/layout/nav-bar/NavBar"
import { TopBar, TopBarOffset } from "./nav-bar/TopBar"
import { ReactNode, useState } from "react"
import { theme } from "app/theme"

export function PageLayout({ children }: { children: ReactNode }) {
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
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <Stack direction="column" sx={{ width: "100%" }}>
          <TopBar onNavBarToggle={handleNavBarToggle} />
          <TopBarOffset />
          <Stack direction="row">
            <NavBar
              open={isNavBarOpened}
              onOpen={handleNavBarOpen}
              onClose={handleNavBarClose}
              onToggle={handleNavBarOpen}
            />
            <Box component="main" sx={{ p: 2, width: "100%" }}>
              {children}
            </Box>
          </Stack>
        </Stack>
      </Box>
    </ThemeProvider>
  )
}
