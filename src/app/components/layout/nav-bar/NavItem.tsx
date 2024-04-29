import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import { Route } from "next"
import { usePathname, useRouter } from "next/navigation"
import { ReactNode } from "react"

export interface NavItemProps {
  disabled?: boolean
  external?: boolean
  icon: ReactNode
  title: string
  path: Route | (() => void)
  menuOpened: boolean
}
/**
 * Affiche un élément de navigation dans le menu de navigation
 */
export function NavItem({ disabled, external, icon, title, path, menuOpened }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === path
  const router = useRouter()

  const handleClick = () => {
    if (typeof path === "function") {
      return path()
    }

    router.push(path)
  }

  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      <ListItemButton
        component={external ? "div" : "a"}
        disabled={disabled ? true : undefined}
        sx={[
          {
            minHeight: 48,
            justifyContent: menuOpened ? "initial" : "center",
            px: 2.5,
          },
          (theme) => (isActive ? { backgroundColor: theme.palette.action.focus } : null),
        ]}
        onClick={handleClick}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: menuOpened ? 3 : "auto",
            justifyContent: "center",
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText sx={{ opacity: menuOpened ? 1 : 0 }} primary={title} />
      </ListItemButton>
    </ListItem>
  )
}
