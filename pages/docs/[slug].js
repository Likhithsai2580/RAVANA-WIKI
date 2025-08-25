import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { processMarkdown } from '../../lib/markdown';
import { useEffect } from 'react';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import Breadcrumb from '../../components/Breadcrumb';
import TableOfContents from '../../components/TableOfContents';

export default function DocPage({ doc, docs }) {
  const router = useRouter();
  
  // Client-side effects for code highlighting and mermaid initialization
  useEffect(() => {
    // Syntax highlighting
    if (typeof window !== 'undefined' && window.Prism) {
      window.Prism.highlightAll();
    }
    
    // Initialize mermaid diagrams
    const initMermaid = async () => {
      if (typeof window !== 'undefined') {
        try {
          const { default: mermaid } = await import('mermaid');
          
          // Initialize mermaid
          mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
            flowchart: { useMaxWidth: true }
          });
          
          // Render all diagrams
          mermaid.run();
        } catch (error) {
          console.error('Error initializing mermaid:', error);
        }
      }
    };
    
    // Initialize mermaid with a slight delay to ensure DOM is ready
    setTimeout(initMermaid, 100);
  }, [doc]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{doc.title} - RAVANA AGI Documentation</title>
        <meta name="description" content={`Documentation for ${doc.title}`} />
      </Head>
      
      {/* Prism scripts */}
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js" 
        strategy="beforeInteractive" 
      />
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js" 
        strategy="beforeInteractive" 
      />
      
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
      
      <div className="flex-grow container mx-auto p-4 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 flex-shrink-0">
          <Navigation docs={docs} />
        </div>
        
        <main className="flex-grow">
          <Breadcrumb doc={doc} />
          <div className="flex flex-col md:flex-row gap-6">
            <article className="prose max-w-none bg-white p-6 rounded-lg shadow flex-grow">
              <h1>{doc.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: doc.content }} />
            </article>
            
            <div className="w-full md:w-64 flex-shrink-0">
              <TableOfContents />
            </div>
          </div>
        </main>
      </div>
      
      <footer className="bg-wiki-dark text-white p-4">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} RAVANA AGI System Documentation</p>
        </div>
      </footer>
    </div>
  );
}

export async function getStaticPaths() {
  // List all markdown files in the docs directory
  const docsDir = path.join(process.cwd(), 'docs');
  const docFiles = await readdir(docsDir);
  
  // Filter out directories and non-markdown files
  const markdownFiles = docFiles.filter(file => 
    file.endsWith('.md') && !file.endsWith('README.md')
  );
  
  // Create paths for each document
  const paths = markdownFiles.map(file => ({
    params: { slug: file.replace('.md', '') }
  }));
  
  return {
    paths,
    fallback: false // Changed from true to false for static export compatibility
  };
}

export async function getStaticProps({ params }) {
  try {
    // Read the markdown file
    const docsDir = path.join(process.cwd(), 'docs');
    const filePath = path.join(docsDir, `${params.slug}.md`);
    const content = await readFile(filePath, 'utf8');
    
    // Process the markdown content
    const { html, frontmatter } = await processMarkdown(content);
    
    // Extract title from frontmatter or first heading
    const title = frontmatter.title || 
      content.match(/^#\s+(.*)$/m)?.[1] || 
      params.slug.replace(/-/g, ' ');
    
    // Get all docs for navigation
    const docFiles = await readdir(docsDir);
    const markdownFiles = docFiles.filter(file => 
      file.endsWith('.md') && !file.endsWith('README.md')
    );
    
    const docs = await Promise.all(
      markdownFiles.map(async (file) => {
        const filePath = path.join(docsDir, file);
        const content = await readFile(filePath, 'utf8');
        
        // Extract title (first # header)
        const titleMatch = content.match(/^#\s+(.*)$/m);
        const title = titleMatch ? titleMatch[1] : file.replace('.md', '');
        
        return {
          slug: file.replace('.md', ''),
          title
        };
      })
    );
    
    // Sort docs alphabetically by title
    docs.sort((a, b) => a.title.localeCompare(b.title));
    
    return {
      props: {
        doc: {
          slug: params.slug,
          title,
          content: html
        },
        docs
      }
    };
  } catch (error) {
    console.error('Error loading document:', error);
    return {
      notFound: true
    };
  }
}