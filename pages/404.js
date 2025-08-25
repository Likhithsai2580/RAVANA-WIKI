import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-wiki-blue text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">RAVANA AGI Documentation</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><Link href="/" className="hover:underline">Home</Link></li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
          <p className="text-xl mb-8">Sorry, the documentation page you're looking for doesn't exist.</p>
          <Link href="/" className="bg-wiki-blue text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-800 transition-colors">
            Return to Documentation Home
          </Link>
        </div>
      </main>
      
      <footer className="bg-wiki-dark text-white p-4">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} RAVANA AGI System Documentation</p>
        </div>
      </footer>
    </div>
  );
}