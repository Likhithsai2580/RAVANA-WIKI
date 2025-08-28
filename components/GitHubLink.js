import { useState, useEffect } from 'react';
import Link from 'next/link';

const GitHubLink = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupCount, setPopupCount] = useState(0);

  // Check if we should show a popup (random chance)
  const shouldShowPopup = () => {
    // 20% chance to show popup
    return Math.random() < 0.2;
  };

  // Handle showing popup with some randomness
  useEffect(() => {
    // Only show popup on documentation pages
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/docs')) {
      // Check if we should show popup (with some limitations)
      const canShowPopup = popupCount < 2; // Limit to 2 popups per session
      
      if (canShowPopup && shouldShowPopup()) {
        // Show popup after a delay
        const timer = setTimeout(() => {
          setShowPopup(true);
          setPopupCount(prev => prev + 1);
        }, 30000); // Show after 30 seconds
        
        return () => clearTimeout(timer);
      }
    }
  }, [popupCount]);

  const closePopup = () => {
    setShowPopup(false);
  };

  const visitGitHub = () => {
    window.open('https://github.com/OpenSource-Syndicate/RAVANA', '_blank');
    closePopup();
  };

  return (
    <>
      {/* GitHub Link in header */}
      <Link 
        href="https://github.com/OpenSource-Syndicate/RAVANA" 
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-1 text-base-content hover:text-primary transition-colors duration-300"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        <span className="hidden md:inline">GitHub</span>
      </Link>

      {/* Random Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-200 rounded-lg shadow-xl p-6 max-w-md w-full border border-base-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-wiki-text-light">Enjoying RAVANA AGI?</h3>
              <button 
                onClick={closePopup}
                className="text-wiki-text-muted hover:text-wiki-text-light"
              >
                ✕
              </button>
            </div>
            <p className="mb-4 text-wiki-text-muted">
              Check out our GitHub repository to explore the source code, contribute, or star the project!
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={visitGitHub}
                className="flex-1 bg-primary text-primary-content px-4 py-2 rounded-lg font-medium hover:bg-primary-focus transition-colors duration-300"
              >
                Visit GitHub
              </button>
              <button
                onClick={closePopup}
                className="flex-1 bg-base-300 text-base-content px-4 py-2 rounded-lg font-medium hover:bg-base-400 transition-colors duration-300"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GitHubLink;