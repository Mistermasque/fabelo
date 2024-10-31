import { Chip, Typography } from "@mui/material"
import Grid from "@mui/material/Unstable_Grid2"
import { formatDistance } from "date-fns"
import { fr as frLocale } from "date-fns/locale/fr"

export interface UserItemProps {
  user: {
    id: number
    name: string | null
    isActive: boolean
    email: string
    role: string | null
    lastConnection: Date | null
    roleText: string
  }
}
/**
 * Affiche le détail d'un utilisateur à mettre dans un item de List
 */
export function UserItem({ user }: UserItemProps) {
  const lastConnection = user.lastConnection
    ? "Dernière connexion " + formatDistance(user.lastConnection, new Date(), { locale: frLocale })
    : "Jamais connecté"

  return (
    <Grid container sx={{ width: "100%" }} spacing={{ xs: 1, sm: 2 }} alignItems="center">
      <Grid xs={12} sm={6} md={3}>
        <Typography variant="body1" component="h2">
          <strong>{user.name}</strong>
        </Typography>
      </Grid>
      <Grid xs={12} sm={6} md={3}>
        <Typography variant="body1">{user.email}</Typography>
      </Grid>
      <Grid xs={4} sm={2} md={2}>
        {user.isActive ? (
          user.role == "ADMIN" ? (
            <Chip color="error" label={user.roleText} />
          ) : (
            <Chip color="primary" label={user.roleText} />
          )
        ) : (
          <Chip variant="outlined" label="inactif" />
        )}
      </Grid>
      <Grid xs={8} sm={10} md={4}>
        <Typography variant="body1" component="em">
          {lastConnection}
        </Typography>
      </Grid>
    </Grid>
  )
}
