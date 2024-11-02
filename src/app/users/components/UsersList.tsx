"use client"
import { useQuery } from "@blitzjs/rpc"
import { usePageTitle } from "app/hooks/usePageTitle"
import { IconButton, List, ListItem, ListItemButton } from "@mui/material"
import { useEffect } from "react"
import getUsers from "../queries/getUsers"
import { ArrowForward, Delete } from "@mui/icons-material"
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

  const handleClickEdit = (input) => {
    console.log(input)
  }
  const handleClickDelete = () => {}

  return (
    <List>
      {users.map((user) => (
        <ListItem key={user.id} disablePadding>
          <ListItemButton onClick={handleClickEdit}>
            <UserItem user={user} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}
