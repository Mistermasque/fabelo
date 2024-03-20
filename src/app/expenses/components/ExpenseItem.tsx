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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { ExpenseWithTotalAmount } from "../queries/getExpenses"
import { Delete, Edit, ExpandMore, MoreVert, Remove } from "@mui/icons-material"
import { useState, MouseEvent } from "react"
import { useConfirm } from "material-ui-confirm"
import Link from "next/link"

export interface ExpenseItemsProps {
  expense: ExpenseWithTotalAmount
  onDelete: (id: number) => void
  onEdit: (id: number) => void
}

export const ExpenseItem = ({ expense, onDelete, onEdit }: ExpenseItemsProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [menuAnchorElt, setMenuAnchorElt] = useState<null | HTMLElement>(null)
  const confirm = useConfirm()

  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"))

  const isMenuOpened = Boolean(menuAnchorElt)

  const handleToggleDetails = () => {
    setIsExpanded(!isExpanded)
  }

  const handleClickDelete = () => {
    handleMenuClose()
    confirm({
      title: "Êtes-vous sûr ?",
      description: "Cette action supprimera la dépense sans possibiltié de récupération !",
      cancellationText: "Annuler",
      confirmationText: "Oui, supprimer",
      confirmationButtonProps: { color: "error" },
    }).then(() => {
      onDelete(expense.id)
    })
  }

  const handleClickEdit = () => {
    handleMenuClose()
    onEdit(expense.id)
  }

  const handleClickMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorElt(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchorElt(null)
  }

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} alignItems={{ xs: "flex-start", sm: "center" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          flexGrow={1}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Typography variant="h5" component="h2">
            {expense.title}
          </Typography>
          {expense.refund ? (
            <Chip
              color={expense.refund.isValidated ? "success" : undefined}
              label={
                expense.refund.date
                  ? "Remboursé le : " + expense.refund.date
                  : "En attente remboursement"
              }
            />
          ) : (
            <Chip variant="outlined" label="Non remboursé" />
          )}
        </Stack>
        <Typography variant="h5">
          <strong>{expense.totalAmount + " €"}</strong>
        </Typography>
        <Box>
          {isDesktop ? (
            <>
              <Link href={`/expenses/${expense.id}/edit`} passHref legacyBehavior>
                <IconButton component="a">
                  <Edit />
                </IconButton>
              </Link>
              <IconButton color="error" onClick={handleClickDelete}>
                <Delete />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton onClick={handleClickMenu}>
                <MoreVert />
              </IconButton>
              <Menu open={isMenuOpened} onClose={handleMenuClose} anchorEl={menuAnchorElt}>
                <Link href={`/expenses/${expense.id}/edit`} passHref legacyBehavior>
                  <MenuItem onClick={handleClickEdit}>
                    <ListItemIcon>
                      <Edit />
                    </ListItemIcon>
                    <ListItemText>Editer</ListItemText>
                  </MenuItem>
                </Link>
                <MenuItem onClick={handleClickDelete}>
                  <ListItemIcon>
                    <Delete />
                  </ListItemIcon>
                  <ListItemText>Supprimer</ListItemText>
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <ToggleButton
          size="small"
          value="isExpanded"
          selected={isExpanded}
          onChange={handleToggleDetails}
        >
          <ExpandMore />
        </ToggleButton>
        <Typography variant="subtitle1">{"Payé par : " + expense.user.name}</Typography>
      </Stack>
      <Collapse in={isExpanded}>
        <Stack spacing={1}>
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
                  {expense.details.map((detail, index) => (
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
                  {expense.parts.map((part, index) => (
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
        </Stack>
      </Collapse>
    </Stack>
  )
}
