import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Enhanced navigation component for documentation.
 *
 * This component organizes documentation into expandable sections based on categories,
 * manages search functionality, and persists expanded sections in localStorage.
 * It utilizes hooks like useMemo for performance optimization and useEffect for side effects
 * related to localStorage and section expansion based on the current document.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.docs - An array of documentation objects to be displayed.
 */
const EnhancedNavigation = ({ docs }) => {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sectionHeights, setSectionHeights] = useState({});

  // Group docs by category for better organization with useMemo for performance
  const groupedDocs = useMemo(() => {
    return docs.reduce((acc, doc) => {
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
  }, [docs]);

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

  // Debounced save expanded sections to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('expandedSections', JSON.stringify(expandedSections));
    }, 300);
    
    return () => clearTimeout(timer);
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
  const filteredDocs = useMemo(() => {
    const result = {};
    if (searchQuery) {
      Object.keys(groupedDocs).forEach(category => {
        result[category] = groupedDocs[category].filter(doc => 
          doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.slug.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    } else {
      Object.assign(result, groupedDocs);
    }
    return result;
  }, [groupedDocs, searchQuery]);

  // Filter out empty categories
  const nonEmptyCategories = useMemo(() => {
    return Object.keys(filteredDocs).filter(
      category => filteredDocs[category].length > 0
    );
  }, [filteredDocs]);

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

  // Calculate section heights for smooth animations
  const calculateSectionHeight = useCallback((category) => {
    if (typeof window === 'undefined') return;
    
    const element = document.getElementById(`section-${category}`);
    if (element) {
      const height = element.scrollHeight;
      setSectionHeights(prev => ({
        ...prev,
        [category]: height
      }));
    }
  }, []);

  // Recalculate heights when sections expand/collapse or content changes
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is updated
    const frameId = requestAnimationFrame(() => {
      nonEmptyCategories.forEach(category => {
        if (expandedSections[category]) {
          calculateSectionHeight(category);
        }
      });
    });
    
    return () => cancelAnimationFrame(frameId);
  }, [nonEmptyCategories, expandedSections, calculateSectionHeight]);

  return (
    <nav className="w-full md:w-64 flex-shrink-0">
      <div className="bg-base-200 rounded-lg shadow-md p-4 sticky top-4 border border-base-300 overflow-hidden max-h-[calc(100vh-2rem)] animate-fade-in-up">
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-3 text-wiki-text-light flex items-center justify-between">
            <span>Documentation</span>
          </h3>
          
          {/* Search input */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search docs..."
              className="w-full px-3 py-2 bg-base-200 text-base-content rounded-lg border border-base-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all hover:animate-pulse-glow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-wiki-text-muted hover:text-wiki-text-light transition-colors duration-300 hover:animate-rotate-in"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2 pr-1 overflow-y-auto max-h-[calc(100vh-14rem)]">
          {/* GitHub Link */}
          <div className="mb-3 p-3 bg-base-300 rounded-lg hover:animate-bounce-in">
            <a 
              href="https://github.com/OpenSource-Syndicate/RAVANA" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-base-content hover:text-primary transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>GitHub Repository</span>
            </a>
          </div>

          {nonEmptyCategories.map(category => (
            <div key={category} className="mb-3 animate-fade-in">
              <button
                onClick={() => toggleSection(category)}
                className="flex items-center justify-between w-full py-2 px-3 rounded-lg text-left font-semibold text-wiki-accent hover:bg-wiki-content-bg-hover transition-all duration-200 ease-in-out hover:animate-gradient-shift"
              >
                <span>{category}</span>
                <svg 
                  className={`w-4 h-4 transform transition-transform duration-300 ease-in-out ${expandedSections[category] ? 'rotate-180 animate-rotate-in' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                id={`section-${category}`}
                className={`overflow-hidden transition-all duration-500 ease-in-out transform ${
                  expandedSections[category] 
                    ? 'max-h-[var(--expanded-height)] opacity-100 scale-y-100' 
                    : 'max-h-0 opacity-0 scale-y-90'
                }`}
                style={{ '--expanded-height': `${sectionHeights[category] || 1000}px` }}
              >
                <ul className="ml-2 mt-1 space-y-1">
                  {filteredDocs[category].map(doc => (
                    <li key={doc.slug} className="animate-fade-in-up">
                      <Link 
                        href={`/docs/${doc.slug}`}
                        className={`block py-2 px-3 rounded-lg transition-all duration-300 ease-in-out hover-bounce ${
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