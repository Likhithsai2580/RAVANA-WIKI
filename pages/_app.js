import '../styles/globals.css';
import Head from 'next/head';
import Script from 'next/script';

function MyApp({ Component, pageProps }) {
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