"use client"
import { useMutation, usePaginatedQuery } from "@blitzjs/rpc"
import Link from "next/link"
import { useRouter } from "next/navigation"
import getRefunds from "../queries/getRefunds"
import { useSearchParams } from "next/navigation"
import { usePathname } from "next/navigation"
import { Route } from "next"
import { Divider, Stack } from "@mui/material"
import deleteRefund from "../mutations/deleteRefund"
import { RefundItem } from "./RefundItem"
import { usePageTitle } from "app/hooks/usePageTitle"
import { useEffect } from "react"
import { useSnackbar } from "notistack"

const ITEMS_PER_PAGE = 100

export function RefundsList() {
  const { setPageTitle } = usePageTitle()
  const [deleteRefundMutation] = useMutation(deleteRefund)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    setPageTitle("Liste des remboursements")
  })

  const handleDeleteRefund = async (id: number) => {
    try {
      await deleteRefundMutation({ id })
      refetch()
    } catch (error: any) {
      enqueueSnackbar(error.message, { variant: "error" })
    }
  }

  const searchparams = useSearchParams()!
  const page = Number(searchparams.get("page")) || 0
  const [{ refunds, hasMore }, { refetch }] = usePaginatedQuery(getRefunds, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })
  const router = useRouter()
  const pathname = usePathname()

  const goToPreviousPage = () => {
    const params = new URLSearchParams(searchparams.toString())
    params.set("page", (page - 1).toString())
    router.push((pathname + "?" + params.toString()) as Route)
  }
  const goToNextPage = () => {
    const params = new URLSearchParams(searchparams.toString())
    params.set("page", (page + 1).toString())
    router.push((pathname + "?" + params.toString()) as Route)
  }

  return (
    <>
      {/* <SubMenuDrawerBox iconButton="Search">
        <ExpensesFilterForm onFilter={handleFilter} initialValues={getFiltersFromURL()} />
      </SubMenuDrawerBox> */}
      <Stack divider={<Divider flexItem variant="fullWidth" />} spacing={2}>
        {refunds.map((refund) => (
          <RefundItem key={refund.id} refund={refund} onDelete={handleDeleteRefund} editable />
        ))}
      </Stack>
    </>
  )
}
