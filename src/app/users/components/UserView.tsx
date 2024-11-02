"use client"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { useConfirm } from "material-ui-confirm"
import { usePageTitle } from "app/hooks/usePageTitle"
import getUser from "../queries/getUser"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import deleteUser from "../mutations/deleteUser"
import { IconButton, ListItemIcon, ListItemText, MenuItem, Stack, Typography } from "@mui/material"
import { SubMenu } from "app/components/layout/SubMenu"
import { ArrowBack, Delete, Edit } from "@mui/icons-material"

export interface UserViewProps {
  userId: number
}

/**
 * Affichage d'un utilisateur
 */
export function UserView({ userId }: UserViewProps) {
  const [user] = useQuery(
    getUser,
    { id: userId },
    {
      // This ensures the query never refreshes
      staleTime: Infinity,
    }
  )

  const confirm = useConfirm()

  const { setPageTitle } = usePageTitle()

  useEffect(() => {
    setPageTitle("Utilisateur " + user.name)
  })

  const router = useRouter()
  const [deleteUserMutation] = useMutation(deleteUser)

  const handleClickEdit = () => {
    // router.push(`/users/${user.id}/edit`)
    router.push(`/`)
  }

  const handleClickDelete = () => {
    confirm({
      title: "Êtes-vous sûr ?",
      description:
        "Cette action supprimera ou désactivera l'utilisateur sans possibilité de récupération !",
      cancellationText: "Annuler",
      confirmationText: "Oui, supprimer",
      confirmationButtonProps: { color: "error" },
    }).then(async () => {
      await deleteUserMutation({ id: user.id })
      router.push("/users")
    })
  }
  const handleGoBackClick = () => {
    if (window.history.length > 0) {
      router.back()
    } else {
      router.push("/users")
    }
  }

  return (
    <>
      <SubMenu>
        <MenuItem onClick={handleClickEdit}>
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText>Editer</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClickDelete}>
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          <ListItemText>Supprimer</ListItemText>
        </MenuItem>
      </SubMenu>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center">
          <IconButton size="large" onClick={handleGoBackClick}>
            <ArrowBack />
          </IconButton>
          <Typography component="h2" variant="h4">
            {user.name}
          </Typography>
        </Stack>
        <Typography component="em" variant="body2">
          {"Dernière connexion le " +
            user.lastConnection?.toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
        </Typography>
        <p>
          <strong>Rôle : </strong>
          {user.roleText}
        </p>
      </Stack>
    </>
  )
}
