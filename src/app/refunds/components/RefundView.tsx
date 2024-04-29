"use client"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import { SubMenu } from "app/components/layout/SubMenu"
import deleteRefund from "../mutations/deleteRefund"
import getRefund from "../queries/getRefund"
import { useConfirm } from "material-ui-confirm"
import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material"
import { ArrowBack, ArrowForward, Delete, Edit } from "@mui/icons-material"
import { useEffect } from "react"
import { usePageTitle } from "app/hooks/usePageTitle"
import Grid from "@mui/material/Unstable_Grid2"
import { BalancesDetails } from "./BalancesDetails"
import Link from "next/link"
import { ExpenseItem } from "app/expenses/components/ExpenseItem"

export interface RefundViewProps {
  refundId: number
}

export function RefundView({ refundId }: RefundViewProps) {
  const router = useRouter()
  const [deleteRefundMutation] = useMutation(deleteRefund)
  const [refund] = useQuery(getRefund, { id: refundId })

  const confirm = useConfirm()

  const { setPageTitle } = usePageTitle()

  useEffect(() => {
    setPageTitle("Remboursement #" + refund.id)
  })

  const handleClickEdit = () => {
    router.push(`/refunds/${refund.id}/edit`)
  }

  const handleClickDelete = () => {
    confirm({
      title: "Êtes-vous sûr ?",
      description: "Cette action supprimera la dépense sans possibiltié de récupération !",
      cancellationText: "Annuler",
      confirmationText: "Oui, supprimer",
      confirmationButtonProps: { color: "error" },
    }).then(async () => {
      await deleteRefundMutation({ id: refund.id })
      router.push("/refunds")
    })
  }

  const handleGoBackClick = () => {
    if (window.history.length > 0) {
      router.back()
    } else {
      router.push("/refunds")
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
            {"Remboursement du " + refund.createdAt.toLocaleDateString()}
          </Typography>
        </Stack>
        <Typography component="em" variant="body2">
          {"Dernière modification le " +
            refund.updatedAt.toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: (theme) => theme.palette.secondary.main }}>
          Total des dépenses : <strong>{refund.totalAmount + " €"}</strong>
        </Typography>
        <BalancesDetails balances={refund.balances} />
        <Typography component="h3" variant="h5">
          Liste des dépenses
        </Typography>
        <List>
          {refund.expenses.map((expense) => (
            <ListItem
              key={expense.id}
              sx={{
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.action.hover,
                },
              }}
              secondaryAction={
                <Link href={`/expenses/${expense.id}`} passHref>
                  <IconButton edge="end" aria-label="voir dépense">
                    <ArrowForward />
                  </IconButton>
                </Link>
              }
            >
              <ExpenseItem expense={expense} />
            </ListItem>
          ))}
        </List>
      </Stack>
    </>
  )
}
