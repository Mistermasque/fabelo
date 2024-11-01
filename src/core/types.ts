import { SimpleRolesIsAuthorized } from "@blitzjs/auth"
import { User } from "@/db"
import type { Role } from "@/src/app/users/schemas"
/**
 * Type utilitaire permettant de dériver d'un type en rendant une propriété facultative
 * Ex: type MakePersonInput = PartialBy<{name: string, id: number}, 'name'> -> {name?: string, id: number}
 * https://stackoverflow.com/questions/43159887/make-a-single-property-optional-in-typescript
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Type utilitaire permettant de récupérer le type d'un élément d'un tableau
 * Ex: type A = ArrayElement<string[]>; -> string
 * https://stackoverflow.com/questions/41253310/typescript-retrieve-element-type-information-from-array-type
 */
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never

export type { Role } from "@/src/app/users/schemas"

declare module "@blitzjs/auth" {
  export interface Session {
    isAuthorized: SimpleRolesIsAuthorized<Role>
    PublicData: {
      userId: User["id"]
      role: Role
      views?: number
    }
  }
}
