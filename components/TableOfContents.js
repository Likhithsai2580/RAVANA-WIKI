import { useEffect, useState } from 'react';

const TableOfContents = () => {
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
    
    // Add IDs to headings if they don't have them
    headingElements.forEach(heading => {
      if (!heading.id) {
        heading.id = heading.textContent.replace(/\s+/g, '-').toLowerCase();
      }
    });
  }, []);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="bg-wiki-content-bg rounded-lg shadow p-4 mb-6 border border-wiki-border">
      <h3 className="font-bold text-lg mb-3 text-wiki-text-light">Table of Contents</h3>
      <ul className="space-y-1">
        {headings.map((heading, index) => (
          <li 
            key={index} 
            className={`${heading.level > 1 ? 'ml-4' : ''}`}
          >
            <button
              onClick={() => scrollToHeading(heading.id)}
              className="text-left text-wiki-text-muted hover:text-wiki-blue py-1 px-2 rounded hover:bg-wiki-content-bg-hover w-full text-sm transition-colors duration-200"
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents;