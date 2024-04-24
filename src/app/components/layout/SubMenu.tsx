import { ReactNode, useEffect, useState, MouseEvent } from "react"
import { Menu } from "@mui/material"
import { useSubMenu, type SubMenuType } from "app/hooks/useSubMenu"

interface SubMenuDrawerBoxProps {
  children: ReactNode
  iconButton?: SubMenuType["icon"]
}

/**
 * Composant permettant d'afficher le bouton du submenu avec des éléments de menus
 */
export function SubMenu({ children, iconButton }: SubMenuDrawerBoxProps) {
  const [anchorElt, setAnchorElt] = useState<null | HTMLElement>(null)
  const [, setSubMenu] = useSubMenu()

  const isMenuOpened = Boolean(anchorElt)

  const handleMenuClose = () => {
    setAnchorElt(null)
  }

  useEffect(() => {
    const icon = iconButton ?? "MoreVert"
    setSubMenu({
      icon,
      onClick: (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorElt(event.currentTarget)
      },
    })
  }, [setSubMenu, iconButton, setAnchorElt])

  return (
    <Menu open={isMenuOpened} onClose={handleMenuClose} anchorEl={anchorElt}>
      {children}
    </Menu>
  )
}
