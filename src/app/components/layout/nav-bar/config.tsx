import { AddCircleOutline, FactCheck, NoteAdd, ViewList } from "@mui/icons-material"
import { NavSectionProps } from "./NavSection"
import { NavItemProps } from "./NavItem"

type SectionType = Omit<NavSectionProps, "children" | "menuOpened"> & {
  items: Omit<NavItemProps, "menuOpened">[]
}

const sections: SectionType[] = [
  {
    title: "Dépenses",
    items: [
      {
        title: "Créer une dépense",
        icon: <AddCircleOutline />,
        path: "/expenses/new",
      },
      {
        title: "Liste des dépenses",
        icon: <ViewList />,
        path: "/expenses",
      },
    ],
  },
  {
    title: "Remboursements",
    items: [
      {
        title: "Créer un remboursement",
        icon: <NoteAdd />,
        path: "#",
      },
      {
        title: "Liste des remboursements",
        icon: <FactCheck />,
        path: "#",
      },
    ],
  },
]

export default sections
