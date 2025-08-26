import { useEffect } from 'react';
import Mermaid from './Mermaid';

/**
 * Renders Mermaid diagrams from the provided content.
 *
 * The function extracts Mermaid diagrams from the HTML content using a regex pattern that captures various class formats and whitespace variations. It processes the content to separate text and diagram parts, ensuring that all content is rendered appropriately. If no diagrams are found, the original content is returned as text.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.content - The HTML content containing Mermaid diagrams.
 * @returns {JSX.Element} The rendered Mermaid diagrams and text content.
 */
const MermaidRenderer = ({ content }) => {
  // Extract mermaid diagrams from content
  /**
   * Extracts Mermaid diagrams and text from the provided HTML content.
   *
   * This function processes the input `htmlContent` to identify and extract
   * Mermaid diagram elements encapsulated within specific `<div>` tags. It uses
   * a regular expression to match various class formats and whitespace variations.
   * The function constructs an array of parts, distinguishing between text and
   * diagram content, and handles cases where no diagrams are found or where the
   * input content is null or undefined.
   *
   * @param {string} htmlContent - The HTML content to extract diagrams from.
   */
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