import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import EnhancedNavigation from './EnhancedNavigation';

const MobileNavigation = ({ docs }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      {/* Mobile menu button */}
      <button
        onClick={toggleMenu}
        className="p-2 rounded-md text-wiki-text-light hover:text-wiki-blue hover:bg-wiki-content-bg-hover focus:outline-none focus:ring-2 focus:ring-inset focus:ring-wiki-blue transition-all duration-300"
        aria-expanded={isOpen}
      >
        <span className="sr-only">Open main menu</span>
        {isOpen ? (
          <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile menu panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="fixed inset-0 bg-black bg-opacity-70 transition-opacity duration-300"
            onClick={closeMenu}
          />
          
          <div className="fixed inset-y-0 left-0 max-w-full flex transform transition duration-300 ease-in-out">
            <div className="relative w-screen max-w-md">
              <div className="h-full flex flex-col bg-base-200 shadow-xl border-r border-base-300">
                <div className="flex-1 overflow-auto py-6 px-4 sm:px-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-wiki-text-light">Documentation</h2>
                    <button
                      onClick={closeMenu}
                      className="p-2 rounded-md text-wiki-text-muted hover:text-wiki-text-light hover:bg-wiki-content-bg-hover transition-all duration-300"
                    >
                      <svg className="h-6 w-6" xmlns="http://www.w.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="mt-4">
                    <EnhancedNavigation docs={docs} />
                  </div>
                </div>
                
                <div className="border-t border-base-300 py-4 px-4">
                  <div className="flex justify-center space-x-6">
                    <Link href="/" className="text-base-content hover:text-primary transition-colors duration-300">
                      Home
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNavigation;