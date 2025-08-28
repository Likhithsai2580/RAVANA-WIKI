import Head from 'next/head';
import Link from 'next/link';
import { readdir, readFile } from 'fs/promises';
import path from 'path';
import DocCard from '../components/DocCard';
import Search from '../components/Search';
import ThemeToggle from '../components/ThemeToggle';
import GitHubLink from '../components/GitHubLink';

export default function Home({ docs }) {
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Head>
        <title>RAVANA AGI Documentation</title>
        <meta name="description" content="Documentation for the RAVANA AGI system" />
      </Head>

      <header className="bg-base-200/80 backdrop-blur-lg sticky top-0 z-50 p-4 shadow-lg border-b border-base-300 animate-slide-in-up">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4 md:gap-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-gradient-shift">
            RAVANA AGI Docs
          </h1>
          <div className="flex items-center space-x-4">
            <Search docs={docs} />
            <ThemeToggle />
            <GitHubLink />
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li><Link href="/" className="text-base-content hover:text-primary transition-colors duration-300 font-medium hover:animate-pulse">Home</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8">
        <section className="mb-16 text-center animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-base-content animate-bounce-in">Welcome to RAVANA AGI</h2>
          <p className="mb-8 max-w-3xl mx-auto text-base md:text-lg text-neutral-content animate-fade-in-up">
            Your central hub for all documentation related to the RAVANA AGI system.
            Dive deep into our architecture, APIs, and tutorials.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in">
            <Link href="/docs/Project%20Overview" className="bg-primary text-primary-content px-6 py-3 rounded-lg font-bold hover:bg-primary-focus transition-all duration-300 shadow-lg transform hover:scale-105 hover-bounce">
              Get Started
            </Link>
            <Link href="/docs/API%20Reference" className="bg-neutral text-neutral-content px-6 py-3 rounded-lg font-bold hover:bg-neutral-focus transition-all duration-300 shadow-lg transform hover:scale-105 hover-bounce">
              API Reference
            </Link>
          </div>
        </section>

        <section className="animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center text-base-content animate-fade-in">Explore Topics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {docs.map((doc) => (
              <div key={doc.slug} className="animate-fade-in-up hover-scale hover-glow">
                <DocCard doc={doc} />
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-base-200 text-base-content p-6 border-t border-base-300 animate-fade-in">
        <div className="container mx-auto text-center">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-content">© {new Date().getFullYear()} RAVANA AGI System. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <a 
                href="https://github.com/OpenSource-Syndicate/RAVANA" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 text-base-content hover:text-primary transition-colors duration-300 hover:animate-bounce-in"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>View on GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  const docsDir = path.join(process.cwd(), 'docs');
  
  async function getAllFiles(dir) {
    const dirents = await readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getAllFiles(res) : res;
    }));
    return Array.prototype.concat(...files);
  }

  const allFiles = await getAllFiles(docsDir);

  const markdownFiles = allFiles.filter(file =>
    file.endsWith('.md') && !path.basename(file).endsWith('README.md')
  );

  const docs = await Promise.all(
    markdownFiles.map(async (filePath) => {
      const content = await readFile(filePath, 'utf8');
      const slug = path.relative(docsDir, filePath).replace(/\.md$/, '').replace(/\\/g, '/');
      
      const titleMatch = content.match(/^#\s+(.*)$/m);
      const title = titleMatch ? titleMatch[1] : path.basename(filePath, '.md');
      
      const excerptMatch = content.match(/^[^#>].*$/m);
      const excerpt = excerptMatch ? excerptMatch[0].substring(0, 150) + '...' : 'Documentation file';
      
      return {
        slug,
        title,
        excerpt
      };
    })
  );

  docs.sort((a, b) => a.title.localeCompare(b.title));
  
  return {
    props: {
      docs
    }
  };
}