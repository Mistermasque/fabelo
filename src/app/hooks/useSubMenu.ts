import { createGlobalState } from "react-hooks-global-state"

export type SubMenuType = {
  icon: "MoreVert" | "Search" | false
  onClick?: () => void
}

const initialState: SubMenuType = { icon: "MoreVert" }

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
