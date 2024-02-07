import { createGlobalState } from "react-hooks-global-state"

const { useGlobalState } = createGlobalState({ pageTitle: "" })

/**
 * Hook utilisé pour définir le titre de la page
 * @param initial
 * @returns [title: string, (title: string) => void]
 */
export function usePageTitle(initial?: string): {
  pageTitle: string | undefined
  setPageTitle: (title: string) => void
} {
  const [pageTitle, setPageTitle] = useGlobalState("pageTitle")

  return { pageTitle, setPageTitle }
}
