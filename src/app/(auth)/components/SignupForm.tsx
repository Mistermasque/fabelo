"use client"
import { Form, FORM_ERROR } from "src/app/components/Form"
import signup from "../mutations/signup"
import { Signup } from "../validations"
import { useMutation } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import { Field } from "formik"
import { TextField } from "formik-mui"

type SignupFormProps = {
  onSuccess?: () => void
}

export const SignupForm = (props: SignupFormProps) => {
  const [signupMutation] = useMutation(signup)
  const router = useRouter()

  return (
    <div>
      <h1>Create an Account</h1>

      <Form
        submitText="Create Account"
        schema={Signup}
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          try {
            await signupMutation(values)
            router.refresh()
            router.push("/")
          } catch (error: any) {
            if (error.code === "P2002" && error.meta?.target?.includes("email")) {
              // This error comes from Prisma
              return { email: "This email is already being used" }
            } else {
              return { [FORM_ERROR]: error.toString() }
            }
          }
        }}
      >
        <Field component={TextField} name="email" label="Email" placeholder="Email" />
        <Field
          component={TextField}
          name="password"
          label="Password"
          placeholder="Password"
          type="password"
        />
      </Form>
    </div>
  )
}
