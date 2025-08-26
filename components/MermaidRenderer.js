import { useEffect } from 'react';
import Mermaid from './Mermaid';

const MermaidRenderer = ({ content }) => {
  // Extract mermaid diagrams from content
  const extractDiagrams = (htmlContent) => {
    // Handle case where content might be null or undefined
    if (!htmlContent) {
      return [{ type: 'text', content: '' }];
    }
    
    // Enhanced regex to catch all variations of Mermaid div containers
    // This pattern handles various class formats and whitespace variations
    const mermaidRegex = /<div\s+class=["']mermaid["'][^>]*>([\s\S]*?)<\/div>|<div\s+[^>]*?class=["'][^"']*?mermaid[^"']*?["'][^>]*?>([\s\S]*?)<\/div>/gi;
    const parts = [];
    let match;
    let lastIndex = 0;

    while ((match = mermaidRegex.exec(htmlContent)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: htmlContent.substring(lastIndex, match.index)
        });
      }

      // Add the mermaid diagram (use whichever captured group contains content)
      const diagramContent = match[1] || match[2];
      parts.push({
        type: 'mermaid',
        content: diagramContent.trim()
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < htmlContent.length) {
      parts.push({
        type: 'text',
        content: htmlContent.substring(lastIndex)
      });
    }
    
    // Handle case where there are no mermaid diagrams
    if (parts.length === 0) {
      parts.push({
        type: 'text',
        content: htmlContent
      });
    }

    return parts;
  };

  const parts = extractDiagrams(content);

  return (
    <div>
      {parts.map((part, index) => {
        if (part.type === 'mermaid') {
          return <Mermaid key={index} chart={part.content} />;
        } else {
          return <div key={index} dangerouslySetInnerHTML={{ __html: part.content }} />;
        }
      })}
    </div>
  );
};

export default MermaidRenderer;