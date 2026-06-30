import { create } from 'zustand'

interface FullPageState {
  currentSection: number
  isEnabled: boolean
  sectionIds: string[]
  setCurrentSection: (index: number) => void
  setEnabled: (enabled: boolean) => void
  setSectionIds: (ids: string[]) => void
  goToSectionById: (id: string) => void
}

export const useFullPageStore = create<FullPageState>((set, get) => ({
  currentSection: 0,
  isEnabled: false,
  sectionIds: [],
  setCurrentSection: (index) => set({ currentSection: index }),
  setEnabled: (enabled) => set({ isEnabled: enabled, currentSection: enabled ? get().currentSection : 0 }),
  setSectionIds: (ids) => set({ sectionIds: ids }),
  goToSectionById: (id) => {
    const { sectionIds } = get()
    let targetId = id
    if (id === 'home' || id === 'todos') targetId = 'home-hero'
    if (id === 'sustentabilidad') targetId = 'sustentabilidad-section'
    
    const index = sectionIds.indexOf(targetId)
    if (index !== -1) set({ currentSection: index })
  },
}))
