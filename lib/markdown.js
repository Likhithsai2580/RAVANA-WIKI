import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import matter from 'gray-matter';

export async function processMarkdown(content) {
  // Parse frontmatter if exists
  const { data, content: markdownContent } = matter(content);
  
  // Process markdown with remark first
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml)
    .process(markdownContent);
  
  // Convert the result back to string
  let processedHtml = result.toString();
  
  // Handle mermaid code blocks specially - convert pre elements with mermaid language to divs
  // This pattern handles both standard triple backtick format and simplified single backtick format
  processedHtml = processedHtml.replace(
    /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
    '<div class="mermaid">$1</div>'
  );
  
  // Also handle cases where mermaid might be in a code block without language class
  processedHtml = processedHtml.replace(
    /<pre><code>([\s\S]*?)mermaid([\s\S]*?)<\/code><\/pre>/g,
    '<div class="mermaid">$1$2</div>'
  );
  
  // Return processed HTML and frontmatter
  return {
    html: processedHtml,
    frontmatter: data
  };
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