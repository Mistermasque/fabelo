import {
  AddCircleOutline,
  FactCheck,
  Lock,
  Logout,
  ManageAccounts,
  NoteAdd,
  Person,
  ViewList,
} from "@mui/icons-material"
import { NavSectionProps } from "./NavSection"
import { NavItemProps } from "./NavItem"
import { useMutation } from "@blitzjs/rpc"
import logout from "app/(auth)/mutations/logout"
import { useRouter } from "next/navigation"

type SectionType = Omit<NavSectionProps, "children" | "menuOpened"> & {
  items: Omit<NavItemProps, "menuOpened">[]
}

export default function SectionsConfig(): SectionType[] {
  const [logoutMutation] = useMutation(logout)
  const router = useRouter()
  return [
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
          path: "/refunds/new",
        },
        {
          title: "Liste des remboursements",
          icon: <FactCheck />,
          path: "/refunds",
        },
      ],
    },
    {
      title: "Administration",
      items: [
        {
          title: "Gestion des utilisateurs",
          icon: <ManageAccounts />,
          path: "/users",
        },
      ],
    },
    {
      title: "Mon compte",
      items: [
        {
          title: "Editer mon profil",
          icon: <Person />,
          path: "/refunds/new",
        },
        {
          title: "Changer mon mot de passe",
          icon: <Lock />,
          path: "/refunds/new",
        },
        {
          title: "Déconnexion",
          icon: <Logout />,
          path: async () => {
            await logoutMutation()
            router.push("/")
          },
        },
      ],
    },
  ]
}
