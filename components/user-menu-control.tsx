'use client'

import * as React from 'react'

type UserMenuControl = {
  openUserMenu: () => void
}

const UserMenuControlContext = React.createContext<UserMenuControl | null>(null)

export function UserMenuControlProvider({
  children,
  openUserMenu,
}: {
  children: React.ReactNode
  openUserMenu: () => void
}) {
  const value = React.useMemo(() => ({ openUserMenu }), [openUserMenu])
  return (
    <UserMenuControlContext.Provider value={value}>{children}</UserMenuControlContext.Provider>
  )
}

export function useUserMenuControl() {
  return React.useContext(UserMenuControlContext)
}
