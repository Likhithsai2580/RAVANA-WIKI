import Link from 'next/link';

/**
 * Renders a breadcrumb navigation based on the document's slug.
 */
const Breadcrumb = ({ doc }) => {
  // Split the slug into parts for breadcrumb navigation
  const slugParts = doc.slug.split('/');
  
  return (
    <nav className="mb-4 text-sm">
      <ol className="list-none p-0 inline-flex flex-wrap">
        <li className="flex items-center">
          <Link href="/" className="text-wiki-blue hover:underline">Home</Link>
          <svg className="fill-current w-3 h-3 mx-3 text-wiki-text-muted" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
          </svg>
        </li>
        
        {/* Render each part of the path as a breadcrumb */}
        {slugParts.map((part, index) => {
          // Skip rendering the last part as a link
          const isLast = index === slugParts.length - 1;
          
          // Create the path up to this point
          const path = slugParts.slice(0, index + 1).join('/');
          
          return (
            <li key={path} className="flex items-center">
              {isLast ? (
                <span className="text-wiki-text-muted">{part.replace(/-/g, ' ')}</span>
              ) : (
                <>
                  <Link href={`/docs/${encodeURIComponent(path)}`} className="text-wiki-blue hover:underline">
                    {part.replace(/-/g, ' ')}
                  </Link>
                  <svg className="fill-current w-3 h-3 mx-3 text-wiki-text-muted" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                    <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
                  </svg>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;