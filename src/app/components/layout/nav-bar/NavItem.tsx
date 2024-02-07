import { ListItem, ListItemButton, ListItemIcon, ListItemText, styled } from "@mui/material"
import NextLink from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

interface LinkProps {
  disabled?: boolean
  external?: boolean
  path: string
  children: ReactNode
}

function Link({ disabled, external, path, children }: LinkProps) {
  /* Permet de créer le lien avec next et qu'il soit correctement ajouté au href du bouton MUI
https://www.manuelkruisz.com/blog/posts/next-js-links-and-material-ui
On utilise le hack du legacyBehavior pour styliser correctement le lien
https://stackoverflow.com/questions/76036888/my-mui-listitem-is-blue-colored-when-using-next-link-how-can-i-fix-this */

  return (
    <>
      {!external ? (
        <NextLink href={{ pathname: path }} passHref legacyBehavior>
          {children}
        </NextLink>
      ) : disabled ? (
        <div>{children}</div>
      ) : (
        <a href={path} target="_blank" rel="noreferrer">
          {children}
        </a>
      )}
    </>
  )
}

export interface NavItemProps {
  disabled?: boolean
  external?: boolean
  icon: ReactNode
  title: string
  path: string
  menuOpened: boolean
}
/**
 * Affiche un élément de navigation dans le menu de navigation
 */
export function NavItem({ disabled, external, icon, title, path, menuOpened }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === path

  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      <Link path={path} external={external} disabled={disabled}>
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
      </Link>
    </ListItem>
  )
}
