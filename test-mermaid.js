// Test with various mermaid formats that might appear in your content
const content1 = "```\nmermaid\ngraph TD\nA[AGISystem] --> B[SharedState]\nA --> C[Config]\n```\n\nSome text after the diagram.";
const content2 = "```mermaid\ngraph TD\nA[AGISystem] --> B[SharedState]\nA --> C[Config]\n```\n\nSome text after the diagram.";
const content3 = "\n```\nmermaid\nclassDiagram\nclass AGISystem {\n  +engine : Engine\n}\n```\n";
const content4 = "\n```mermaid\nclassDiagram class AGISystem { +engine : Engine +session : Session +config : Config }\n```\n";

console.log('=== Testing Different Mermaid Formats ===');
console.log('\nContent 1 (newline format):');
console.log(content1);
console.log('\nContent 2 (inline format):');
console.log(content2);
console.log('\nContent 3 (class diagram with newlines):');
console.log(content3);
console.log('\nContent 4 (class diagram single line):');
console.log(content4);

// Test different regex patterns for all the different formats
const patterns = [
  { name: 'Format 1: \n between backticks and mermaid', regex: /```\s*\nmermaid\s*\n([\s\S]*?)\n```/g },
  { name: 'Format 2: mermaid on same line as opening backticks', regex: /```mermaid\s*\n([\s\S]*?)\n```/g },
  { name: 'Format 3: Flexible whitespace', regex: /```\s*mermaid\s*([\s\S]*?)\s*```/g },
  { name: 'Format 4: Combined pattern (most flexible)', regex: /```(?:\s*\n)?\s*mermaid\s*(?:\n)?([\s\S]*?)\n```/g }
];

const contents = [content1, content2, content3, content4];

// Test all patterns against all contents
patterns.forEach(pattern => {
  console.log('\n\n=== Testing Pattern: ' + pattern.name + ' ===');
  console.log('Regex:', pattern.regex.toString());
  
  contents.forEach((content, index) => {
    console.log(`\n-- Testing against Content ${index + 1} --`);
    
    // Reset regex lastIndex
    pattern.regex.lastIndex = 0;
    
    let match;
    let matchCount = 0;
    while ((match = pattern.regex.exec(content)) !== null) {
      matchCount++;
      console.log(`Match ${matchCount} at index:`, match.index);
      console.log('Matched content:', JSON.stringify(match[0]));
      console.log('Captured group:', JSON.stringify(match[1]));
      
      // Test replacement
      const result = content.replace(
        pattern.regex,
        (_, diagramContent) => {
          return `<div class="mermaid">${diagramContent.trim()}</div>`;
        }
      );
      
      console.log('After replacement:');
      console.log(result);
    }
    
    if (matchCount === 0) {
      console.log('No matches found for this pattern and content');
    }
  });
});

// Final proposed pattern based on tests
console.log('\n\n=== PROPOSED SOLUTION ===');
const proposedRegex = /```(?:\s*\n)?\s*mermaid\s*([\s\S]*?)```/gs;
console.log('Proposed regex:', proposedRegex.toString());

// Test this pattern with each content
contents.forEach((content, index) => {
  console.log(`\n-- Testing proposed solution on Content ${index + 1} --`);
  
  // Reset regex lastIndex
  proposedRegex.lastIndex = 0;
  
  const result = content.replace(
    proposedRegex,
    (_, diagramContent) => {
      return `<div class="mermaid">${diagramContent.trim()}</div>`;
    }
  );
  
  console.log('Result:');
  console.log(result);
});