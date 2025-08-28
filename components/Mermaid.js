import { useEffect, useRef } from 'react';

const Mermaid = ({ chart }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || !containerRef.current) return;
    
    const renderChart = async () => {
      try {
        // Simple preprocessing to clean up common issues
        const preprocessChart = (chartText) => {
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
          
          // Ensure diagram type is declared
          if (!chartText.match(/^\s*(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|pie|gantt|journey|requirementDiagram|gitGraph|erDiagram|quadrantChart)/)) {
            // Try to detect diagram type from content or default to flowchart
            if (chartText.includes('-->') || chartText.includes('-->|')) {
              chartText = 'flowchart TD\n' + chartText;
            } else {
              chartText = 'graph TD\n' + chartText;
            }
          }
          
          // Clean up multiple consecutive newlines
          chartText = chartText.replace(/\n{3,}/g, '\n\n');
          
          return chartText.trim();
        };

        const processedChart = preprocessChart(chart);
        
        // Import mermaid dynamically
        const { default: mermaid } = await import('mermaid');
        
        // Initialize mermaid with dark theme
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'loose',
          flowchart: { useMaxWidth: true },
          logLevel: 'error'
        });
        
        // Generate a unique ID for this chart
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        
        // Clear any previous content
        containerRef.current.innerHTML = '';
        
        // Render the chart
        const { svg, bindFunctions } = await mermaid.render(id, processedChart);
        containerRef.current.innerHTML = svg;
        
        // Bind functions if they exist (for interactivity)
        if (bindFunctions) {
          bindFunctions(containerRef.current);
        }
      } catch (error) {
        console.error('Error rendering mermaid chart:', error);
        // Show the error
        containerRef.current.innerHTML = `
          <pre class="text-red-500 p-4 bg-red-100 dark:bg-red-900/20 rounded my-4 overflow-auto">
            Error rendering chart: ${error.message}
            
            Chart content:
            ${chart.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
          </pre>
        `;
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