import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Add stylesheet for Prism.js */}
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
          
          {/* Basic mermaid initialization */}
          <script dangerouslySetInnerHTML={{
            __html: `
              // Initialize mermaid diagrams when available
              if (typeof window !== 'undefined') {
                document.addEventListener('DOMContentLoaded', function() {
                  if (typeof mermaid !== 'undefined') {
                    try {
                      mermaid.initialize({ startOnLoad: true });
                    } catch (e) {
                      console.error('Mermaid initialization error:', e);
                    }
                  }
                });
              }
            `
          }} />
        </body>
      </Html>
    );
  }
}

export default MyDocument;