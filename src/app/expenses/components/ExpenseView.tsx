"use client"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import { usePageTitle } from "app/hooks/usePageTitle"
import getExpense from "../queries/getExpense"
import { useEffect } from "react"
import deleteExpense from "../mutations/deleteExpense"
import {
  Box,
  Button,
  Chip,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material"
import Grid from "@mui/material/Unstable_Grid2"
import { Delete, Edit, FactCheck } from "@mui/icons-material"
import { RefundDate } from "app/refunds/components/RefundDate"
import Link from "next/link"
import { SubMenu } from "../../components/layout/SubMenu"
import { useConfirm } from "material-ui-confirm"
import { Decimal } from "@prisma/client/runtime/library"
import { ExpenseDetail, ExpenseUserPart } from "@prisma/client"

export interface ExpenseViewProps {
  expenseId: number
}

export function ExpenseView({ expenseId }: ExpenseViewProps) {
  const [expense] = useQuery(
    getExpense,
    { id: expenseId },
    {
      // This ensures the query never refreshes
      staleTime: Infinity,
    }
  )

  const confirm = useConfirm()

  const { setPageTitle } = usePageTitle()

  useEffect(() => {
    setPageTitle("Dépense #" + expense.id)
  })

  const router = useRouter()
  const [deleteExpenseMutation] = useMutation(deleteExpense)

  const handleClickEdit = () => {
    router.push(`/expenses/${expense.id}/edit`)
  }

  const handleClickDelete = () => {
    confirm({
      title: "Êtes-vous sûr ?",
      description: "Cette action supprimera la dépense sans possibilité de récupération !",
      cancellationText: "Annuler",
      confirmationText: "Oui, supprimer",
      confirmationButtonProps: { color: "error" },
    }).then(async () => {
      await deleteExpenseMutation({ id: expense.id })
      router.push("/expenses")
    })
  }
  const handleGoBackClick = () => {
    if (window.history.length > 0) {
      router.back()
    } else {
      router.push("/expenses")
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
      <Grid container spacing={1} sx={{ width: "100%" }}>
        <Grid container xs={12} alignItems="center">
          <Grid flexGrow={1}>
            <Typography component="h2" variant="h5">
              {expense.title}
            </Typography>
          </Grid>
          <Grid>
            <Chip
              label={expense.totalAmount + " €"}
              color={expense.totalAmount >= 0 ? "error" : "success"}
            />
          </Grid>
        </Grid>
        <Grid xs={12}>
          <Typography component="em" variant="body2">
            {"Créée le " +
              expense.createdAt.toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              }) +
              ", modifiée le " +
              expense.updatedAt.toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
          </Typography>
        </Grid>
        <Grid container alignItems="center" xs={12} columnSpacing={2}>
          <Grid>
            <Typography variant="body1">
              <strong>{"Payé par : " + expense.user.name}</strong>
            </Typography>
          </Grid>
          {expense.refund ? (
            <>
              <Grid>
                <RefundDate refund={expense.refund} />
              </Grid>
              <Grid>
                <Link href={`/refunds/${expense.refund.id}`} passHref>
                  <Button size="small" color="secondary" startIcon={<FactCheck />}>
                    Voir le remboursement
                  </Button>
                </Link>
              </Grid>
            </>
          ) : null}
        </Grid>
        <Grid xs={12} md={6}>
          <Typography component="h3" variant="h6">
            Détails
          </Typography>
          <Stack gap={1} divider={<Divider orientation="horizontal" flexItem />}>
            {expense.details.map((detail, index) => (
              <DetailItem key={index} detail={detail}></DetailItem>
            ))}
          </Stack>
        </Grid>
        <Grid xs={12} md={6}>
          <Typography component="h3" variant="h6">
            Parts
          </Typography>
          <Stack gap={1} divider={<Divider orientation="horizontal" flexItem />}>
            {expense.parts.map((part, index) => (
              <PartItem key={index} part={part} />
            ))}
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}

type DetailItemProps = {
  detail: ExpenseDetail
}

const DetailItem = ({ detail }: DetailItemProps) => {
  return (
    <Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        {detail.date.toLocaleDateString()}
        <Chip
          size="small"
          label={detail.amount + " €"}
          color={Number(detail.amount) >= 0 ? "error" : "success"}
          variant="outlined"
        />
      </Stack>
      <Typography component="p" variant="body1" whiteSpace="pre-wrap">
        {detail.comment}
      </Typography>
    </Stack>
  )
}

type PartItemProps = {
  part: {
    user: {
      name: string
    }
    part: number | Decimal | null
    amount: number | Decimal
  }
}
const PartItem = ({ part }: PartItemProps) => {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
      <Box flexGrow={1}>{part.user.name + " (" + part.part + " part)"}</Box>

      <Chip size="small" label={part.amount + " €"} variant="outlined" />
    </Stack>
  )
}
