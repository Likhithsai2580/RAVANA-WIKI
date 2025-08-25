import Head from 'next/head';
import Link from 'next/link';
import { readdir, readFile } from 'fs/promises';
import path from 'path';
import DocCard from '../components/DocCard';
import Search from '../components/Search';

export default function Home({ docs }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>RAVANA AGI Documentation</title>
        <meta name="description" content="Documentation for the RAVANA AGI system" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <header className="bg-wiki-content-bg text-wiki-text-light p-4 shadow-xl border-b border-wiki-border">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-wiki-blue to-wiki-accent bg-clip-text text-transparent">RAVANA AGI Documentation</h1>
          <Search docs={docs} />
          <nav>
            <ul className="flex space-x-4">
              <li><Link href="/" className="hover:text-wiki-blue transition-colors duration-200">Home</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4">
        <section className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Documentation</h2>
          <p className="mb-8 max-w-2xl mx-auto text-lg text-wiki-text-muted">Welcome to the RAVANA AGI system documentation. Explore the topics below to learn more about the system architecture, components, and implementation details.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {docs.map((doc) => (
              <DocCard key={doc.slug} doc={doc} />
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-wiki-content-bg text-wiki-text-light p-6 border-t border-wiki-border">
        <div className="container mx-auto text-center">
          <p className="text-wiki-text-muted">© {new Date().getFullYear()} RAVANA AGI System Documentation</p>
        </div>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  // List all markdown files in the docs directory
  const docsDir = path.join(process.cwd(), 'docs');
  const docFiles = await readdir(docsDir);
  
  // Filter out directories and non-markdown files
  const markdownFiles = docFiles.filter(file => 
    file.endsWith('.md') && !file.endsWith('README.md')
  );
  
  // Read and process each markdown file to extract title and excerpt
  const docs = await Promise.all(
    markdownFiles.map(async (file) => {
      const filePath = path.join(docsDir, file);
      const content = await readFile(filePath, 'utf8');
      
      // Extract title (first # header)
      const titleMatch = content.match(/^#\s+(.*)$/m);
      const title = titleMatch ? titleMatch[1] : file.replace('.md', '');
      
      // Extract first paragraph as excerpt
      const excerptMatch = content.match(/^[^#>].*$/m);
      const excerpt = excerptMatch ? excerptMatch[0].substring(0, 150) + '...' : 'Documentation file';
      
      return {
        slug: file.replace('.md', ''),
        title,
        excerpt
      };
    })
  );
  
  // Sort docs alphabetically by title
  docs.sort((a, b) => a.title.localeCompare(b.title));
  
  return {
    props: {
      docs
    }
  };
}