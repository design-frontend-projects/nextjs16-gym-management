import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  currentTenantId: string | null;
  setCurrentTenantId: (id: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      currentTenantId: null,
      setCurrentTenantId: (id) => set({ currentTenantId: id }),
    }),
    {
      name: "gym-mgmt-storage",
    },
  ),
);
