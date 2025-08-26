import { useEffect, useRef } from 'react';

/**
 * Renders a Mermaid chart based on the provided chart syntax.
 *
 * This function normalizes the chart syntax, handles potential errors during rendering, and attempts recovery of malformed charts. It dynamically imports the Mermaid library, initializes it with specific settings, and updates the DOM with the rendered SVG. If rendering fails, it attempts to recover the chart by fixing common syntax issues and re-renders it.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.chart - The Mermaid chart syntax to be rendered.
 * @returns {JSX.Element} The rendered Mermaid chart component.
 */
const Mermaid = ({ chart }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || !containerRef.current) return;
    
    /**
     * Renders a chart using the Mermaid library with enhanced syntax normalization and error recovery.
     *
     * The function first normalizes the chart syntax by removing unnecessary sections and handling style directives.
     * It then initializes the Mermaid library and attempts to render the chart. If rendering fails, it attempts to recover
     * the chart by fixing common syntax issues and re-renders it. If recovery also fails, it displays an error message.
     *
     * @param chart - The chart definition as a string that needs to be rendered.
     * @param containerRef - A reference to the DOM element where the chart will be rendered.
     * @returns A promise that resolves when the chart has been rendered or recovered.
     * @throws Error If there is an issue during the rendering or recovery process.
     */
    const renderChart = async () => {
      try {
        // Normalize chart syntax with improved handling
        /**
         * Normalize the syntax of a chart definition text.
         *
         * This function processes the input `chartText` by removing unnecessary sections, handling style directives,
         * standardizing node and edge syntax, and ensuring a diagram type is declared. It also cleans up excessive
         * whitespace and newlines to produce a well-formatted chart definition.
         *
         * @param chartText - The raw text of the chart definition to be normalized.
         * @returns The normalized chart definition text.
         */
        const normalizeChartSyntax = (chartText) => {
          // First, check if there's a "Diagram sources" section that needs to be removed
          if (chartText.includes('**Diagram sources**') || 
              chartText.includes('**Section sources**')) {
            // Split at first occurrence of these markers and only use the content before them
            const sourcesIndex = Math.min(
              chartText.includes('**Diagram sources**') ? chartText.indexOf('**Diagram sources**') : Number.MAX_SAFE_INTEGER,
              chartText.includes('**Section sources**') ? chartText.indexOf('**Section sources**') : Number.MAX_SAFE_INTEGER
            );
            
            if (sourcesIndex !== Number.MAX_SAFE_INTEGER) {
              chartText = chartText.substring(0, sourcesIndex).trim();
            }
          }
          
          // Handle style directives - remove them properly
          if (chartText.includes('style ')) {
            // Extract just the flowchart definition without style sections
            const styleMatch = chartText.match(/([\s\S]*?)\bstyle\s+[A-Za-z0-9_-]+/);
            if (styleMatch && styleMatch[1]) {
              chartText = styleMatch[1].trim();
            } else {
              // If we can't cleanly extract, just remove all style directives
              chartText = chartText.replace(/\bstyle\s+[A-Za-z0-9_-]+\s+[^\n]+/g, '');
            }
          }
          
          // Handle round bracket nodes - ([text]) -> ("text")
          chartText = chartText.replace(/([A-Za-z0-9_-]+)\(\[([^\]]+)\]\)/g, '$1(["$2"])');
          
          // Handle alphanumeric node identifiers with underscores/hyphens
          chartText = chartText.replace(/([A-Za-z0-9_-]+)\[([^\]]+)\]\s*(-->|->)\s*([A-Za-z0-9_-]+)/g, '$1[$2]\n$1 $3 $4');
          
          // Standardize arrow syntax
          chartText = chartText.replace(/->/g, '-->');
          
          // Add line breaks between nodes
          chartText = chartText.replace(/([A-Za-z0-9_-]+)\[([^\]]+)\]\s+([A-Za-z0-9_-]+)\[/g, '$1[$2]\n$3[');
          
          // Handle edge labels
          chartText = chartText.replace(/([A-Za-z0-9_-]+)\s+-->\s+\|([^|]+)\|\s+([A-Za-z0-9_-]+)/g, '$1 -->|$2| $3');
          
          // Ensure diagram type is declared
          if (!chartText.match(/^\s*(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|pie|gantt|journey|requirementDiagram|gitGraph|erDiagram|quadrantChart)/)) {
            // Try to detect diagram type from content or default to flowchart
            if (chartText.includes('-->') || chartText.includes('-->|')) {
              chartText = 'flowchart TD\n' + chartText;
            } else {
              chartText = 'graph TD\n' + chartText;
            }
          }
          
          // Clean up multiple consecutive spaces and newlines
          chartText = chartText.replace(/\s{2,}/g, ' ');
          chartText = chartText.replace(/\n{3,}/g, '\n\n');
          
          return chartText.trim();
        };
        
        // Function to attempt recovery of malformed charts
        /**
         * Attempt to recover and clean up chart text for diagram representation.
         *
         * The function processes the input `chartText` by removing specific sections, handling style directives,
         * and cleaning invalid characters. It also ensures proper formatting for various diagram types and fixes
         * common syntax issues, ultimately returning a cleaned version of the chart text.
         *
         * @param chartText - The raw text of the chart to be processed and cleaned.
         * @returns The cleaned and formatted chart text.
         */
        const attemptChartRecovery = (chartText) => {
          // Remove any "Diagram sources" or "Section sources" sections
          if (chartText.includes('**Diagram sources**') || 
              chartText.includes('**Section sources**')) {
            const sourcesIndex = Math.min(
              chartText.includes('**Diagram sources**') ? chartText.indexOf('**Diagram sources**') : Number.MAX_SAFE_INTEGER,
              chartText.includes('**Section sources**') ? chartText.indexOf('**Section sources**') : Number.MAX_SAFE_INTEGER
            );
            
            if (sourcesIndex !== Number.MAX_SAFE_INTEGER) {
              chartText = chartText.substring(0, sourcesIndex).trim();
            }
          }
          
          // Handle style directives
          if (chartText.includes('style ')) {
            const styleMatch = chartText.match(/([\s\S]*?)\bstyle\s+[A-Za-z0-9_-]+/);
            if (styleMatch && styleMatch[1]) {
              chartText = styleMatch[1].trim();
            } else {
              chartText = chartText.replace(/\bstyle\s+[A-Za-z0-9_-]+\s+[^\n]+/g, '');
            }
          }
          
          // Remove invalid characters
          let cleaned = chartText.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, '');
          
          // Handle the specific case with 'graph TD A[Application Start] --> B' format
          if (cleaned.match(/(?:graph|flowchart)\s+TD\s+[A-Za-z0-9_-]+\[[^\]]+\]\s*(-->|->)\s*[A-Za-z0-9_-]+/)) {
            cleaned = cleaned.replace(/^((?:graph|flowchart)\s+TD)\s+/, '$1\n');
            cleaned = cleaned.replace(/([A-Za-z0-9_-]+)\[([^\]]+)\]\s*(-->|->)\s*([A-Za-z0-9_-]+)/g, '$1[$2]\n$1 --> $4');
            cleaned = cleaned.replace(/->/g, '-->');
            cleaned = cleaned.replace(/\s{2,}/g, ' ');
            cleaned = cleaned.replace(/([A-Za-z0-9_-]+)\s+-->\s+([A-Za-z0-9_-]+)\{/g, '$1 --> $2\n$2{');
          }
          
          // Handle round bracket nodes
          cleaned = cleaned.replace(/([A-Za-z0-9_-]+)\(\[([^\]]+)\]\)/g, '$1(["$2"])');
          
          // Fix edge labels
          cleaned = cleaned.replace(/([A-Za-z0-9_-]+)\s+-->\s+\|([^|]+)\|\s+([A-Za-z0-9_-]+)/g, '$1 -->|$2| $3');
          
          // Ensure diagram type is declared
          if (!cleaned.match(/^\s*(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|pie|gantt|journey|requirementDiagram|gitGraph|erDiagram|quadrantChart)/)) {
            if (cleaned.includes('-->') || cleaned.includes('-->|')) {
              cleaned = 'flowchart TD\n' + cleaned;
            } else {
              cleaned = 'graph TD\n' + cleaned;
            }
          }
          
          // Fix common arrow syntax issues
          cleaned = cleaned.replace(/([A-Za-z0-9_-]+)\s*->/g, '$1 -->');
          
          // Add missing line breaks between nodes
          cleaned = cleaned.replace(/([A-Za-z0-9_-]+)\[([^\]]+)\]\s+([A-Za-z0-9_-]+)\[/g, '$1[$2]\n$3[');
          
          // Handle alphanumeric node identifiers
          cleaned = cleaned.replace(/([A-Za-z0-9_-]+)\s+-->\s+([A-Za-z0-9_-]+)/g, '$1 --> $2');
          
          // Clean up whitespace
          cleaned = cleaned.replace(/\s{2,}/g, ' ').trim();
          
          return cleaned;
        };

        const normalizedChart = normalizeChartSyntax(chart);
        
        // Import mermaid dynamically
        const { default: mermaid } = await import('mermaid');
        
        // Initialize mermaid with dark theme
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'loose',
          flowchart: { useMaxWidth: true },
          logLevel: 'error',
          parseError: (err, hash) => {
            console.error('Mermaid parse error:', err);
          }
        });
        
        // Generate a unique ID for this chart
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        
        // Clear any previous content
        containerRef.current.innerHTML = '';
        
        // Render the chart
        const { svg, bindFunctions } = await mermaid.render(id, normalizedChart);
        containerRef.current.innerHTML = svg;
        
        // Bind functions if they exist (for interactivity)
        if (bindFunctions) {
          bindFunctions(containerRef.current);
        }
      } catch (error) {
        console.error('Error rendering mermaid chart:', error);
        // Try to recover by attempting to fix common syntax issues
        try {
          const { default: mermaid } = await import('mermaid');
          const recoveredChart = attemptChartRecovery(chart);
          const id = `mermaid-recovery-${Math.random().toString(36).substring(2, 9)}`;
          const { svg, bindFunctions } = await mermaid.render(id, recoveredChart);
          containerRef.current.innerHTML = svg;
          if (bindFunctions) {
            bindFunctions(containerRef.current);
          }
        } catch (recoveryError) {
          // Recovery failed, show the error
          containerRef.current.innerHTML = `
            <pre class="text-red-500 p-4 bg-red-100 dark:bg-red-900/20 rounded my-4 overflow-auto">
              Error rendering chart: ${error.message}
              
              Chart content:
              ${chart.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
            </pre>
          `;
        }
      }
    };
    
    renderChart();
  }, [chart]);
  
  return (
    <div className="mermaid-container my-6">
      <div ref={containerRef} className="flex justify-center"></div>
    </div>
  );
};

export default Mermaid;