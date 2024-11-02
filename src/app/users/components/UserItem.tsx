import { Chip, Typography } from "@mui/material"
import Grid from "@mui/material/Unstable_Grid2"
import { formatDistanceToNowStrict } from "date-fns"
import { fr as frLocale } from "date-fns/locale/fr"
import { Role, UserStatus } from "../schemas"
import { Person, PersonOff, PersonOutline } from "@mui/icons-material"

export interface UserItemProps {
  user: {
    id: number
    name: string
    status: UserStatus
    email: string
    role: Role | null
    lastConnection: Date | null
    roleText: string
    statusText: string
  }
}
/**
 * Affiche le détail d'un utilisateur à mettre dans un item de List
 */
export function UserItem({ user }: UserItemProps) {
  const lastConnection = user.lastConnection
    ? "Dernière connexion " + formatDistanceToNowStrict(user.lastConnection, { locale: frLocale })
    : "Jamais connecté"

  return (
    <Grid container sx={{ width: "100%" }} spacing={1} alignItems="center">
      <Grid container xs={12} sm={12} md={6}>
        <Grid flexGrow={{ xs: 1, sm: 1 }} md={2}>
          <Typography variant="body1" component="h2">
            <strong>{user.name}</strong>
          </Typography>
        </Grid>

        <Grid
          sx={{
            display: { xs: "inherit", sm: "none", md: "none" },
          }}
        >
          <RoleAndStatusChip user={user} />
        </Grid>

        <Grid
          sx={{
            display: { xs: "none", sm: "inherit", md: "inherit" },
          }}
          md={2}
        >
          <RoleChip user={user} />
        </Grid>
        <Grid
          sx={{
            display: { xs: "none", sm: "inherit", md: "inherit" },
          }}
          md={2}
        >
          <StatusChip user={user} />
        </Grid>
      </Grid>
      <Grid sm={6} md={3}>
        <Typography variant="body1">{user.email}</Typography>
      </Grid>
      <Grid sm={6} md={3}>
        <Typography variant="body1" component="em">
          {lastConnection}
        </Typography>
      </Grid>
    </Grid>
  )
}

const RoleChip = ({ user }: UserItemProps) => {
  switch (user.role) {
    case "ADMIN":
      return <Chip color="error" label={user.roleText} />
    case "USER":
      return <Chip label={user.roleText} />
    case null:
      return <Chip variant="outlined" label={user.roleText} />
  }
}

const StatusChip = ({ user }: UserItemProps) => {
  switch (user.status) {
    case "DISABLED":
      return <Chip label={user.statusText} />
    case "ACTIVE":
      return <Chip color="primary" label={user.statusText} />
    case "NOT_ACTIVATED":
      return <Chip color="primary" variant="outlined" label={user.statusText} />
  }
}

const RoleAndStatusChip = ({ user }: UserItemProps) => {
  const title = user.roleText + " - " + user.statusText

  if (user.status == "DISABLED") {
    return (
      <Chip
        sx={{ paddingLeft: "0.7em", marginRight: "-1.5em" }}
        icon={<PersonOff />}
        variant="outlined"
        title={title}
      />
    )
  }

  const variant = user.status === "NOT_ACTIVATED" ? "outlined" : undefined
  const icon = user.status === "NOT_ACTIVATED" ? <PersonOutline /> : <Person />
  const color = user.role === "ADMIN" ? "error" : undefined

  return (
    <Chip
      sx={{ paddingLeft: "0.7em", marginRight: "-1.5em" }}
      color={color}
      variant={variant}
      icon={icon}
      title={title}
    />
  )
}
