import { ReactNode, useCallback, useEffect, useState } from "react"
import { Divider, Drawer, IconButton, Stack, styled, useMediaQuery, useTheme } from "@mui/material"
import { useSubMenu, type SubMenuType } from "../../hooks/useSubMenu"
import { ChevronRight } from "@mui/icons-material"

interface SubMenuDrawerBoxProps {
  children: ReactNode
  iconButton?: SubMenuType["icon"]
}

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

/**
 * Composant permettant d'encapsuler des élements dans un Drawer activé par le bouton du submenu.
 * Il s'adapte en fonction de l'affichage en étant soit affiché directement pour les écrans PC
 * soit affiché dans un drawer avec l'apparition d'un bouton pour les interfaces mobiles
 */
export function SubMenuDrawerBox({ children, iconButton }: SubMenuDrawerBoxProps) {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"))

  const [drawerOpened, setDrawerOpened] = useState(false)

  const [, setSubMenu] = useSubMenu()

  const toggleDrawer = useCallback(
    (opened?: boolean) => {
      const isOpen = opened !== undefined ? opened : !drawerOpened
      setDrawerOpened(isOpen)
    },
    [drawerOpened]
  )

  useEffect(() => {
    const icon = isDesktop ? false : iconButton ?? "MoreVert"
    setSubMenu({
      icon: icon,
      onClick: () => toggleDrawer(),
    })
  }, [setSubMenu, toggleDrawer, iconButton, isDesktop])

  if (isDesktop) {
    return <>{children}</>
  }

  return (
    <Drawer
      variant="temporary"
      anchor="right"
      open={drawerOpened}
      onClose={() => toggleDrawer(false)}
      PaperProps={{ sx: { minWidth: "70%" } }}
    >
      <DrawerHeader sx={{ mb: 2 }}>
        <IconButton onClick={() => toggleDrawer(false)}>
          <ChevronRight />
        </IconButton>
      </DrawerHeader>
      {children}
    </Drawer>
  )
}
