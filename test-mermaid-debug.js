const { extractMermaidDiagrams } = require('./lib/markdown');

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

console.log('Testing extractMermaidDiagrams function:');
const diagrams = extractMermaidDiagrams(testContent);
console.log(`Found ${diagrams.length} diagrams:`);
diagrams.forEach((diagram, index) => {
  console.log(`\nDiagram ${index + 1}:`);
  console.log('Content:', diagram.diagram);
});

console.log('\nTesting regex directly:');
const regex = /(?:\`\`\`(?:\\s*\\n)?\\s*mermaid\\s*([\\s\\S]*?)\`\`\`)|(?:\`{1,3}mermaid\\s+([\\s\\S]*?)\`{1,3})/gs;
let match;
let count = 0;
while ((match = regex.exec(testContent)) !== null) {
  count++;
  console.log(`\nMatch ${count}:`);
  console.log('Full match:', match[0]);
  console.log('Group 1:', match[1]);
  console.log('Group 2:', match[2]);
}