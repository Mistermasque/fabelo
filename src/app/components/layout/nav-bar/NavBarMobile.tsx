import sections from "./config"
import { Divider, Drawer, IconButton, styled } from "@mui/material"
import { NavSection } from "./NavSection"
import { NavItem } from "./NavItem"
import { ChevronLeft } from "@mui/icons-material"
import { Fragment } from "react"
import { NavBarProps } from "./NavBar"

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

interface NavBarMobileProps extends NavBarProps {}

export function NavBarMobile({ onClose, open }: NavBarMobileProps) {
  const nbSections = sections.length

  return (
    <Drawer variant="temporary" component="nav" open={open} onClose={onClose} onClick={onClose}>
      <DrawerHeader>
        <IconButton onClick={onClose}>
          <ChevronLeft />
        </IconButton>
      </DrawerHeader>
      <Divider />
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
