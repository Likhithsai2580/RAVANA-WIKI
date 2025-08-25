// Test the improved markdown processing function
const { processMarkdown, extractMermaidDiagrams } = require('./lib/markdown');

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

// Test the extract function first
console.log('=== Testing extractMermaidDiagrams function ===\n');
const diagrams = extractMermaidDiagrams(testDocument);
console.log(`Found ${diagrams.length} diagrams:\n`);
diagrams.forEach((diagram, index) => {
  console.log(`Diagram ${index + 1}:`);
  console.log('Content:', diagram.diagram);
  console.log();
});

// Now test the processMarkdown function
async function testProcessMarkdown() {
  console.log('=== Testing processMarkdown function ===\n');
  try {
    const { html } = await processMarkdown(testDocument);
    console.log('HTML output:\n');
    console.log(html);
    
    // Check for <div class="mermaid"> tags
    const mermaidDivs = html.match(/<div class="mermaid">([\s\S]*?)<\/div>/g);
    console.log(`\nFound ${mermaidDivs ? mermaidDivs.length : 0} mermaid divs:\n`);
    if (mermaidDivs) {
      mermaidDivs.forEach((div, index) => {
        console.log(`Mermaid div ${index + 1}:`);
        console.log(div);
        console.log();
      });
    }
  } catch (error) {
    console.error('Error processing markdown:', error);
  }
}

testProcessMarkdown().catch(console.error);