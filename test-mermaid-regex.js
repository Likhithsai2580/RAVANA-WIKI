// Test with different mermaid diagram formats
const testCases = [
  {
    name: 'Standard format with newlines',
    content: `# Test Document

Here's a mermaid diagram:

\`\`\`
mermaid
graph TD
A[AGISystem] --> B[SharedState]
A --> C[Config]
\`\`\`

More content after the diagram.`
  },
  {
    name: 'Inline format',
    content: `# Test Document

Here's a mermaid diagram:

\`\`\`mermaid
graph TD
A[AGISystem] --> B[SharedState]
A --> C[Config]
\`\`\`

More content after the diagram.`
  },
  {
    name: 'Class diagram with newlines',
    content: `# Test Document

Here's a class diagram:

\`\`\`
mermaid
classDiagram
class AGISystem {
  +engine : Engine
  +session : Session
  +config : Config
}
\`\`\`

More content after the diagram.`
  },
  {
    name: 'Class diagram on single line',
    content: `# Test Document

Here's a complex class diagram:

\`\`\`mermaid
classDiagram class AGISystem { +engine : Engine +session : Session +config : Config +embedding_model : ShutdownCoordinator +shared_state : SharedState +behavior_modifiers : Dict[str, Any] }
\`\`\`

More content after the diagram.`
  },
  {
    name: 'Multiple diagrams',
    content: `# Test Document

Here's a graph diagram:

\`\`\`mermaid
graph TD
A[AGISystem] --> B[SharedState]
A --> C[Config]
\`\`\`

And here's a class diagram:

\`\`\`
mermaid
classDiagram
class AGISystem {
  +engine : Engine
}
\`\`\`

More content after the diagrams.`
  }
];

// Define the improved regex pattern
const mermaidRegex = /```(?:\s*\n)?\s*mermaid\s*([\s\S]*?)```/gs;

// Test extractMermaidDiagrams function
console.log('=== Testing Mermaid Regex Pattern ===\n');
testCases.forEach((testCase, index) => {
  console.log(`\n--- Test Case ${index + 1}: ${testCase.name} ---`);
  console.log('Input content:');
  console.log(testCase.content);
  
  // Reset regex
  mermaidRegex.lastIndex = 0;
  
  // Find all matches
  const diagrams = [];
  let match;
  while ((match = mermaidRegex.exec(testCase.content)) !== null) {
    diagrams.push({
      index: match.index,
      diagram: match[1].trim()
    });
  }
  
  console.log(`\nFound ${diagrams.length} diagrams:`);
  diagrams.forEach((diagram, i) => {
    console.log(`\nDiagram ${i + 1}:`);
    console.log('Index:', diagram.index);
    console.log('Content:', diagram.diagram);
  });
  
  // Test replacement
  mermaidRegex.lastIndex = 0;
  const processedContent = testCase.content.replace(
    mermaidRegex,
    (_, diagramContent) => {
      return `<div class="mermaid">${diagramContent.trim()}</div>`;
    }
  );
  
  console.log('\nProcessed content:');
  console.log(processedContent);
});