import Link from 'next/link';

/**
 * Renders a document card component displaying the document title and excerpt.
 */
const DocCard = ({ doc }) => {
  return (
    <article className="bg-base-200 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 border border-base-300 transform hover:-translate-y-1 animate-fade-in">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-base-content">
          <Link href={`/docs/${doc.slug}`} className="text-primary hover:underline transition-colors duration-200">
            {doc.title}
          </Link>
        </h3>
        <p className="text-neutral-content mb-4">{doc.excerpt}</p>
        <div className="mt-4">
          <Link 
            href={`/docs/${doc.slug}`} 
            className="text-primary hover:underline font-medium transition-colors duration-200 inline-flex items-center group"
          >
            Read more 
            <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default DocCard;