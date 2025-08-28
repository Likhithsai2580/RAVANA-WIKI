import Mermaid from './Mermaid';

const MermaidRenderer = ({ content }) => {
  // Simple regex to extract mermaid diagrams
  const extractDiagrams = (htmlContent) => {
    if (!htmlContent) {
      return [{ type: 'text', content: '' }];
    }
    
    // Simple regex to match mermaid div containers
    const mermaidRegex = /<div\s+class=["']mermaid["'][^>]*>([\s\S]*?)<\/div>/gi;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = mermaidRegex.exec(htmlContent)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: htmlContent.substring(lastIndex, match.index)
        });
      }

      // Add the mermaid diagram
      parts.push({
        type: 'mermaid',
        content: match[1].trim()
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