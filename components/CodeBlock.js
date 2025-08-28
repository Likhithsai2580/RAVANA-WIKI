import { useState, useRef, useEffect } from 'react';

const CodeBlock = ({ htmlString }) => {
  const [isCopied, setIsCopied] = useState(false);
  const preRef = useRef(null);

  const handleCopy = () => {
    if (preRef.current) {
      const codeElement = preRef.current.querySelector('code');
      const code = codeElement ? codeElement.innerText : '';
      navigator.clipboard.writeText(code).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  // Use an effect to highlight the code block after it's rendered
  useEffect(() => {
    if (preRef.current && typeof window !== 'undefined' && window.Prism) {
      window.Prism.highlightAllUnder(preRef.current);
    }
  }, [htmlString]);


  return (
    <div className="relative group">
      <div ref={preRef} dangerouslySetInnerHTML={{ __html: htmlString }} />
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-lg bg-base-200 text-base-content text-xs opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {isCopied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

export default CodeBlock;
