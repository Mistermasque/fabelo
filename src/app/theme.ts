import { createTheme } from "@mui/material/styles"
import { frFR as coreFrFr } from "@mui/material/locale"
import { frFR as dateFrFr } from "@mui/x-date-pickers/locales"

/**
 * Création du thème globale avec les traductions en français
 */
export const theme = createTheme(
  {},
  dateFrFr, // x-date-pickers translations
  coreFrFr // core translations
)
