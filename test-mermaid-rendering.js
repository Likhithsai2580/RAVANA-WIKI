const fs = require('fs').promises;
const path = require('path');
const { processMarkdown } = require('./lib/markdown');

async function testMermaidRendering() {
  // Read our test file
  const testFilePath = path.join(process.cwd(), 'docs', 'test-mermaid.md');
  const content = await fs.readFile(testFilePath, 'utf8');
  
  // Process the markdown
  const { html } = await processMarkdown(content);
  
  console.log('Processed HTML:');
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

testMermaidRendering().catch(console.error);