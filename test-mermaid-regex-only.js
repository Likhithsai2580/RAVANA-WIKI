// Simplified test for the improved Mermaid regex pattern

// Test with a sample document that contains different Mermaid diagram formats
const testDocument = `# RAVANA AGI Documentation

## Project Structure

The RAVANA project is structured into several core directories:

\`mermaid graph TD A[RAVANA Project] --> B[core] A --> C[database] A --> D[modules] A --> E[services] A --> F[tests]\`

The \`core\` directory contains:

\`\`\`mermaid
graph TD
A[AGISystem] --> B[SharedState]
A --> C[Config]
\`\`\`

## Class Diagrams

AGISystem class:

\`\`\`
mermaid
classDiagram
class AGISystem {
  +engine : Engine
  +session : Session
  +config : Config
}
\`\`\`

SharedState class:

\`\`mermaid classDiagram class SharedState { +mood : Dict[str, float] +current_situation : Dict[str, Any] }\`\`

## Architecture Overview

RAVANA follows a modular, event-driven architecture:

\`\`\`mermaid
graph TD
A[AGISystem] --> B[Data Service]
A --> C[Knowledge Service]
A --> D[Memory Service]
\`\`\`
`;

// Improved regex pattern that handles both triple backtick format and simplified single backtick format
const mermaidRegex = /(?:```(?:\s*\n)?\s*mermaid\s*([\s\S]*?)```)|(?:`{1,3}mermaid\s+([\s\S]*?)`{1,3})/gs;

// Extract all Mermaid diagrams
const extractMermaidDiagrams = (content) => {
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
};

// Process Mermaid diagrams
const processMermaidDiagrams = (content) => {
  return content.replace(
    mermaidRegex,
    (match, tripleBacktickContent, singleBacktickContent) => {
      // Use the appropriate captured group depending on the format
      const diagramContent = tripleBacktickContent || singleBacktickContent;
      // Convert mermaid code blocks to divs that can be processed by mermaid.js
      return `<div class="mermaid">${diagramContent.trim()}</div>`;
    }
  );
};

// Test the extract function
console.log('=== Testing extractMermaidDiagrams function ===\n');
const diagrams = extractMermaidDiagrams(testDocument);
console.log(`Found ${diagrams.length} diagrams:\n`);
diagrams.forEach((diagram, index) => {
  console.log(`Diagram ${index + 1}:`);
  console.log('Content:', diagram.diagram);
  console.log();
});

// Test the process function
console.log('=== Testing processMermaidDiagrams function ===\n');
const processedContent = processMermaidDiagrams(testDocument);
console.log('Processed content:\n');
console.log(processedContent);