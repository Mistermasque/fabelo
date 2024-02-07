import { AppBar, IconButton, styled, Toolbar, Typography } from "@mui/material"
import { Menu } from "@mui/icons-material"
import { usePageTitle } from "../../../hooks/usePageTitle"

/**
 * Ce composant permet de décaler les éléments par rapport à la toolbar
 * Sinon ils se retrouveront dessous
 */
export const TopBarOffset = styled("div")(({ theme }) => theme.mixins.toolbar)

interface TopBarProps {
  onNavBarToggle: () => void
}

export function TopBar({ onNavBarToggle }: TopBarProps) {
  const { pageTitle } = usePageTitle()

  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          sx={{ mr: { xs: 0.5, sm: 2 } }}
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onNavBarToggle}
        >
          <Menu />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {pageTitle}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
