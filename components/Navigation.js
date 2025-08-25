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
      <div className="bg-white rounded-lg shadow p-4 sticky top-4">
        <h3 className="font-bold text-lg mb-3">Documentation</h3>
        <ul className="space-y-1">
          {sortedGroups.map(letter => (
            <li key={letter} className="mb-3">
              <div className="font-semibold text-gray-700">{letter}</div>
              <ul className="ml-2 mt-1 space-y-1">
                {groupedDocs[letter].map(doc => (
                  <li key={doc.slug}>
                    <Link 
                      href={`/docs/${doc.slug}`}
                      className={`block py-1 px-2 rounded hover:bg-gray-100 ${
                        router.query.slug === doc.slug ? 'bg-wiki-blue text-white' : 'text-gray-600'
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