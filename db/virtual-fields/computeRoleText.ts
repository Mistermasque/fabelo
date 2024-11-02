import { Role } from "@/src/app/types"

// Type nécessitant la présence du rôle
type User = {
  role: Role | null
}

// On étend le type générique T pour y ajouter le montant total
export type WithRoleText<T> = T & {
  roleText: string
}

/**
 * Fonction permettant d'ajouter le role texte au User
 * @param user : l'utilisateur
 * @returns l'objet user avec le roleText ajouté
 */
export default function computeRoleText<T extends User>(user: T): WithRoleText<T> {
  let roleText = "inconnu"
  switch (user.role) {
    case "USER":
      roleText = "utilisateur"
      break
    case "ADMIN":
      roleText = "administrateur"
      break
  }

  return { ...user, roleText }
}
