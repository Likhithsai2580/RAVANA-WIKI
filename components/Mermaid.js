import { useEffect, useRef } from 'react';

const Mermaid = ({ chart }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || !containerRef.current) return;
    
    const renderChart = async () => {
      try {
        // Import mermaid dynamically
        const { default: mermaid } = await import('mermaid');
        
        // Initialize mermaid
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          flowchart: { useMaxWidth: true }
        });
        
        // Generate a unique ID for this chart
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        
        // Clear any previous content
        containerRef.current.innerHTML = '';
        
        // Render the chart
        const { svg } = await mermaid.render(id, chart);
        containerRef.current.innerHTML = svg;
      } catch (error) {
        console.error('Error rendering mermaid chart:', error);
        containerRef.current.innerHTML = `<pre class="text-red-500 p-2 bg-red-100 rounded">Error rendering chart: ${error.message}</pre>`;
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