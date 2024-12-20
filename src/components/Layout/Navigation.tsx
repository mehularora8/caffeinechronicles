import { SearchInput } from '../Search/SearchInput';
import { useSearch } from '../../hooks/useSearch';

export function Navigation() {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <nav className="flex items-center space-x-6">
      <SearchInput 
        value={searchQuery} 
        onChange={setSearchQuery}
        className="w-24 sm:w-48 md:w-64 lg:w-64"
      />
    </nav>
  );
}