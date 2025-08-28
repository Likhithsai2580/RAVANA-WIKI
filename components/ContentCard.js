import React from 'react';

const ContentCard = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-wiki-content-bg rounded-lg shadow-lg border border-wiki-border p-6 mb-6 transition-all duration-300 hover:shadow-xl ${className}`}>
      {title && (
        <h2 className="text-2xl font-bold text-wiki-text-light mb-4 pb-2 border-b border-wiki-border">
          {title}
        </h2>
      )}
      <div className="text-wiki-text-light">
        {children}
      </div>
    </div>
  );
};

export default ContentCard;