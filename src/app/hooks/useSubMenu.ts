import { createGlobalState } from "react-hooks-global-state"
import { MouseEvent } from "react"

export type SubMenuType = {
  icon: "MoreVert" | "Search" | false
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
}

const initialState: SubMenuType = { icon: false }

const { useGlobalState } = createGlobalState({ subMenu: initialState })

/**
 * Hook utilisé pour définir le titre de la page
 * @param initial
 * @returns [title: string, (title: string) => void]
 */
export function useSubMenu(): readonly [
  subMenu: SubMenuType | undefined,
  setSubMenu: (subMenu: SubMenuType) => void
] {
  return useGlobalState("subMenu")
}
