import { Chip } from "@mui/material"

interface RefundDateProps {
  refund?: {
    isValidated: boolean
    date: Date | null
  } | null
}

export function RefundDate({ refund }: RefundDateProps) {
  if (refund === undefined) {
    return null
  }

  if (refund === null) {
    return <Chip variant="outlined" label="Non remboursé" />
  }

  return (
    <Chip
      color={refund.isValidated ? "success" : "primary"}
      label={
        refund.date
          ? "Remboursé le : " + refund.date.toLocaleDateString()
          : "En attente remboursement"
      }
    />
  )
}
