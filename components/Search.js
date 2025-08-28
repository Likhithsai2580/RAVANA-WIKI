import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

/**
 * Search component for filtering and displaying documentation based on user input.
 *
 * This component maintains a search query and results state, filtering the provided docs based on the query.
 * It opens a dropdown to display results when the query length exceeds two characters and closes when clicking outside.
 * The user can navigate to the selected documentation by submitting the search form.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.docs - An array of documentation objects to search through.
 * @returns {JSX.Element} The rendered search component.
 */
const Search = ({ docs }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (query.length > 2) {
      const filtered = docs.filter(doc => 
        doc.title.toLowerCase().includes(query.toLowerCase()) ||
        doc.excerpt.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, docs]);

  // Close dropdown when clicking outside
  useEffect(() => {
    /**
     * Closes the search dropdown if the click is outside of the search reference.
     */
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  /**
   * Handles the search event and redirects to the first result's documentation.
   */
  const handleSearch = (e) => {
    e.preventDefault();
    if (results.length > 0) {
      window.location.href = `/docs/${results[0].slug}`;
    }
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 2 && setIsOpen(true)}
          placeholder="Search documentation..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-base-300 bg-base-200 text-base-content focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
        />
        <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-content" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </form>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-base-200 rounded-lg shadow-2xl border border-base-300 max-h-72 overflow-y-auto animate-fade-in">
          {results.length > 0 ? (
            <ul>
              {results.map((doc, index) => (
                <li key={doc.slug} style={{ animationDelay: `${index * 50}ms` }} className="animate-slide-in-up">
                  <Link 
                    href={`/docs/${doc.slug}`}
                    className="block px-4 py-3 hover:bg-base-300 border-b border-base-300 last:border-b-0 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="font-medium text-primary">{doc.title}</div>
                    <div className="text-sm text-neutral-content truncate">{doc.excerpt}</div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-neutral-content">No results found for "{query}"</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;