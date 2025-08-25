// Test to handle different mermaid syntax formats
const testCases = [
  {
    name: 'Triple backtick with mermaid keyword',
    content: '```mermaid\ngraph TD\nA[AGISystem] --> B[SharedState]\nA --> C[Config]\n```'
  },
  {
    name: 'Simplified syntax without backticks',
    content: '`mermaid graph TD A[RAVANA Project] --> B[core] A --> C[database] A --> D[modules] A --> E[services] A --> F[tests]`'
  },
  {
    name: 'Simplified syntax with double backticks',
    content: '``mermaid graph TD A[RAVANA Project] --> B[core] A --> C[database] A --> D[modules]``'
  },
  {
    name: 'Standard multiline triple backtick',
    content: '```\nmermaid\ngraph TD\nA[AGISystem] --> B[SharedState]\nA --> C[Config]\n```'
  }
];

// Test patterns
const patterns = [
  {
    name: 'Current regex pattern',
    regex: /```(?:\s*\n)?\s*mermaid\s*([\s\S]*?)```/gs
  },
  {
    name: 'Single backtick pattern',
    regex: /`mermaid\s+(.*?)`/gs
  },
  {
    name: 'Double backtick pattern',
    regex: /``mermaid\s+(.*?)``/gs
  },
  {
    name: 'Combined pattern',
    regex: /(?:```(?:\s*\n)?\s*mermaid\s*([\s\S]*?)```)|(?:`mermaid\s+([\s\S]*?)`)/gs
  },
  {
    name: 'Universal pattern',
    regex: /(?:```(?:\s*\n)?\s*mermaid\s*([\s\S]*?)```)|(?:`{1,3}mermaid\s+([\s\S]*?)`{1,3})/gs
  }
];

// Test all patterns against all formats
console.log('=== Testing Mermaid Syntax Patterns ===\n');

testCases.forEach((testCase, index) => {
  console.log(`\n--- Test Case ${index + 1}: ${testCase.name} ---`);
  console.log('Input content:', testCase.content);
  
  patterns.forEach(pattern => {
    console.log(`\nTesting pattern: ${pattern.name}`);
    
    // Reset regex
    const regex = new RegExp(pattern.regex);
    
    let match;
    let matchCount = 0;
    
    if (pattern.name === 'Universal pattern') {
      // Special handling for universal pattern with multiple capture groups
      const matches = testCase.content.match(pattern.regex);
      if (matches) {
        console.log('Match found!');
        // Extract the diagram content from the appropriate capture group
        let diagramContent;
        if (testCase.content.includes('```mermaid') || testCase.content.includes('```\nmermaid')) {
          // For triple backtick syntax, use the first capture group
          diagramContent = testCase.content.replace(pattern.regex, '$1');
        } else {
          // For single/double backtick syntax, use the second capture group
          diagramContent = testCase.content.replace(pattern.regex, '$2');
        }
        console.log('Extracted diagram content:', diagramContent);
        
        // Test replacement with a function to handle multiple capture groups
        const processed = testCase.content.replace(pattern.regex, (match, tripleBacktickContent, singleBacktickContent) => {
          const content = tripleBacktickContent || singleBacktickContent;
          return `<div class="mermaid">${content.trim()}</div>`;
        });
        console.log('Processed content:', processed);
      } else {
        console.log('No match found');
      }
    } else {
      // Standard regex testing
      while ((match = regex.exec(testCase.content)) !== null) {
        matchCount++;
        console.log(`Match found at index ${match.index}`);
        console.log('Matched content:', match[0]);
        
        // Handle multiple capture groups
        const content = match[1] || match[2] || '';
        console.log('Captured content:', content);
        
        // Test replacement
        const processed = testCase.content.replace(pattern.regex, (_, group1, group2) => {
          const content = group1 || group2 || '';
          return `<div class="mermaid">${content.trim()}</div>`;
        });
        console.log('Processed content:', processed);
      }
      
      if (matchCount === 0) {
        console.log('No match found');
      }
    }
  });
});