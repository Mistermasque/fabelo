import { User } from "@prisma/client"
import { ExpenseWithTotalAmount } from "app/expenses/queries/getExpensesWithTotalAmount"

type UserId = number
export type Balance = {
  user: User
  totalPaid: number
  totalPart: number
  balance: number
  reimburseTo: { user: User; amount: number }[]
  reimburseFrom: { user: User; amount: number }[]
}

/**
 * Calcule la balance de chaque utilisateur et combien chacun doit aux autres utiliateurs
 * cette fonction considère que les montants des parts de chaque utilisateur est bonne (pas d'erreur dans les parts)
 * @param expenses Liste des dépenses avec les détails et les utilisateurs
 * @returns la balance calculée au format :
 * [
 *  {
 *    user: utilisateur
 *    totalPaid : le montant total payé par l'utilisateur pour toutes les dépenses
 *    totalPart : la part totale de l'utilisateur pour les dépenses
 *    balance : le montant pour que l'utilisateur arrive à l'équilibre.
 *              - si négative l'utilisateur doit de l'argent au groupe
 *              - si positive l'utilisateur doit recevoir de l'argent du groupe
 *    reimburseTo : Liste des utilisateurs et des montants à rembourser (si balance négative)
 *      [
 *        {
 *          user: l'utilisateur
 *          amount : le montant à rembourser
 *        }
 *      ]
 *    reimburseFrom : Liste des utilisateurs et des montants qui doivent le rembourser (si balance positive)
 *      [
 *        {
 *          user: l'utilisateur
 *          amount : le montant qui doit lui être remboursé
 *        }
 *      ]
 *  }
 * ]
 */
export function calculateBalance(expenses: ExpenseWithTotalAmount[]): Balance[] {
  const balances = new Map<UserId, Balance>()

  function addUser(user: User, { paid = 0, part = 0 }: { paid?: number; part?: number }) {
    const balance = balances.get(user.id)
    const nTotalPaid = balance ? paid + balance.totalPaid : paid
    const nTotalPart = balance ? part + balance.totalPart : part
    const nBalance = nTotalPaid - nTotalPart

    balances.set(user.id, {
      user: user,
      totalPaid: nTotalPaid,
      totalPart: nTotalPart,
      balance: nBalance,
      reimburseTo: [],
      reimburseFrom: [],
    })
  }

  for (const expense of expenses) {
    const payorId = expense.userId

    for (const part of expense.parts) {
      if (part.userId == payorId) {
        addUser(expense.user, { paid: expense.totalAmount, part: Number(part.amount) })
      } else {
        addUser(part.user, { part: Number(part.amount) })
      }
    }
  }

  // Calcul du montant que chaque utilisateur doit aux autres utilisateurs.
  // Pour cela on stocke d'un côté la liste des utilisateurs devant de l'argent (ceux avec une balance négative)
  // et les utilisateurs qui doivent recevoir de l'argent (ceux avec une balance positive)
  // On boucle sur les utilisateurs à qui l'on doit de l'argent et on recherche dans les utilisateurs qui doivent de
  // l'argent pour soustraire le montant qu'ils doivent
  const usersWithPositiveBalance: { user: User; balance: number }[] = []
  const usersWithNegativeBalance: { user: User; balance: number }[] = []

  balances.forEach((balance) => {
    if (balance.balance > 0) {
      usersWithPositiveBalance.push({ user: balance.user, balance: balance.balance })
    }
    if (balance.balance < 0) {
      usersWithNegativeBalance.push({ user: balance.user, balance: balance.balance })
    }
  })

  usersWithPositiveBalance.map((userWithPositiveBalance) => {
    let userToBePaidBalance = userWithPositiveBalance.balance

    usersWithNegativeBalance.map((userWithNegativeBalance) => {
      if (userWithNegativeBalance.balance == 0 || userToBePaidBalance == 0) {
        return userWithNegativeBalance
      }

      // La balance de userWithNegativeBalance est forcément négative on calcule la différence
      // Si < 0 : l'utilisateur avec la balance negative doit rembourser (au total) plus que ce que l'utilisateur en balance positive doit recevoir
      // Si > 0 : l'utilisateur avec la balance negative ne peut pas tout rembourser ce que l'utilisateur en balance positive doit recevoir
      // Si = 0 : l'utilisateur en balance négative doit exactement la somme pour l'utilisateur en balance positive
      const repaymentBalance = userToBePaidBalance - userWithNegativeBalance.balance
      const repaymentAmount =
        repaymentBalance <= 0 ? userToBePaidBalance : -1 * userWithNegativeBalance.balance

      // On déduit ce qui a été remboursé
      userWithNegativeBalance.balance + repaymentAmount
      userToBePaidBalance - repaymentAmount

      // On ajoute les infos à l'objet de retour
      // On cast en Balance le retour du get car on est sûr que l'objet balances renverra une valeur
      const userToBeReimbursedBalance = balances.get(userWithPositiveBalance.user.id) as Balance
      userToBeReimbursedBalance.reimburseFrom.push({
        user: userWithNegativeBalance.user,
        amount: repaymentAmount,
      })
      balances.set(userWithPositiveBalance.user.id, userToBeReimbursedBalance)

      const userWhoReimburseBalance = balances.get(userWithNegativeBalance.user.id) as Balance
      userWhoReimburseBalance.reimburseTo.push({
        user: userWithPositiveBalance.user,
        amount: repaymentAmount,
      })
      balances.set(userWithNegativeBalance.user.id, userWhoReimburseBalance)
    })
  })

  return Array.from(balances.values(), (balance) => balance).sort(compare)
}

function compare(a: Balance, b: Balance) {
  const aVal = a.user.name && b.user.name ? a.user.name : a.user.id
  const bVal = a.user.name && b.user.name ? b.user.name : b.user.id
  if (aVal < bVal) {
    return -1
  }
  if (aVal > bVal) {
    return 1
  }
  return 0
}
