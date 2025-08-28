import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';

const EnhancedNavigation = ({ docs }) => {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  // Group docs by category for better organization
  const groupedDocs = docs.reduce((acc, doc) => {
    // Extract category from slug (first part before '/')
    const category = doc.slug.includes('/') 
      ? doc.slug.split('/')[0] 
      : 'General';
    
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(doc);
    return acc;
  }, {});

  // Initialize expanded sections from localStorage
  useEffect(() => {
    const savedExpanded = localStorage.getItem('expandedSections');
    if (savedExpanded) {
      try {
        setExpandedSections(JSON.parse(savedExpanded));
      } catch (e) {
        console.error('Failed to parse expanded sections', e);
      }
    } else {
      // Default to expand first section
      const firstCategory = Object.keys(groupedDocs)[0];
      if (firstCategory) {
        setExpandedSections({ [firstCategory]: true });
      }
    }
  }, [groupedDocs]);

  // Save expanded sections to localStorage
  useEffect(() => {
    localStorage.setItem('expandedSections', JSON.stringify(expandedSections));
  }, [expandedSections]);

  const toggleSection = useCallback((category) => {
    setExpandedSections(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  }, []);

  const isCurrentDoc = useCallback((docSlug) => {
    // Compare using URL-safe comparison to handle encoding differences
    const currentSlug = Array.isArray(router.query.slug) ? router.query.slug.join('/') : router.query.slug;
    return currentSlug === docSlug || decodeURIComponent(currentSlug) === docSlug;
  }, [router.query.slug]);

  // Filter docs based on search query
  const filteredDocs = {};
  if (searchQuery) {
    Object.keys(groupedDocs).forEach(category => {
      filteredDocs[category] = groupedDocs[category].filter(doc => 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.slug.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  } else {
    Object.assign(filteredDocs, groupedDocs);
  }

  // Filter out empty categories
  const nonEmptyCategories = Object.keys(filteredDocs).filter(
    category => filteredDocs[category].length > 0
  );

  // Expand section if current doc is in that section
  useEffect(() => {
    if (!searchQuery) {
      const currentSlug = Array.isArray(router.query.slug) ? router.query.slug.join('/') : router.query.slug;
      if (currentSlug) {
        Object.keys(groupedDocs).forEach(category => {
          const isInCategory = groupedDocs[category].some(doc => 
            doc.slug === currentSlug || decodeURIComponent(doc.slug) === currentSlug
          );
          if (isInCategory && !expandedSections[category]) {
            setExpandedSections(prev => ({
              ...prev,
              [category]: true
            }));
          }
        });
      }
    }
  }, [router.query.slug, groupedDocs, expandedSections, searchQuery]);

  return (
    <nav className="w-full md:w-64 flex-shrink-0">
      <div className="bg-base-200 rounded-lg shadow-md p-4 sticky top-4 border border-base-300 overflow-hidden max-h-[calc(100vh-2rem)]">
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-3 text-wiki-text-light flex items-center justify-between">
            <span>Documentation</span>
          </h3>
          
          {/* Search input */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search docs..."
              className="w-full px-3 py-2 bg-base-200 text-base-content rounded-lg border border-base-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-wiki-text-muted hover:text-wiki-text-light"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2 pr-1 overflow-y-auto max-h-[calc(100vh-12rem)]">
          {nonEmptyCategories.map(category => (
            <div key={category} className="mb-3">
              <button
                onClick={() => toggleSection(category)}
                className="flex items-center justify-between w-full py-2 px-3 rounded-lg text-left font-semibold text-wiki-accent hover:bg-wiki-content-bg-hover transition-all duration-200 ease-in-out"
              >
                <span>{category}</span>
                <svg 
                  className={`w-4 h-4 transform transition-transform duration-200 ease-in-out ${expandedSections[category] ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSections[category] ? 'opacity-100' : 'max-h-0 opacity-0'}`}
                style={expandedSections[category] ? { maxHeight: '1000px' } : { maxHeight: '0' }}
              >
                <ul className="ml-2 mt-1 space-y-1">
                  {filteredDocs[category].map(doc => (
                    <li key={doc.slug}>
                      <Link 
                        href={`/docs/${encodeURIComponent(doc.slug)}`}
                        className={`block py-2 px-3 rounded-lg transition-all duration-200 ease-in-out ${
                          isCurrentDoc(doc.slug) 
                            ? 'bg-wiki-blue text-white shadow-md transform translate-x-1' 
                            : 'text-wiki-text-muted hover:bg-wiki-content-bg-hover hover:text-wiki-text-light hover:translate-x-1'
                        }`}
                      >
                        {doc.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default EnhancedNavigation;