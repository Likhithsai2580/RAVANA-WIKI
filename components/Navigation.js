import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const NavigationItem = ({ item, level = 0 }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(router.asPath.startsWith(`/docs/${item.slug}`));

  useEffect(() => {
    if (item.children) {
      const isActive = item.children.some(child => router.asPath.includes(child.slug));
      setIsOpen(isActive);
    }
  }, [router.asPath, item.children, item.slug]);

  const isLink = !!item.slug;
  const isActive = router.query.slug?.join('/') === item.slug;

  if (isLink) {
    return (
      <li>
        <Link
          href={`/docs/${item.slug}`}
          className={`block py-2 px-3 rounded-lg transition-all duration-200 text-sm ${
            isActive
              ? 'bg-wiki-blue text-white shadow-md'
              : 'text-wiki-text-muted hover:bg-wiki-content-bg-hover hover:text-wiki-text-light'
          }`}
          style={{ paddingLeft: `${1 + level * 1}rem` }}
        >
          {item.title}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex justify-between items-center py-2 px-3 rounded-lg hover:bg-wiki-content-bg-hover transition-colors duration-200"
        style={{ paddingLeft: `${1 + level * 1}rem` }}
      >
        <span className="font-semibold text-wiki-text-light">{item.title}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-height duration-300 ease-in-out ${isOpen ? 'h-auto' : 'h-0'}`}
      >
        {isOpen && (
          <ul className="space-y-1 mt-1">
            {item.children.map((child, index) => (
              <NavigationItem key={index} item={child} level={level + 1} />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
};


const Navigation = ({ docs }) => {
  return (
    <nav className="w-full md:w-64 flex-shrink-0">
      <div className="bg-wiki-content-bg rounded-lg shadow-lg p-4 sticky top-4 border border-wiki-border">
        <h3 className="font-bold text-lg mb-3 text-wiki-text-light">Documentation</h3>
        <ul className="space-y-2">
          {docs.map((item, index) => (
            <NavigationItem key={index} item={item} />
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;