// Simple test to check if there are any regex issues
const fs = require('fs');

// Extract the diagram content
const content = fs.readFileSync('docs/Action System/Action Exceptions.md', 'utf-8');
const start = content.indexOf('```mermaid');
const end = content.indexOf('```', start + 10);
const diagramContent = content.substring(start + 10, end).trim();

console.log("Diagram content:");
console.log(diagramContent);

// Test a simple regex that might be causing issues
try {
  const result = diagramContent.replace(/->/g, '-->');
  console.log("After -> replacement:");
  console.log(result.substring(0, 200));
} catch (e) {
  console.log("Error with regex:", e.message);
}