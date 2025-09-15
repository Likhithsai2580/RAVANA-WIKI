#!/usr/bin/env node

/**
 * Class Diagram Fixer Script
 * 
 * This script identifies and reports class diagrams that use problematic
 * inheritance arrow syntax that can cause rendering issues.
 */

const fs = require('fs');
const path = require('path');

// Regex to find class diagrams with inheritance arrows
const classDiagramRegex = /```mermaid\s*\n\s*classDiagram\s*\n([\s\S]*?)```/g;
const inheritanceArrowRegex = /(<\|--|--\|>)/g;

// Function to scan a file for problematic class diagrams
/**
 * Scans a file for problematic class diagrams.
 *
 * This function reads the content of a specified file and searches for class diagrams using a regular expression.
 * It counts the diagrams and checks for the presence of problematic inheritance arrows. If found, it records the
 * issues along with their line numbers and relevant messages. In case of a file read error, it captures the error
 * message and adds it to the issues list.
 *
 * @param {string} filePath - The path to the file to be scanned for diagrams.
 */
function scanFileForProblematicDiagrams(filePath) {
  const issues = [];
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let match;
    let diagramCount = 0;
    
    while ((match = classDiagramRegex.exec(content)) !== null) {
      diagramCount++;
      const diagramContent = match[1];
      
      if (inheritanceArrowRegex.test(diagramContent)) {
        const diagramIndex = match.index;
        const diagramLine = getLineNumber(content, diagramIndex);
        
        issues.push({
          file: filePath,
          line: diagramLine,
          diagram: diagramCount,
          type: 'class-diagram-issue',
          message: 'Class diagram uses problematic inheritance arrows (<|-- or --|>) that may cause rendering errors',
          diagramContent: diagramContent.trim()
        });
      }
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
/**
 * Returns the line number of a character at a given index in the content.
 */
function getLineNumber(content, index) {
  return content.substring(0, index).split('\n').length;
}

// Function to recursively scan directory for markdown files
/**
 * Scans a directory for Markdown files and problematic diagrams.
 *
 * The function reads the contents of the specified directory and iterates through each entry.
 * If an entry is a directory, it recursively scans that directory. If it is a Markdown file,
 * it checks for problematic diagrams using the scanFileForProblematicDiagrams function.
 * All identified issues are collected and returned as an array.
 *
 * @param {string} dirPath - The path of the directory to scan.
 */
function scanDirectory(dirPath) {
  const issues = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      issues.push(...scanDirectory(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.markdown'))) {
      issues.push(...scanFileForProblematicDiagrams(fullPath));
    }
  }
  
  return issues;
}

// Function to generate a suggested fix for a class diagram
/**
 * Generate a flowchart representation from class definitions and relationships in a diagram content string.
 *
 * The function processes the input string to extract class names and their relationships, constructs a flowchart in a specific format, and applies styling to the nodes. It handles class definitions, relationships, and ignores stereotype lines. The final flowchart string is returned for further use.
 *
 * @param diagramContent - A string containing class definitions and relationships.
 * @returns A string representing the flowchart in a specific format.
 */
function generateFlowchartFix(diagramContent) {
  // Extract class definitions and relationships
  const lines = diagramContent.split('\n').map(line => line.trim()).filter(line => line);
  const classes = {};
  const relationships = [];
  
  for (const line of lines) {
    if (line.startsWith('class ') && line.includes('{')) {
      // Extract class name
      const className = line.match(/class\s+(\w+)/)?.[1];
      if (className) {
        classes[className] = {
          name: className,
          content: []
        };
      }
    } else if (line.includes('<|--') || line.includes('--|>')) {
      // Extract relationship
      const parts = line.split(/(<\|--|--\|>)/);
      if (parts.length >= 3) {
        const parent = parts[0].trim();
        const child = parts[2].trim();
        relationships.push({ parent, child });
      }
    } else if (line.includes('<<') && line.includes('>>')) {
      // Skip stereotype lines for now
      continue;
    }
  }
  
  // Generate flowchart
  let flowchart = 'flowchart TD\n';
  
  // Add nodes
  for (const className of Object.keys(classes)) {
    flowchart += `    ${className}["${className}<br/><i>Class</i>"]\n`;
  }
  
  flowchart += '\n';
  
  // Add relationships
  for (const rel of relationships) {
    flowchart += `    ${rel.parent} --> ${rel.child}\n`;
  }
  
  // Add styling
  flowchart += '\n    %% Styling\n';
  const colors = ['#e3f2fd', '#f3e5f5', '#fff3e0', '#e8f5e8'];
  let colorIndex = 0;
  
  for (const className of Object.keys(classes)) {
    const color = colors[colorIndex % colors.length];
    flowchart += `    style ${className} fill:${color},stroke:#333,stroke-width:2px,color:#000\n`;
    colorIndex++;
  }
  
  return flowchart;
}

// Function to format and display issues
/**
 * Display issues related to class diagrams, categorized by priority.
 *
 * The function first checks if there are any issues to display. If not, it logs a message indicating that no problematic class diagrams were found.
 * It then categorizes the issues into high, medium, and low priority based on the file names and logs each category along with a summary of the counts.
 * Additionally, it provides a suggested fix for the first issue if available, using the generateFlowchartFix function.
 *
 * @param issues - An array of issue objects, each containing file and diagramContent properties.
 */
function displayIssues(issues) {
  if (issues.length === 0) {
    console.log('✅ No problematic class diagrams found!');
    return;
  }
  
  console.log(`\n🔍 Found ${issues.length} class diagrams that need fixing:\n`);
  
  // Group by priority
  const highPriority = issues.filter(issue => 
    issue.file.includes('API Reference') || 
    issue.file.includes('Core System') || 
    issue.file.includes('Architecture')
  );
  
  const mediumPriority = issues.filter(issue => 
    issue.file.includes('Action System') || 
    issue.file.includes('Services') || 
    issue.file.includes('LLM Integration')
  );
  
  const lowPriority = issues.filter(issue => 
    !highPriority.includes(issue) && !mediumPriority.includes(issue)
  );
  
  console.log(`🔴 HIGH PRIORITY (${highPriority.length}):`);
  displayIssueGroup(highPriority);
  
  console.log(`\n🟡 MEDIUM PRIORITY (${mediumPriority.length}):`);
  displayIssueGroup(mediumPriority);
  
  console.log(`\n🟢 LOW PRIORITY (${lowPriority.length}):`);
  displayIssueGroup(lowPriority);
  
  console.log(`\n📊 Summary:`);
  console.log(`  - High Priority: ${highPriority.length}`);
  console.log(`  - Medium Priority: ${mediumPriority.length}`);
  console.log(`  - Low Priority: ${lowPriority.length}`);
  console.log(`  - Total: ${issues.length}`);
  
  // Show suggested fix for the first issue
  if (issues.length > 0 && issues[0].diagramContent) {
    console.log(`\n💡 Example fix for: ${path.basename(issues[0].file)}`);
    console.log('Replace class diagram with:');
    console.log('```mermaid');
    console.log(generateFlowchartFix(issues[0].diagramContent));
    console.log('```');
  }
}

/**
 * Displays the issue group by logging file paths and messages.
 */
function displayIssueGroup(issues) {
  for (const issue of issues) {
    console.log(`  📄 ${path.relative(process.cwd(), issue.file)}:${issue.line}`);
    console.log(`     Diagram ${issue.diagram}: ${issue.message}`);
  }
}

// Main execution
/**
 * Main function to scan for class diagrams and display issues.
 */
function main() {
  const docsPath = path.join(__dirname, '..', 'docs');
  
  if (!fs.existsSync(docsPath)) {
    console.error('❌ Documentation directory not found');
    process.exit(1);
  }
  
  console.log('🔍 Scanning for class diagrams with problematic inheritance syntax...\n');
  
  const issues = scanDirectory(docsPath);
  displayIssues(issues);
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  scanFileForProblematicDiagrams,
  scanDirectory,
  generateFlowchartFix
};