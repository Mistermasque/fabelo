"use client"
import { useQuery } from "@blitzjs/rpc"
import { usePageTitle } from "app/hooks/usePageTitle"
import { IconButton, List, ListItem } from "@mui/material"
import { useEffect } from "react"
import getUsers from "../queries/getUsers"
import { ArrowForward } from "@mui/icons-material"
import Link from "next/link"
import { UserItem } from "./UserItem"

export function UsersList() {
  const { setPageTitle } = usePageTitle()

  useEffect(() => {
    setPageTitle("Liste des utilisateurs")
  })

  const [users, {}] = useQuery(
    getUsers,
    { order: "name" },
    {
      staleTime: Infinity,
    }
  )

  return (
    <List>
      {users.map((user) => (
        <ListItem
          key={user.id}
          sx={{
            "&:hover": {
              backgroundColor: (theme) => theme.palette.action.hover,
            },
          }}
          secondaryAction={
            <Link href={`/users/${user.id}`} passHref>
              <IconButton edge="end" aria-label="Détail utilisateur">
                <ArrowForward />
              </IconButton>
            </Link>
          }
        >
          <UserItem user={user} />
        </ListItem>
      ))}
    </List>
  )
}
