// Simple test to extract and show the diagram
const fs = require('fs');

// Extract the diagram content
const content = fs.readFileSync('docs/Action System/Action Exceptions.md', 'utf-8');
const start = content.indexOf('```mermaid');
const end = content.indexOf('```', start + 10);
console.log("Start position:", start);
console.log("End position:", end);
const diagramContent = content.substring(start + 10, end).trim();

console.log("Diagram content length:", diagramContent.length);
console.log("First 100 chars:", diagramContent.substring(0, 100));
console.log("Last 100 chars:", diagramContent.substring(diagramContent.length - 100));