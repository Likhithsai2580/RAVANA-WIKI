import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import matter from 'gray-matter';

// Enhanced regex pattern to catch all variations of Mermaid code blocks
const mermaidRegex = /(?:```(?:\s*\n)?\s*mermaid\s*([\s\S]*?)```)|(?:`{1,3}mermaid\s+([\s\S]*?)`{1,3})|(?:`{1,3}\s*\n\s*mermaid\s*([\s\S]*?)`{1,3})|(?:``(?:\s*\n)?\s*(?:graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|pie|gantt|journey|requirementDiagram|gitGraph|erDiagram|quadrantChart)\s*([\s\S]*?)``)|(?:`{2}\s*(?:graph|flowchart)\s+TD\s+[A-Za-z0-9_-]+(?:\[[^\]]+\]|\(\[[^\]]+\]\))\s*(?:-->|->)([\s\S]*?)`{2})/gs;

// Function to normalize mermaid diagram content
const normalizeMermaidContent = (content) => {
  // Remove metadata sections
  if (content.includes('**Diagram sources**') || 
      content.includes('**Section sources**')) {
    const sourcesIndex = Math.min(
      content.includes('**Diagram sources**') ? content.indexOf('**Diagram sources**') : Number.MAX_SAFE_INTEGER,
      content.includes('**Section sources**') ? content.indexOf('**Section sources**') : Number.MAX_SAFE_INTEGER
    );
    
    if (sourcesIndex !== Number.MAX_SAFE_INTEGER) {
      content = content.substring(0, sourcesIndex).trim();
    }
  }
  
  // Handle style directives
  if (content.includes('style ')) {
    const styleMatch = content.match(/([\s\S]*?)\bstyle\s+[A-Za-z0-9_-]+/);
    if (styleMatch && styleMatch[1]) {
      content = styleMatch[1].trim();
    } else {
      content = content.replace(/\bstyle\s+[A-Za-z0-9_-]+\s+[^\n]+/g, '');
    }
  }
  
  // Handle round bracket nodes
  content = content.replace(/([A-Za-z0-9_-]+)\(\[([^\]]+)\]\)/g, '$1(["$2"])');
  
  // Handle alphanumeric node identifiers
  content = content.replace(/([A-Za-z0-9_-]+)\[([^\]]+)\]\s*(-->|->)\s*([A-Za-z0-9_-]+)/g, '$1[$2]\n$1 $3 $4');
  
  // Standardize arrow syntax
  content = content.replace(/->/g, '-->');
  
  // Add line breaks between nodes
  content = content.replace(/([A-Za-z0-9_-]+)\[([^\]]+)\]\s+([A-Za-z0-9_-]+)\[/g, '$1[$2]\n$3[');
  
  // Handle edge labels
  content = content.replace(/([A-Za-z0-9_-]+)\s+-->\s+\|([^|]+)\|\s+([A-Za-z0-9_-]+)/g, '$1 -->|$2| $3');
  
  // Ensure diagram type is declared
  if (!content.match(/^\s*(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|pie|gantt|journey|requirementDiagram|gitGraph|erDiagram|quadrantChart)/)) {
    if (content.includes('-->') || content.includes('-->|')) {
      content = 'flowchart TD\n' + content;
    } else {
      content = 'graph TD\n' + content;
    }
  }
  
  // Clean up whitespace
  content = content.replace(/\s{2,}/g, ' ').trim();
  
  return content;
};

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
  
  // Replace all mermaid code blocks with div elements
  processedHtml = processedHtml.replace(mermaidRegex, (match, p1, p2, p3, p4, p5) => {
    // Use the appropriate captured group depending on the format
    const diagramContent = p1 || p2 || p3 || p4 || p5;
    if (diagramContent) {
      // For inline graph format, add proper formatting
      let processedDiagram = diagramContent;
      
      // Check if this is an inline graph TD format with no proper line breaks
      if (match.match(/`{2}\s*(?:graph|flowchart)\s+TD\s+[A-Za-z0-9_-]+\[[^\]]+\]\s*(?:-->|->)/)) {
        // Extract the full content including the graph TD declaration
        const fullContent = match.replace(/^`{2}\s*/, '').replace(/`{2}$/, '');
        processedDiagram = fullContent.trim();
      }
      
      // Normalize the diagram content
      processedDiagram = normalizeMermaidContent(processedDiagram);
      
      return `<div class="mermaid">${processedDiagram}</div>`;
    }
    return match;
  });
  
  // Handle any remaining mermaid code blocks with language-mermaid class
  processedHtml = processedHtml.replace(
    /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
    '<div class="mermaid">$1</div>'
  );
  
  // Handle cases where mermaid might be in a code block without language class
  processedHtml = processedHtml.replace(
    /<pre><code>([\s\S]*?)mermaid([\s\S]*?)<\/code><\/pre>/g,
    '<div class="mermaid">$1$2</div>'
  );
  
  // Handle diagram types directly
  processedHtml = processedHtml.replace(
    /<pre><code>\s*(graph TD|flowchart TD|sequenceDiagram|classDiagram|stateDiagram|pie|gantt|journey|requirementDiagram|gitGraph|erDiagram|quadrantChart)(([\s\S]*?))<\/code><\/pre>/g,
    '<div class="mermaid">$1$2</div>'
  );
  
  // Handle diagram types with other language classes
  processedHtml = processedHtml.replace(
    /<pre><code class="[^"]*">\s*(graph TD|flowchart TD|sequenceDiagram|classDiagram|stateDiagram|pie|gantt|journey|requirementDiagram|gitGraph|erDiagram|quadrantChart)(([\s\S]*?))<\/code><\/pre>/g,
    '<div class="mermaid">$1$2</div>'
  );
  
  // Handle the inline format
  processedHtml = processedHtml.replace(
    /<pre><code>\s*(graph TD|flowchart TD)\s+([A-Z])\[([^\]]+)\]\s*(-->|->)(([\s\S]*?))<\/code><\/pre>/g,
    '<div class="mermaid">$1\n$2[$3]\n$2 $4$5</div>'
  );
  
  // Handle case when no diagram type is specified but there are node definitions
  processedHtml = processedHtml.replace(
    /<pre><code>\s*([A-Z])\[([^\]]+)\]\s*(-->|->)\s*([A-Z])(([\s\S]*?))<\/code><\/pre>/g,
    '<div class="mermaid">graph TD\n$1[$2]\n$1 $3 $4$5</div>'
  );
  
  // Return processed HTML and frontmatter
  return {
    html: processedHtml,
    frontmatter: data
  };
}

// Function to extract mermaid diagrams from markdown content
export function extractMermaidDiagrams(content) {
  const diagrams = [];
  let match;
  
  while ((match = mermaidRegex.exec(content)) !== null) {
    // Use the appropriate captured group depending on the format
    const diagramContent = match[1] || match[2] || match[3] || match[4] || match[5];
    if (diagramContent) {
      // For inline graph format, add proper formatting
      let processedDiagram = diagramContent;
      
      // Check if this is an inline graph TD format with no proper line breaks
      if (match[0].match(/`{2}\s*(?:graph|flowchart)\s+TD\s+[A-Za-z0-9_-]+\[[^\]]+\]\s*(?:-->|->)/)) {
        // Extract the full content including the graph TD declaration
        const fullContent = match[0].replace(/^`{2}\s*/, '').replace(/`{2}$/, '');
        processedDiagram = fullContent.trim();
      }
      
      // Normalize the diagram content
      processedDiagram = normalizeMermaidContent(processedDiagram);
      
      diagrams.push({
        index: match.index,
        diagram: processedDiagram
      });
    }
  }
  
  return diagrams;
}