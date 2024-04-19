import { Forward } from "@mui/icons-material"
import { Alert, Divider, Stack, Theme, Typography } from "@mui/material"
import Grid from "@mui/material/Unstable_Grid2"
import { Balance } from "@/db/virtual-fields/computeBalances"
import { Fragment } from "react"

export interface BalancesDetailsProps {
  balances: Balance[]
}

function BalanceText({ value }: { value: number }) {
  const color = (theme: Theme) => {
    if (value > 0) {
      return theme.palette.success.main
    } else if (value < 0) {
      return theme.palette.error.main
    }

    return theme.palette.info.main
  }

  return (
    <Typography component="span" sx={{ color: color }}>
      {value}&nbsp;€
    </Typography>
  )
}

export function BalancesDetails({ balances }: BalancesDetailsProps) {
  if (balances.length == 0) {
    return (
      <Alert severity="warning">
        Aucune dépense sélectionnée. Merci d&apos;en sélectionner au moins une
      </Alert>
    )
  }

  return (
    <Grid container spacing={1}>
      {balances.map((balance, index) => {
        return (
          <Fragment key={index}>
            <Grid xs={5} sm={4} md={3} lg={2}>
              <strong>{balance.user.name}&nbsp;:</strong>
            </Grid>
            <Grid container columnSpacing={1} xs={7} sm={8} md={3} lg={2}>
              <Grid xs={12} sm={6} md={12}>
                Dépense totale =&nbsp;{balance.totalPaid}&nbsp;€
              </Grid>
              <Grid xs={12} sm={6} md={12}>
                Balance =&nbsp;
                <BalanceText value={balance.balance} />
              </Grid>
            </Grid>
          </Fragment>
        )
      })}
      <Grid xs={12}>
        <Divider />
      </Grid>
      <Grid xs={12} sm={4} md={3} lg={2}>
        <em>Pour équilibrer :</em>
      </Grid>
      <Grid xs={12} sm={8} md={9} lg={10}>
        <Stack
          direction={{ xs: "row", sm: "column" }}
          divider={<Divider flexItem orientation="vertical" sx={{ xs: { display: "none" } }} />}
        >
          {balances.map((balance, index) => {
            if (balance.reimburseTo.length == 0) {
              return null
            }
            return balance.reimburseTo.map((reimburseTo, index) => {
              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {balance.user.name} <strong>&nbsp;{reimburseTo.amount}&nbsp;€&nbsp;</strong>
                  <Forward /> {reimburseTo.user.name}
                </div>
              )
            })
          })}
        </Stack>
      </Grid>
    </Grid>
  )
}
