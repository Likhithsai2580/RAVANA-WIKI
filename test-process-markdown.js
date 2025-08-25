const { processMarkdown } = require('./lib/markdown');

// Test content with mermaid diagrams
const testContent = `---
title: Test Mermaid Diagrams
---

# Test Mermaid Diagrams

This page tests various Mermaid diagram formats.

## Standard Format

\`\`\`mermaid
graph TD
A[AGISystem] --> B[SharedState]
A --> C[Config]
\`\`\`

## Multiline Format

\`\`\`
mermaid
graph TD
D[Database] --> E[Models]
D --> F[Engine]
\`\`\`

## Class Diagram

\`\`\`mermaid
classDiagram
class AGISystem {
  +engine : Engine
  +session : Session
  +config : Config
}
\`\`\``;

async function testProcessMarkdown() {
  console.log('Original content:');
  console.log(testContent);
  
  console.log('\nProcessing markdown...');
  const { html } = await processMarkdown(testContent);
  
  console.log('\nProcessed HTML:');
  console.log(html);
  
  // Check if mermaid divs are created
  const mermaidDivs = html.match(/<div class="mermaid">([\s\S]*?)<\/div>/g);
  
  if (mermaidDivs) {
    console.log(`\nFound ${mermaidDivs.length} Mermaid diagrams:`);
    mermaidDivs.forEach((div, index) => {
      console.log(`\nDiagram ${index + 1}:`);
      console.log(div);
    });
  } else {
    console.log('\nNo Mermaid diagrams found in processed HTML');
  }
}

testProcessMarkdown().catch(console.error);