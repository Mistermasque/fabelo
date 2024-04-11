import { useSubMenu } from "@/src/app/hooks/useSubMenu"
import { theme } from "@/src/app/theme"
import { MoreVert, Search } from "@mui/icons-material"
import { IconButton, IconButtonProps } from "@mui/material"

interface SubMenuButtonProps extends Omit<IconButtonProps, "onClick"> {}

export function SubMenuButton(props: SubMenuButtonProps) {
  const defaultProps: IconButtonProps = {
    color: "inherit",
  }

  const [menu] = useSubMenu()

  if (menu === undefined || menu?.icon === false) {
    return null
  }

  props = {
    ...defaultProps,
    ...props,
  }

  return (
    <IconButton {...props} onClick={menu.onClick}>
      {
        {
          MoreVert: <MoreVert />,
          Search: <Search />,
        }[menu.icon]
      }
    </IconButton>
  )
}
