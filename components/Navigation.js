import Link from 'next/link';
import { useRouter } from 'next/router';

const Navigation = ({ docs }) => {
  const router = useRouter();
  
  // Group docs by first letter of title for easier navigation
  const groupedDocs = docs.reduce((acc, doc) => {
    const firstLetter = doc.title.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(doc);
    return acc;
  }, {});
  
  // Sort the groups alphabetically
  const sortedGroups = Object.keys(groupedDocs).sort();
  
  return (
    <nav className="w-full md:w-64 flex-shrink-0">
      <div className="bg-wiki-content-bg rounded-lg shadow-lg p-4 sticky top-4 border border-wiki-border">
        <h3 className="font-bold text-lg mb-3 text-wiki-text-light">Documentation</h3>
        <ul className="space-y-2">
          {sortedGroups.map(letter => (
            <li key={letter} className="mb-3">
              <div className="font-semibold text-wiki-accent mb-1">{letter}</div>
              <ul className="ml-2 mt-1 space-y-1">
                {groupedDocs[letter].map(doc => (
                  <li key={doc.slug}>
                    <Link 
                      href={`/docs/${doc.slug}`}
                      className={`block py-2 px-3 rounded-lg transition-all duration-200 ${
                        router.query.slug === doc.slug 
                          ? 'bg-wiki-blue text-white shadow-md' 
                          : 'text-wiki-text-muted hover:bg-wiki-content-bg-hover hover:text-wiki-text-light'
                      }`}
                    >
                      {doc.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;