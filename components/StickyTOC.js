import { useEffect, useState, useRef } from 'react';

/**
 * Renders a sticky table of contents (TOC) for the provided content.
 *
 * This component extracts headings from the content, organizes them into a hierarchical structure, and allows users to navigate to specific sections. It utilizes an Intersection Observer to track the active heading as the user scrolls, and provides functionality to expand or collapse sections of headings. The component also ensures that headings without IDs are assigned unique identifiers based on their text content.
 *
 * @param {Object} props - The component props.
 * @param {string} props.content - The content from which to extract headings.
 * @returns {JSX.Element|null} The rendered TOC component or null if no headings are found.
 */
const StickyTOC = ({ content }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [expandedSections, setExpandedSections] = useState({});
  const observer = useRef();

  useEffect(() => {
    // Clean up previous observer
    if (observer.current) {
      observer.current.disconnect();
    }
    
    // Extract headings from the document
    const headingElements = document.querySelectorAll('article h2, article h3');
    const headingData = Array.from(headingElements).map(heading => ({
      id: heading.id || heading.textContent.replace(/\s+/g, '-').toLowerCase(),
      text: heading.textContent,
      level: parseInt(heading.tagName.charAt(1)) - 1, // Convert H2/H3 to level 1/2
      parent: null
    }));
    
    // Group H3 headings under their preceding H2 headings
    let currentH2 = null;
    headingData.forEach(heading => {
      if (heading.level === 1) {
        currentH2 = heading.id;
      } else if (heading.level === 2 && currentH2) {
        heading.parent = currentH2;
      }
    });
    
    setHeadings(headingData);
    
    // Add IDs to headings if they don't have them
    headingElements.forEach(heading => {
      if (!heading.id) {
        heading.id = heading.textContent.replace(/\s+/g, '-').toLowerCase();
      }
    });
    
    // Initialize expanded sections - expand first H2 section by default
    if (headingData.length > 0) {
      const firstH2 = headingData.find(h => h.level === 1);
      if (firstH2) {
        setExpandedSections({ [firstH2.id]: true });
      }
    }
    
    // Set up intersection observer for active heading detection
    const handleObserver = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: '0px 0px -80% 0px'
    });

    headingElements.forEach((heading) => {
      observer.current.observe(heading);
    });

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [content]); // Add content as dependency so TOC updates when content changes

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleSection = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Group headings by parent for collapsible sections
  const groupedHeadings = headings.reduce((acc, heading) => {
    if (heading.level === 1) {
      acc[heading.id] = {
        ...heading,
        children: []
      };
    } else if (heading.level === 2 && heading.parent) {
      if (acc[heading.parent]) {
        acc[heading.parent].children.push(heading);
      }
    }
    return acc;
  }, {});

  if (headings.length === 0) return null;

  return (
    <div className="bg-base-200 rounded-lg shadow-md p-4 mb-6 border border-base-300 sticky top-4 overflow-auto max-h-[calc(100vh-14rem)]">
      <h3 className="font-bold text-lg mb-3 text-base-content">Table of Contents</h3>
      <ul className="space-y-1 pr-1 overflow-visible">
        {Object.values(groupedHeadings).map((heading) => (
          <li key={heading.id}>
            <div className="flex items-start">
              <button
                onClick={() => scrollToHeading(heading.id)}
                className={`flex-grow text-left py-2 px-2 rounded hover:bg-wiki-content-bg-hover transition-all duration-300 ${
                  activeId === heading.id 
                    ? 'text-wiki-blue font-semibold bg-wiki-content-bg-hover' 
                    : 'text-wiki-text-muted'
                }`}
              >
                {heading.text}
              </button>
              {heading.children.length > 0 && (
                <button
                  onClick={() => toggleSection(heading.id)}
                  className="p-2 text-wiki-text-muted hover:text-wiki-text-light rounded-full hover:bg-wiki-content-bg-hover transition-all duration-300"
                >
                  <svg 
                    className={`w-4 h-4 transform transition-transform duration-300 ${expandedSections[heading.id] ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
            
            {heading.children.length > 0 && (
              <div 
                className={`overflow-hidden transition-all duration-300 ${expandedSections[heading.id] ? 'max-h-[400px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}
              >
                <ul className="ml-4 space-y-1 border-l-2 border-wiki-border pl-2">
                  {heading.children.map((child) => (
                    <li key={child.id}>
                      <button
                        onClick={() => scrollToHeading(child.id)}
                        className={`block w-full text-left py-2 px-2 rounded text-sm hover:bg-wiki-content-bg-hover transition-all duration-300 ${
                          activeId === child.id 
                            ? 'text-wiki-blue font-medium bg-wiki-content-bg-hover' 
                            : 'text-wiki-text-muted'
                        }`}
                      >
                        {child.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StickyTOC;