import { Menu, MenuItem, shell } from 'electron';

import storage from 'electron-json-storage';

export const applicationMenu = () => {
  const menu = Menu.getApplicationMenu()
  if (!menu) {
    return menu
  }

  menu.items.find(m => m.role?.toLowerCase() === 'windowmenu')?.submenu?.append(
    new MenuItem({
      label: 'Open App Storage',
      click: () => {
        shell.showItemInFolder(storage.getDataPath())
      }
    })
  )
  return menu
}
