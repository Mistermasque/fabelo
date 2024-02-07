import { ReactNode } from "react"
import {
  CSSObject,
  List,
  ListItem,
  ListItemProps,
  ListItemText,
  styled,
  Theme,
} from "@mui/material"

const openedMixin = (theme: Theme): CSSObject => ({
  height: "50px",
  transition: theme.transitions.create("height", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("height", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  height: 0,
  padding: 0,
  margin: 0,
})

interface TitleSectionProps extends ListItemProps {
  open?: boolean
}

const TitleSection = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== "open",
})<TitleSectionProps>(({ theme, open }) => ({
  ...(open && {
    ...openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
  }),
}))

export interface NavSectionProps {
  label?: ReactNode
  title: string
  children: ReactNode
  menuOpened: boolean
}

/**
 * Créé une liste d'item dans la navbar.
 */
export function NavSection({ label, title, children, menuOpened }: NavSectionProps) {
  return (
    <List>
      <TitleSection
        open={menuOpened}
        key={title}
        sx={{
          textTransform: "uppercase",
          fontSize: 12,
        }}
      >
        <ListItemText primary={title} sx={{ display: menuOpened ? "block" : "none" }} />
      </TitleSection>
      {children}
    </List>
  )
}
