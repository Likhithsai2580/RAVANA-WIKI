import Link from 'next/link';

const DocCard = ({ doc }) => {
  return (
    <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      <h3 className="text-xl font-semibold mb-2">
        <Link href={`/docs/${doc.slug}`} className="text-wiki-blue hover:underline">
          {doc.title}
        </Link>
      </h3>
      <p className="text-gray-600 flex-grow">{doc.excerpt}</p>
      <div className="mt-4">
        <Link 
          href={`/docs/${doc.slug}`} 
          className="text-wiki-blue hover:underline font-medium"
        >
          Read more →
        </Link>
      </div>
    </div>
  );
};

export default DocCard;