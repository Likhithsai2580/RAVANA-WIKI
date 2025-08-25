const { processMarkdown, extractMermaidDiagrams } = require('./lib/markdown');

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

// Test extractMermaidDiagrams function
console.log('=== Testing extractMermaidDiagrams function ===\n');
testCases.forEach((testCase, index) => {
  console.log(`\n--- Test Case ${index + 1}: ${testCase.name} ---`);
  console.log('Input content:');
  console.log(testCase.content);
  
  const diagrams = extractMermaidDiagrams(testCase.content);
  console.log(`\nFound ${diagrams.length} diagrams:`);
  diagrams.forEach((diagram, i) => {
    console.log(`\nDiagram ${i + 1}:`);
    console.log('Index:', diagram.index);
    console.log('Content:', diagram.diagram);
  });
});

// Test processMarkdown function
console.log('\n\n=== Testing processMarkdown function ===\n');

// Only test the first 2 cases for brevity
const processTests = testCases.slice(0, 2);

async function runProcessTests() {
  for (let i = 0; i < processTests.length; i++) {
    const testCase = processTests[i];
    console.log(`\n--- Test Case ${i + 1}: ${testCase.name} ---`);
    console.log('Input content:');
    console.log(testCase.content);
    
    try {
      const { html } = await processMarkdown(testCase.content);
      console.log('\nProcessed HTML:');
      console.log(html);
    } catch (error) {
      console.error('Error processing markdown:', error);
    }
  }
}

runProcessTests().catch(console.error);