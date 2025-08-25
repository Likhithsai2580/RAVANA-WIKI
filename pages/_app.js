import '../styles/globals.css';
import Head from 'next/head';
import Script from 'next/script';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  // Initialize mermaid on client-side
  useEffect(() => {
    const initMermaid = async () => {
      if (typeof window !== 'undefined') {
        try {
          // Dynamic import of mermaid
          const { default: mermaid } = await import('mermaid');
          
          // Initialize with configuration
          mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose', 
            flowchart: { useMaxWidth: true }
          });
          
          // Process any mermaid diagrams on the page
          mermaid.run();
        } catch (error) {
          console.error('Error initializing mermaid:', error);
        }
      }
    };
    
    initMermaid();
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="utf-8" />
        <title>RAVANA AGI Documentation</title>
        <meta name="description" content="Documentation for the RAVANA AGI system" />
      </Head>
      
      {/* Syntax highlighting scripts */}
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js" 
        strategy="beforeInteractive" 
      />
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js" 
        strategy="beforeInteractive" 
      />
      
      <div className="min-h-screen flex flex-col">
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;