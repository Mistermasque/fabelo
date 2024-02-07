"use client"

import { styled, Theme, CSSObject } from "@mui/material/styles"
import { Box, Divider, BoxProps } from "@mui/material"

import sections from "./config"
import { NavSection } from "./NavSection"
import { NavItem } from "./NavItem"
import { Fragment } from "react"
import { NavBarProps } from "./NavBar"

const drawerWidth = 300

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

interface DrawerProps extends BoxProps {
  open?: boolean
}

const Drawer = styled(Box, { shouldForwardProp: (prop) => prop !== "open" })<DrawerProps>(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    borderRight: "1px solid " + theme.palette.divider,
    overflowX: "hidden",
    ...(open && {
      ...openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
    }),
  })
)

interface NavBarDesktopProps extends NavBarProps {}

export function NavBarDesktop({ open }: NavBarDesktopProps) {
  const nbSections = sections.length

  return (
    <Drawer component="nav" open={open}>
      {sections.map((section, index) => (
        <Fragment key={index}>
          <NavSection title={section.title} menuOpened={open}>
            {section.items.map((item) => (
              <NavItem key={item.title} {...item} menuOpened={open} />
            ))}
          </NavSection>

          {index < nbSections - 1 ? <Divider /> : null}
        </Fragment>
      ))}
    </Drawer>
  )
}
