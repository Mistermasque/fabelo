"use client"
import { Box, CssBaseline, Paper, ThemeProvider } from "@mui/material"
import { ReactNode } from "react"
import { theme } from "app/theme"
import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"
import { SnackbarProvider } from "notistack"

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <Box
          alignItems="center"
          justifyContent="center"
          sx={{
            display: "flex",
            width: "100%",
            height: "100%",
            padding: {
              xs: 2,
              sm: 15,
            },
          }}
        >
          <Paper
            component="main"
            sx={{
              maxWidth: "500px",
              backgroundColor: (theme) => theme.palette.background.default,
              padding: 2,
            }}
            elevation={10}
          >
            {children}
          </Paper>
        </Box>
      </SnackbarProvider>
    </ThemeProvider>
  )
}
