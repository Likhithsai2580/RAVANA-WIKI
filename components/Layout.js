import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navigation from './Navigation';
import ThemeChanger from './ThemeChanger';

export default function Layout({ children, docs }) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <header className="bg-wiki-content-bg text-wiki-text-light p-4 shadow-xl border-b border-wiki-border sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <button
              className="md:hidden mr-4"
              onClick={() => setIsNavOpen(!isNavOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-wiki-blue to-wiki-accent bg-clip-text text-transparent">
              RAVANA AGI
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <nav>
              <ul className="flex space-x-4">
                <li><Link href="/" className="hover:text-wiki-blue transition-colors duration-200 text-sm md:text-base">Home</Link></li>
              </ul>
            </nav>
            <ThemeChanger />
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div
        className={`fixed inset-0 z-20 flex md:hidden transition-transform transform ${
          isNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="w-64 bg-wiki-content-bg p-4 border-r border-wiki-border">
          <Navigation docs={docs} />
        </div>
        <div
          className="flex-grow bg-black/50"
          onClick={() => setIsNavOpen(false)}
        />
      </div>

      <div className="flex-grow container mx-auto p-4 flex flex-col md:flex-row gap-6">
        <div className="hidden md:block w-full md:w-64 flex-shrink-0">
          <Navigation docs={docs} />
        </div>
        <main className="flex-grow">{children}</main>
      </div>

      <footer className="bg-wiki-content-bg text-wiki-text-light p-6 border-t border-wiki-border">
        <div className="container mx-auto text-center">
          <p className="text-wiki-text-muted">© {new Date().getFullYear()} RAVANA AGI System Documentation</p>
        </div>
      </footer>
    </div>
  );
}
