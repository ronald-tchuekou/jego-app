import { create } from 'zustand'

export type LogoutModalState = {
   isVisible: boolean
   closeModal: VoidFunction
}

export const useLogoutModalStore = create<LogoutModalState>((set) => ({
   isVisible: false,
   closeModal() {
      set({ isVisible: false })
   },
}))

export function confirmLogout() {
   useLogoutModalStore.setState({ isVisible: true })
}
