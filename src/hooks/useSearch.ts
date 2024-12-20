import { create } from 'zustand';

interface SearchStore {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const useSearchStore = create<SearchStore>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

export function useSearch() {
  const searchQuery = useSearchStore((state) => state.searchQuery);
  const setSearchQuery = useSearchStore((state) => state.setSearchQuery);

  return {
    searchQuery,
    setSearchQuery,
  };
}