import { UserStatus } from "@/src/app/types"

// Type nécessitant la présence du status
type User = {
  status: UserStatus | null
}

// On étend le type générique T pour y ajouter le montant total
export type WithUserStatusText<T> = T & {
  statusText: string
}

/**
 * Fonction permettant d'ajouter le status texte au User
 * @param user : l'utilisateur
 * @returns l'objet user avec le statusText ajouté
 */
export default function computeUserStatusText<T extends User>(user: T): WithUserStatusText<T> {
  let statusText = "inconnu"
  switch (user.status) {
    case "NOT_ACTIVATED":
      statusText = "non activé"
      break
    case "ACTIVE":
      statusText = "actif"
      break
    case "DISABLED":
      statusText = "inactif"
      break
  }

  return { ...user, statusText }
}
