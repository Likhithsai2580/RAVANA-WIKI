import Link from 'next/link';

const DocCard = ({ doc }) => {
  return (
    <article className="bg-wiki-content-bg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-wiki-border transform hover:-translate-y-1">
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2 text-wiki-text-light">
          <Link href={`/docs/${doc.slug}`} className="text-wiki-blue hover:underline transition-colors duration-200">
            {doc.title}
          </Link>
        </h3>
        <p className="text-wiki-text-muted mb-4">{doc.excerpt}</p>
        <div className="mt-4">
          <Link 
            href={`/docs/${doc.slug}`} 
            className="text-wiki-blue hover:underline font-medium transition-colors duration-200 inline-flex items-center"
          >
            Read more 
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default DocCard;