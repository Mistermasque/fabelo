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
import { BalancesDetails, BalancesDetailsProps } from "./BalancesDetails"
import { RefundDate, RefundDateProps } from "./RefundDate"

type Refund = {
  id: number
  comment: string | null
  expenses: {
    id: number
    title: string
    totalAmount: number
    user: {
      name: string
    }
    details: {
      date: Date
    }[]
  }[]
  balances: BalancesDetailsProps["balances"]
} & RefundDateProps["refund"]

export interface RefundItemProps {
  refund: Refund
  onDelete?: (id: number) => void
  editable?: boolean
}

export function RefundItem({ onDelete, editable, refund }: RefundItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const moreInfos = MoreInfos({ refund })

  const handleToggleMoreInfos = () => {
    setIsExpanded(!isExpanded)
  }

  const totalAmount = refund.expenses
    ? refund.expenses.reduce((accumulator, expense) => {
        return accumulator + Number(expense.totalAmount)
      }, 0)
    : null

  return (
    <Grid container spacing={2} sx={{ width: "100%" }}>
      <Grid container xs={9}>
        <Grid
          container
          spacing={0}
          columnSpacing={1}
          alignItems="center"
          alignContent="flex-start"
          // flexWrap="nowrap"
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
                fontSize="large"
              >
                <ChevronRight />
              </SvgIcon>
            ) : null}
          </Grid>
          <Grid>
            <Typography variant="h6" component="h2">
              <strong>{"Remboursement #" + refund.id}</strong>
            </Typography>
          </Grid>
          <Grid>
            <RefundDate refund={refund} />
          </Grid>
        </Grid>

        <Grid>
          <BalancesDetails balances={refund.balances} />
        </Grid>
        <Grid>
          <Typography variant="body1">{refund.comment}</Typography>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={0}
        xs={3}
        direction={{ xs: "row-reverse", sm: "column" }}
        alignItems={{ xs: "center", sm: "flex-end" }}
        alignContent={{ xs: "space-between", sm: "flex-end" }}
        justifyContent={{ xs: "flex-start", sm: "space-between" }}
      >
        <Grid>
          <ActionMenu id={refund.id} onDelete={onDelete} editable={editable} />
        </Grid>
        <Grid>
          {totalAmount !== null ? (
            <Chip variant="outlined" label={totalAmount + " €"} color="error" />
          ) : null}
        </Grid>
      </Grid>
      <Grid xs={12}>
        <Collapse in={isExpanded}>{moreInfos}</Collapse>
      </Grid>
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
          description:
            "Cette action supprimera le remboursement sans possibiltié de récupération !",
          cancellationText: "Annuler",
          confirmationText: "Oui, supprimer",
          confirmationButtonProps: { color: "error" },
        }).then(() => {
          onDelete(id)
        })
      }
    : undefined

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
        <Link href={`/refunds/${id}/edit`} passHref legacyBehavior>
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
    router.push(`/refunds/${id}/edit`)
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
  refund: Refund
}

function MoreInfos({ refund }: MoreInfosProps) {
  if (!refund.expenses) {
    return null
  }

  return (
    <Paper>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Dépense</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Qui a payé</TableCell>
              <TableCell>Montant</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {refund.expenses.map((expense, index) => (
              <TableRow hover key={index}>
                <TableCell>{expense.title}</TableCell>
                <TableCell>{expense.details[0].date.toLocaleDateString()}</TableCell>
                <TableCell>{expense.user.name}</TableCell>
                <TableCell>{expense.totalAmount + " €"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}
