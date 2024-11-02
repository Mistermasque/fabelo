import { z } from "zod"
import { RoleField } from "app/users/schemas"

export const EmailField = z
  .string()
  .min(1)
  .email()
  .transform((str) => str.toLowerCase().trim())

export const PasswordField = z
  .string()
  .min(10)
  .max(100)
  .transform((str) => str.trim())
  .refine(
    (password) => {
      const containsUppercase = (ch: string) => /[A-Z]/.test(ch)
      const containsLowercase = (ch: string) => /[a-z]/.test(ch)
      const containsSpecialChar = (ch: string) =>
        /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch)
      let countOfUpperCase = 0,
        countOfLowerCase = 0,
        countOfNumbers = 0,
        countOfSpecialChar = 0
      for (let i = 0; i < password.length; i++) {
        let ch = password.charAt(i)
        if (!isNaN(+ch)) countOfNumbers++
        else if (containsUppercase(ch)) countOfUpperCase++
        else if (containsLowercase(ch)) countOfLowerCase++
        else if (containsSpecialChar(ch)) countOfSpecialChar++
      }
      return (
        countOfLowerCase >= 1 &&
        countOfUpperCase >= 1 &&
        countOfSpecialChar >= 1 &&
        countOfNumbers >= 1
      )
    },
    { message: "Le mot de passe n'est pas assez complexe" }
  )

export const RegisterSchema = z.object({
  email: EmailField,
  role: RoleField.nullable().optional(),
})

export const ActivateSchema = z
  .object({
    password: PasswordField,
    confirmPassword: PasswordField,
    name: z.string().min(1),
    token: z.string().optional(),
  })
  .refine((data) => data.password == data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"], // Pointing out which field is invalid
  })

export const ResetActivationSchema = z.object({
  email: EmailField,
})

export const LoginSchema = z.object({
  email: EmailField,
  password: z.string(),
})

export const ForgotPasswordSchema = z.object({
  email: EmailField,
})

export const ResetPasswordSchema = z
  .object({
    password: PasswordField,
    confirmPassword: PasswordField,
    token: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"], // Pointing out which field is invalid
  })

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: PasswordField,
    confirmPassword: PasswordField,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"], // Pointing out which field is invalid
  })
