import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markdown';
import matter from 'gray-matter';

// Configure Prism to handle code blocks
if (typeof window !== 'undefined') {
  // Load Prism components on client-side only
  require('prismjs/components/prism-javascript');
  require('prismjs/components/prism-typescript');
  require('prismjs/components/prism-python');
  require('prismjs/components/prism-bash');
  require('prismjs/components/prism-json');
  require('prismjs/components/prism-yaml');
  require('prismjs/components/prism-markdown');
}

export async function processMarkdown(content) {
  // Parse frontmatter if exists
  const { data, content: markdownContent } = matter(content);
  
  // Handle mermaid code blocks specially - convert code blocks that contain just "mermaid" followed by diagram
  // This improved pattern handles both standard triple backtick format and simplified single backtick format
  let processedContent = markdownContent.replace(
    /(?:```(?:\s*\n)?\s*mermaid\s*([\s\S]*?)```)|(?:`{1,3}mermaid\s+([\s\S]*?)`{1,3})/gs,
    (match, tripleBacktickContent, singleBacktickContent) => {
      // Use the appropriate captured group depending on the format
      const diagramContent = tripleBacktickContent || singleBacktickContent;
      // Convert mermaid code blocks to divs that can be processed by mermaid.js
      return `<div class="mermaid">${diagramContent.trim()}</div>`;
    }
  );
  
  // Process remaining markdown with remark
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml)
    .process(processedContent);
  
  // Return processed HTML and frontmatter
  return {
    html: result.toString(),
    frontmatter: data
  };
}

export function highlightCode(html) {
  // This function will be used client-side to highlight code blocks
  if (typeof window !== 'undefined' && window.Prism) {
    // Highlight all code blocks
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
      window.Prism.highlightElement(block);
    });
  }
  return html;
}

// Function to extract mermaid diagrams from markdown content
export function extractMermaidDiagrams(content) {
  // Improved regex pattern that handles both triple backtick format and simplified single backtick format
  const mermaidRegex = /(?:```(?:\s*\n)?\s*mermaid\s*([\s\S]*?)```)|(?:`{1,3}mermaid\s+([\s\S]*?)`{1,3})/gs;
  const diagrams = [];
  let match;
  
  while ((match = mermaidRegex.exec(content)) !== null) {
    // Use the appropriate captured group depending on the format
    const diagramContent = match[1] || match[2];
    if (diagramContent) {
      diagrams.push({
        index: match.index,
        diagram: diagramContent.trim()
      });
    }
  }
  
  return diagrams;
}