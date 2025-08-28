import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { processMarkdown } from '../../lib/markdown';
import { useEffect } from 'react';
import Link from 'next/link';
import EnhancedNavigation from '../../components/EnhancedNavigation';
import MobileNavigation from '../../components/MobileNavigation';
import Breadcrumb from '../../components/Breadcrumb';
import StickyTOC from '../../components/StickyTOC';
import FloatingTOC from '../../components/FloatingTOC';
import MermaidRenderer from '../../components/MermaidRenderer';
import ThemeToggle from '../../components/ThemeToggle';

export default function DocPage({ doc, docs }) {
  const router = useRouter();
  
  // Client-side effects for code highlighting
  useEffect(() => {
    // Syntax highlighting
    if (typeof window !== 'undefined' && window.Prism) {
      window.Prism.highlightAll();
    }
  }, [doc]);
  
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Head>
        <title>{doc.title ? `${doc.title} - RAVANA AGI Documentation` : 'RAVANA AGI Documentation'}</title>
        <meta name="description" content={doc.title ? `Documentation for ${doc.title}` : 'RAVANA AGI Documentation'} />
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
      
      <header className="bg-base-200/80 backdrop-blur-lg sticky top-0 z-50 py-4 px-4 md:px-6 shadow-lg border-b border-base-300">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">RAVANA AGI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <nav className="hidden md:block">
              <ul className="flex space-x-4">
                <li><Link href="/" className="hover:text-primary transition-colors duration-300">Home</Link></li>
              </ul>
            </nav>
            <MobileNavigation docs={docs} />
          </div>
        </div>
      </header>
      
      <div className="flex-grow container mx-auto px-4 py-6 md:py-8 flex flex-col md:flex-row gap-6">
        {/* Desktop Navigation - hidden on mobile */}
        <div className="hidden md:block w-64 flex-shrink-0 sticky self-start" style={{ top: '5rem' }}>
          <EnhancedNavigation docs={docs} />
        </div>
        
        <main className="flex-grow overflow-hidden">
          <Breadcrumb doc={doc} />
          <div className="flex flex-col md:flex-row gap-6 h-full">
            <article className="prose max-w-none bg-base-200 p-4 md:p-6 rounded-lg shadow-xl flex-grow border border-base-300 transition-all duration-300 hover:shadow-2xl overflow-y-auto max-h-[calc(100vh-8rem)]">
              <h1 className="text-wiki-text-light mb-6 pb-2 border-b border-wiki-border">{doc.title}</h1>
              <MermaidRenderer content={doc.content} />
            </article>
            
            {/* Desktop TOC - hidden on mobile */}
            <div className="hidden md:block w-64 flex-shrink-0 self-start sticky top-20">
              <StickyTOC content={doc.content} />
            </div>
          </div>
        </main>
      </div>
      
      {/* Floating TOC for mobile devices */}
      <FloatingTOC content={doc.content} />
      
      <footer className="bg-base-200 text-base-content py-6 px-4 md:px-6 border-t border-base-300">
        <div className="container mx-auto text-center">
          <p className="text-wiki-text-muted">© {new Date().getFullYear()} RAVANA AGI System Documentation</p>
        </div>
      </footer>
    </div>
  );
}

export async function getStaticPaths() {
  // List all markdown files in the docs directory and subdirectories
  const docsDir = path.join(process.cwd(), 'docs');
  
  async function getAllMarkdownFiles(dir) {
    const dirents = await readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getAllMarkdownFiles(res) : res;
    }));
    return Array.prototype.concat(...files);
  }

  const allFiles = await getAllMarkdownFiles(docsDir);
  const markdownFiles = allFiles.filter(file =>
    file.endsWith('.md') && !path.basename(file).endsWith('README.md')
  );

  // Create paths for each document
  const paths = markdownFiles.map(file => {
    const relativePath = path.relative(docsDir, file);
    const pathSegments = relativePath.replace(/\.md$/, '').split(/[\\/]/);
    
    // Ensure segments are properly encoded for URL paths
    return {
      params: { slug: pathSegments }
    };
  });
  
  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  try {
    // Join the slug segments to get the full path
    // Ensure each segment is properly decoded from the URL encoding
    const decodedSlug = Array.isArray(params.slug) 
      ? params.slug.map(segment => decodeURIComponent(segment)) 
      : [decodeURIComponent(params.slug)];
    
    const slugPath = decodedSlug.join('/');
    
    // Read the markdown file
    const docsDir = path.join(process.cwd(), 'docs');
    
    // Try different possible paths
    const possiblePaths = [
      path.join(docsDir, `${slugPath}.md`),
      path.join(docsDir, `${slugPath}`, 'index.md'),
      path.join(docsDir, ...decodedSlug) + '.md'
    ];
    
    let content;
    let filePath;
    
    for (const possiblePath of possiblePaths) {
      try {
        content = await readFile(possiblePath, 'utf8');
        filePath = possiblePath;
        break;
      } catch (e) {
        // Continue to next path
      }
    }
    
    if (!content) {
      throw new Error(`Could not find file for slug: ${slugPath}`);
    }
    
    // Process the markdown content
    const { html, frontmatter } = await processMarkdown(content);
    
    // Extract title from frontmatter or first heading
    const title = frontmatter.title || 
      content.match(/^#\s+(.*)$/m)?.[1] || 
      slugPath.replace(/-/g, ' ').replace(/\//g, ' > ');
    
    // Get all docs for navigation
    async function getAllMarkdownFiles(dir) {
      const dirents = await readdir(dir, { withFileTypes: true });
      const files = await Promise.all(dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getAllMarkdownFiles(res) : res;
      }));
      return Array.prototype.concat(...files);
    }

    const allFiles = await getAllMarkdownFiles(docsDir);
    const markdownFiles = allFiles.filter(file =>
      file.endsWith('.md') && !path.basename(file).endsWith('README.md')
    );
    
    const docs = await Promise.all(
      markdownFiles.map(async (file) => {
        const relativePath = path.relative(docsDir, file);
        const slug = relativePath.replace(/\.md$/, '').replace(/\\/g, '/');
        
        let fileContent;
        try {
          fileContent = await readFile(file, 'utf8');
        } catch (e) {
          // Try with index.md for directories
          const indexPath = path.join(file, 'index.md');
          fileContent = await readFile(indexPath, 'utf8');
        }
        
        // Extract title (first # header)
        const titleMatch = fileContent.match(/^#\s+(.*)$/m);
        const title = titleMatch ? titleMatch[1] : path.basename(file, '.md');
        
        return {
          slug,
          title
        };
      })
    );
    
    // Sort docs alphabetically by title
    docs.sort((a, b) => a.title.localeCompare(b.title));
    
    // Use the original slug from params for consistency
    const originalSlug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;
    
    return {
      props: {
        doc: {
          slug: originalSlug,
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