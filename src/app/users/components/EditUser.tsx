"use client"
import updateUser from "../mutations/updateUser"
import getUser from "../queries/getUser"
import { UpdateUserSchema } from "../schemas"
import { FORM_ERROR, UserForm } from "./UserForm"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"

export const EditUser = ({ userId }: { userId: number }) => {
  const [user, { setQueryData }] = useQuery(
    getUser,
    { id: userId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateUserMutation] = useMutation(updateUser)
  const router = useRouter()

  const initialValues = user

  return (
    <UserForm
      expenses={user.expenses}
      submitText="Mettre à jour le remboursement"
      initialValues={initialValues}
      schema={UpdateUserSchema}
      onSubmit={async (values) => {
        try {
          const user = await updateUserMutation(values)
          router.push("/users")
        } catch (error: any) {
          return {
            [FORM_ERROR]: error.toString(),
          }
        }
      }}
    />
  )
}
