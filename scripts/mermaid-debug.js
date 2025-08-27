#!/usr/bin/env node

/**
 * Mermaid Diagram Debugging Script
 * 
 * This script scans documentation files for Mermaid diagrams and identifies
 * potential issues that could prevent proper rendering.
 */

const fs = require('fs');
const path = require('path');

// Universal regex pattern for all Mermaid formats
const mermaidRegex = /(?:``mermaid\s+([\s\S]*?)```)|(?:```mermaid\s+([\s\S]*?)``)|(?:```(?:\s*\n)?\s*mermaid\s*([\s\S]*?)```)|(?:`{1,3}mermaid\s+([\s\S]*?)`{1,3})|(?:`{1,3}\s*\n\s*mermaid\s*([\s\S]*?)`{1,3})|(?:``(?:\s*\n)?\s*(?:graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|pie|gantt|journey|requirementDiagram|gitGraph|erDiagram|quadrantChart)\s*([\s\S]*?)``)|(?:`{2}\s*(?:graph|flowchart)\s+TD\s+[A-Za-z0-9_-]+(?:\[[^\]]+\]|\(\[[^\]]+\]\))\s*(?:-->|->)([\s\S]*?)`{2})/gs;

// Function to scan a file for Mermaid diagrams
function scanFileForDiagrams(filePath) {
  const issues = [];
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let match;
    let diagramCount = 0;
    
    while ((match = mermaidRegex.exec(content)) !== null) {
      diagramCount++;
      const diagramContent = match[1] || match[2] || match[3] || match[4] || match[5];
      
      if (diagramContent) {
        const diagramIndex = match.index;
        const diagramLine = getLineNumber(content, diagramIndex);
        
        // Check for common issues
        const diagramIssues = validateDiagram(diagramContent, filePath, diagramLine, diagramCount);
        issues.push(...diagramIssues);
      }
    }
    
    if (diagramCount === 0) {
      issues.push({
        file: filePath,
        type: 'info',
        message: 'No Mermaid diagrams found in file'
      });
    }
    
  } catch (error) {
    issues.push({
      file: filePath,
      type: 'error',
      message: `Failed to read file: ${error.message}`
    });
  }
  
  return issues;
}

// Function to get line number from character index
function getLineNumber(content, index) {
  return content.substring(0, index).split('\n').length;
}

// Function to validate a diagram for common issues
function validateDiagram(diagramContent, filePath, lineNumber, diagramNumber) {
  const issues = [];
  const trimmedContent = diagramContent.trim();
  
  // Check if diagram is empty
  if (!trimmedContent) {
    issues.push({
      file: filePath,
      line: lineNumber,
      diagram: diagramNumber,
      type: 'error',
      message: 'Diagram is empty'
    });
    return issues;
  }
  
  // Check for missing diagram type declaration
  if (!trimmedContent.match(/^\s*(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|pie|gantt|journey|requirementDiagram|gitGraph|erDiagram|quadrantChart)/)) {
    issues.push({
      file: filePath,
      line: lineNumber,
      diagram: diagramNumber,
      type: 'warning',
      message: 'Diagram type not declared (e.g., graph TD, flowchart LR). This may cause rendering issues.'
    });
  }
  
  // Check for metadata sections that should be removed
  if (trimmedContent.includes('**Diagram sources**') || 
      trimmedContent.includes('**Section sources**')) {
    issues.push({
      file: filePath,
      line: lineNumber,
      diagram: diagramNumber,
      type: 'warning',
      message: 'Diagram contains metadata sections (**Diagram sources** or **Section sources**) that should be removed before rendering'
    });
  }
  
  // Check for style directives that might cause issues
  if (trimmedContent.includes('style ')) {
    // Check if style directives are properly formatted
    const styleLines = trimmedContent.split('\n').filter(line => line.trim().startsWith('style '));
    for (const line of styleLines) {
      if (!line.match(/^style\s+[A-Za-z0-9_-]+\s+[^}]+$/)) {
        issues.push({
          file: filePath,
          line: lineNumber,
          diagram: diagramNumber,
          type: 'warning',
          message: `Style directive may be malformed: "${line.trim()}"`
        });
      }
    }
  }
  
  // Check for round bracket node syntax that needs conversion
  if (trimmedContent.match(/[A-Za-z0-9_-]+\(\[[^\]]+\]\)/)) {
    issues.push({
      file: filePath,
      line: lineNumber,
      diagram: diagramNumber,
      type: 'info',
      message: 'Diagram contains round bracket node syntax ([text]) that should be converted to ("text") format'
    });
  }
  
  // Check for arrow syntax consistency
  if (trimmedContent.includes('->') && !trimmedContent.includes('-->')) {
    issues.push({
      file: filePath,
      line: lineNumber,
      diagram: diagramNumber,
      type: 'warning',
      message: 'Diagram uses -> arrow syntax instead of --> which may cause rendering issues'
    });
  }
  
  // Check for missing line breaks between nodes
  if (trimmedContent.match(/[A-Za-z0-9_-]+\[[^\]]+\][A-Za-z0-9_-]+\[/)) {
    issues.push({
      file: filePath,
      line: lineNumber,
      diagram: diagramNumber,
      type: 'warning',
      message: 'Missing line breaks between node definitions which may cause parsing issues'
    });
  }
  
  // Check for unbalanced quotes
  const singleQuotes = (trimmedContent.match(/'/g) || []).length;
  const doubleQuotes = (trimmedContent.match(/"/g) || []).length;
  
  if (singleQuotes % 2 !== 0) {
    issues.push({
      file: filePath,
      line: lineNumber,
      diagram: diagramNumber,
      type: 'error',
      message: 'Unbalanced single quotes detected'
    });
  }
  
  if (doubleQuotes % 2 !== 0) {
    issues.push({
      file: filePath,
      line: lineNumber,
      diagram: diagramNumber,
      type: 'error',
      message: 'Unbalanced double quotes detected'
    });
  }
  
  return issues;
}

// Function to recursively scan directory for markdown files
function scanDirectory(dirPath) {
  const issues = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      issues.push(...scanDirectory(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.markdown'))) {
      issues.push(...scanFileForDiagrams(fullPath));
    }
  }
  
  return issues;
}

// Function to format and display issues
function displayIssues(issues) {
  if (issues.length === 0) {
    console.log('✅ No issues found!');
    return;
  }
  
  // Group issues by type
  const errors = issues.filter(issue => issue.type === 'error');
  const warnings = issues.filter(issue => issue.type === 'warning');
  const info = issues.filter(issue => issue.type === 'info');
  
  console.log(`\n🔍 Mermaid Diagram Analysis Results:`);
  console.log(`\n❌ Errors (${errors.length}):`);
  errors.forEach(issue => {
    if (issue.diagram) {
      console.log(`  File: ${issue.file}:${issue.line} (Diagram ${issue.diagram})`);
    } else {
      console.log(`  File: ${issue.file}`);
    }
    console.log(`    ${issue.message}\n`);
  });
  
  console.log(`⚠️  Warnings (${warnings.length}):`);
  warnings.forEach(issue => {
    if (issue.diagram) {
      console.log(`  File: ${issue.file}:${issue.line} (Diagram ${issue.diagram})`);
    } else {
      console.log(`  File: ${issue.file}`);
    }
    console.log(`    ${issue.message}\n`);
  });
  
  console.log(`ℹ️  Info (${info.length}):`);
  info.forEach(issue => {
    if (issue.diagram) {
      console.log(`  File: ${issue.file}:${issue.line} (Diagram ${issue.diagram})`);
    } else {
      console.log(`  File: ${issue.file}`);
    }
    console.log(`    ${issue.message}\n`);
  });
  
  // Summary
  console.log(`\n📊 Summary:`);
  console.log(`  - Errors: ${errors.length}`);
  console.log(`  - Warnings: ${warnings.length}`);
  console.log(`  - Info: ${info.length}`);
  
  // Return appropriate exit code
  if (errors.length > 0) {
    process.exit(1);
  }
}

// Main execution
function main() {
  const docsPath = path.join(__dirname, '..', 'docs');
  
  if (!fs.existsSync(docsPath)) {
    console.error('❌ Documentation directory not found');
    process.exit(1);
  }
  
  console.log('🔍 Scanning documentation for Mermaid diagram issues...\n');
  
  const issues = scanDirectory(docsPath);
  displayIssues(issues);
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  scanFileForDiagrams,
  scanDirectory,
  validateDiagram
};