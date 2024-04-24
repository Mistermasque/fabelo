import { ChevronRight, Delete, Edit, MoreVert } from "@mui/icons-material"
import {
  Box,
  Chip,
  Collapse,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import Grid from "@mui/material/Unstable_Grid2"
import { useConfirm } from "material-ui-confirm"
import Link from "next/link"
import router from "next/router"
import { useState, MouseEvent } from "react"
import { RefundDate, RefundDateProps } from "app/refunds/components/RefundDate"
import { Decimal } from "@prisma/client/runtime/library"

type Expense = {
  id: number
  totalAmount: number
  title: string
  details: DetailsProps["details"]
  parts: PartsProps["parts"]
  user: {
    name: string
  }
  refund?: RefundDateProps["refund"]
}

export interface ExpenseItemProps {
  expense: Expense
  onDelete?: (id: number) => void
  editable?: boolean
}

export function ExpenseItem({ expense, onDelete, editable }: ExpenseItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const moreInfos = MoreInfos({ expense })

  const handleToggleMoreInfos = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <Grid container spacing={1} sx={{ width: "100%" }}>
      <Grid container xs={9}>
        <Grid
          container
          spacing={0}
          columnSpacing={1}
          alignItems="flex-start"
          alignContent="flex-start"
          flexWrap="nowrap"
          sx={{ cursor: moreInfos ? "pointer" : "inherit" }}
          onClick={handleToggleMoreInfos}
        >
          <Grid>
            {moreInfos ? (
              <SvgIcon
                sx={{
                  transform: isExpanded ? "rotate(90deg)" : "none",
                  transition: "transform 330ms ease-in-out",
                }}
              >
                <ChevronRight />
              </SvgIcon>
            ) : null}
          </Grid>
          <Grid>
            <Typography variant="body1" component="h2">
              <strong>{expense.title}</strong>
            </Typography>
          </Grid>
        </Grid>
        <Grid container alignItems="center" xs={12}>
          <Grid>
            <Typography variant="body1" component="em">
              {"Payé par : " + expense.user.name}
            </Typography>
          </Grid>
          <Grid>
            <RefundDate refund={expense.refund !== undefined ? expense.refund : undefined} />
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={0}
        xs={3}
        direction={{ xs: "row-reverse" }}
        alignItems={{ xs: "center" }}
        alignContent={{ xs: "space-between" }}
        justifyContent={{ xs: "flex-start" }}
      >
        <Grid>
          <ActionMenu id={expense.id} onDelete={onDelete} editable={editable} />
        </Grid>
        <Grid>
          <Chip
            variant="outlined"
            label={expense.totalAmount + " €"}
            color={expense.totalAmount >= 0 ? "error" : "success"}
          />
        </Grid>
      </Grid>

      <Collapse in={isExpanded}>
        <Grid xs={12}>{moreInfos}</Grid>
      </Collapse>
    </Grid>
  )
}

interface ActionMenuProps {
  id: number
  onDelete?: (id: number) => void
  editable?: boolean
}

/**
 * Composant permettant d'afficher le menu d'action pour l'édition ou la suppresion de l'item
 * @param param0 Composant
 */
function ActionMenu({ id, editable, onDelete }: ActionMenuProps) {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"))
  const confirm = useConfirm()

  if (!editable && !onDelete) {
    return null
  }

  const handleClickDelete = onDelete
    ? () => {
        confirm({
          title: "Êtes-vous sûr ?",
          description: "Cette action supprimera la dépense sans possibiltié de récupération !",
          cancellationText: "Annuler",
          confirmationText: "Oui, supprimer",
          confirmationButtonProps: { color: "error" },
        }).then(() => {
          onDelete(id)
        })
      }
    : undefined

  return <ActionMenuMobile id={id} editable={editable} onDelete={handleClickDelete} />
  return (
    <>
      {isDesktop ? (
        <ActionMenuDesktop id={id} editable={editable} onDelete={handleClickDelete} />
      ) : (
        <ActionMenuMobile id={id} editable={editable} onDelete={handleClickDelete} />
      )}
    </>
  )
}

/**
 * Composant permettant d'afficher les boutons d'action pour la dépense pour l'affichage Desktop
 */
function ActionMenuDesktop({ id, editable, onDelete }: ActionMenuProps) {
  return (
    <Box>
      {editable ? (
        <Link href={`/expenses/${id}/edit`} passHref legacyBehavior>
          <IconButton component="a">
            <Edit />
          </IconButton>
        </Link>
      ) : null}
      {onDelete ? (
        <IconButton color="error" onClick={() => onDelete(id)}>
          <Delete />
        </IconButton>
      ) : null}
    </Box>
  )
}

/**
 * Composant permettant d'afficher les boutons sous forme d'un menu pour l'affichage mobile
 */
function ActionMenuMobile({ id, editable, onDelete }: ActionMenuProps) {
  const [menuAnchorElt, setMenuAnchorElt] = useState<null | HTMLElement>(null)

  let numberOfActiveActions = 0

  if (editable) {
    numberOfActiveActions++
  }

  if (onDelete) {
    numberOfActiveActions++
  }

  if (numberOfActiveActions == 1) {
    return ActionMenuDesktop({ id, editable, onDelete })
  }

  const isMenuOpened = Boolean(menuAnchorElt)

  const handleClickMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorElt(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchorElt(null)
  }

  const handleClickEdit = () => {
    handleMenuClose()
    router.push(`/expenses/${id}/edit`)
  }

  const handleClickDelete = () => {
    handleMenuClose()
    if (onDelete) {
      onDelete(id)
    }
  }

  return (
    <Box>
      <IconButton onClick={handleClickMenu}>
        <MoreVert />
      </IconButton>
      <Menu open={isMenuOpened} onClose={handleMenuClose} anchorEl={menuAnchorElt}>
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
      </Menu>
    </Box>
  )
}

interface MoreInfosProps {
  expense: Expense
}

/**
 * Affichage des détails
 * @param param0
 */
function MoreInfos({ expense }: MoreInfosProps) {
  if (!expense.details && !expense.parts) {
    return null
  }

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 2, md: 1 }}>
      <Details details={expense.details} />
      <Parts parts={expense.parts} />
    </Stack>
  )
}
interface DetailsProps {
  details?:
    | {
        amount: number | Decimal
        comment: string | null
        date: Date
      }[]
    | null
}
function Details({ details }: DetailsProps) {
  if (!details) {
    return null
  }

  return (
    <Paper>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell colSpan={3} align="center">
                Détails
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Commentaire</TableCell>
              <TableCell>Montant</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {details.map((detail, index) => (
              <TableRow hover key={index}>
                <TableCell>{detail.date.toLocaleDateString()}</TableCell>

                <TableCell>{detail.comment}</TableCell>
                <TableCell>{detail.amount + " €"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

interface PartsProps {
  parts?:
    | {
        part: number | Decimal | null
        amount: number | Decimal
        user: {
          name: string
        }
      }[]
    | null
}

function Parts({ parts }: PartsProps) {
  if (!parts) {
    return null
  }

  return (
    <Paper>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell colSpan={3} align="center">
                Parts
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Qui</TableCell>
              <TableCell>Part</TableCell>
              <TableCell>Montant</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parts.map((part, index) => (
              <TableRow hover key={index}>
                <TableCell>{part.user.name}</TableCell>
                <TableCell>{part.part?.toString()}</TableCell>
                <TableCell>{part.amount + " €"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}
