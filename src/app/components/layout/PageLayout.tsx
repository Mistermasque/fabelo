"use client"
import { Box, CssBaseline, Stack, ThemeProvider } from "@mui/material"
import { NavBar } from "@/src/app/components/layout/nav-bar/NavBar"
import { TopBar, TopBarOffset } from "./nav-bar/TopBar"
import { ReactNode, useState } from "react"
import { theme } from "app/theme"
import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"
import { ConfirmProvider } from "material-ui-confirm"
import { SnackbarProvider } from "notistack"

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
      <CssBaseline />

      <ConfirmProvider>
        <SnackbarProvider maxSnack={3}>
          <Box
            sx={{ display: "flex", backgroundColor: (theme) => theme.palette.background.default }}
          >
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
                <Box component="main" sx={{ p: { xs: 1, sm: 1, md: 2 }, width: "100%" }}>
                  {children}
                </Box>
              </Stack>
            </Stack>
          </Box>
        </SnackbarProvider>
      </ConfirmProvider>
    </ThemeProvider>
  )
}
