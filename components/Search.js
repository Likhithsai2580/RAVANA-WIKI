import { useState, useEffect } from 'react';
import Link from 'next/link';

const Search = ({ docs }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (results.length > 0) {
      // Navigate to the first result
      window.location.href = `/docs/${results[0].slug}`;
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search documentation..."
          className="w-full px-4 py-2 rounded-lg border border-wiki-border bg-wiki-content-bg text-wiki-text-light focus:outline-none focus:ring-2 focus:ring-wiki-blue focus:border-transparent"
        />
      </form>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-wiki-content-bg rounded-lg shadow-lg border border-wiki-border max-h-60 overflow-y-auto">
          {results.length > 0 ? (
            <ul>
              {results.map((doc) => (
                <li key={doc.slug}>
                  <Link 
                    href={`/docs/${doc.slug}`}
                    className="block px-4 py-3 hover:bg-wiki-content-bg-hover border-b border-wiki-border last:border-b-0"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="font-medium text-wiki-blue">{doc.title}</div>
                    <div className="text-sm text-wiki-text-muted truncate">{doc.excerpt}</div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-wiki-text-muted">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;