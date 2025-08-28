import { useState, useEffect } from 'react';
import StickyTOC from './StickyTOC';

/**
 * Renders a floating table of contents (TOC) for the document.
 *
 * This component extracts headings (h2 and h3) from the article and creates a TOC that can be toggled open or closed.
 * It uses the `useEffect` hook to gather heading data on component mount and stores it in the state.
 * The TOC is only displayed if there are headings available, and it includes a button to toggle its visibility.
 */
const FloatingTOC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    // Extract headings from the document
    const headingElements = document.querySelectorAll('article h2, article h3');
    const headingData = Array.from(headingElements).map(heading => ({
      id: heading.id || heading.textContent.replace(/\s+/g, '-').toLowerCase(),
      text: heading.textContent,
      level: parseInt(heading.tagName.charAt(1)) - 1 // Convert H2/H3 to level 1/2
    }));
    
    setHeadings(headingData);
  }, []);

  /** Toggles the state of the table of contents. */
  const toggleTOC = () => {
    setIsOpen(!isOpen);
  };

  // Don't show floating TOC if there are no headings
  if (headings.length === 0) return null;

  return (
    <div className="md:hidden fixed bottom-6 right-6 z-40">
      {/* Floating TOC button */}
      <button
        onClick={toggleTOC}
        className="bg-wiki-blue text-white p-3 rounded-full shadow-lg hover:bg-wiki-blue-dark transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-wiki-blue focus:ring-opacity-50"
        aria-label="Toggle table of contents"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        )}
      </button>

      {/* Floating TOC panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 max-w-[85vw] max-h-[70vh] overflow-hidden">
          <div className="bg-base-200 rounded-lg shadow-xl border border-base-300 transform transition-all duration-300 ease-in-out">
            <div className="p-4 border-b border-base-300">
              <h3 className="font-bold text-lg text-base-content">Table of Contents</h3>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              <StickyTOC />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingTOC;