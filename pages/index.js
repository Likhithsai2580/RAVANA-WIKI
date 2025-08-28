import Head from 'next/head';
import Link from 'next/link';
import { readdir, readFile } from 'fs/promises';
import path from 'path';
import DocCard from '../components/DocCard';
import Search from '../components/Search';
import ThemeToggle from '../components/ThemeToggle';

export default function Home({ docs }) {
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Head>
        <title>RAVANA AGI Documentation</title>
        <meta name="description" content="Documentation for the RAVANA AGI system" />
      </Head>

      <header className="bg-base-200/80 backdrop-blur-lg sticky top-0 z-50 p-4 shadow-lg border-b border-base-300 animate-slide-in-up">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4 md:gap-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            RAVANA AGI Docs
          </h1>
          <div className="flex items-center space-x-4">
            <Search docs={docs} />
            <ThemeToggle />
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li><Link href="/" className="text-base-content hover:text-primary transition-colors duration-300 font-medium">Home</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8">
        <section className="mb-16 text-center animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-base-content">Welcome to RAVANA AGI</h2>
          <p className="mb-8 max-w-3xl mx-auto text-base md:text-lg text-neutral-content">
            Your central hub for all documentation related to the RAVANA AGI system.
            Dive deep into our architecture, APIs, and tutorials.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/docs/Project%20Overview" className="bg-primary text-primary-content px-6 py-3 rounded-lg font-bold hover:bg-primary-focus transition-all duration-300 shadow-lg transform hover:scale-105">
              Get Started
            </Link>
            <Link href="/docs/API%20Reference" className="bg-neutral text-neutral-content px-6 py-3 rounded-lg font-bold hover:bg-neutral-focus transition-all duration-300 shadow-lg transform hover:scale-105">
              API Reference
            </Link>
          </div>
        </section>

        <section className="animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center text-base-content">Explore Topics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {docs.map((doc) => (
              <DocCard key={doc.slug} doc={doc} />
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-base-200 text-base-content p-6 border-t border-base-300">
        <div className="container mx-auto text-center">
          <p className="text-neutral-content">© {new Date().getFullYear()} RAVANA AGI System. All rights reserved.</p>
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