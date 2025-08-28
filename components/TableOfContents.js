import { useEffect, useState, useRef } from 'react';

const TableOfContents = () => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [isTocOpen, setIsTocOpen] = useState(false);
  const observer = useRef(null);

  useEffect(() => {
    const headingElements = Array.from(document.querySelectorAll('article h2, article h3'));

    const headingData = headingElements.map((heading, index) => {
      const id = heading.id || `heading-${index}`;
      heading.id = id;
      return {
        id,
        text: heading.textContent,
        level: parseInt(heading.tagName.charAt(1)),
      };
    });

    setHeadings(headingData);

    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );

    headingElements.forEach((heading) => {
      observer.current.observe(heading);
    });

    return () => {
      if(observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => setActiveId(id), 500);
    }
  };

  if (headings.length === 0) return null;

  return (
    <>
      <div className="xl:hidden mb-4">
        <button
          onClick={() => setIsTocOpen(!isTocOpen)}
          className="font-semibold text-wiki-text-light flex items-center"
        >
          Table of Contents
          <svg className={`w-5 h-5 ml-2 transition-transform ${isTocOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
      </div>
      <div className={`xl:block ${isTocOpen ? 'block' : 'hidden'}`}>
        <div className="sticky top-20">
          <div className="bg-wiki-content-bg rounded-lg shadow p-4 border border-wiki-border">
            <h3 className="font-bold text-lg mb-3 text-wiki-text-light">On this page</h3>
            <ul className="space-y-2">
              {headings.map((heading) => (
                <li key={heading.id} style={{ paddingLeft: `${(heading.level - 2) * 1}rem` }}>
                  <button
                    onClick={() => scrollToHeading(heading.id)}
                    className={`w-full text-left text-sm transition-colors duration-200 py-1 px-2 rounded
                      ${
                        activeId === heading.id
                          ? 'text-wiki-blue bg-wiki-blue/10'
                          : 'text-wiki-text-muted hover:text-wiki-text-light hover:bg-wiki-content-bg-hover'
                      }
                    `}
                  >
                    {heading.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default TableOfContents;