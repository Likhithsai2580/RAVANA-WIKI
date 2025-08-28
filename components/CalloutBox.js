import React from 'react';

/**
 * Renders a callout box with a specified type and content.
 */
const CalloutBox = ({ type = 'note', children }) => {
  const calloutConfig = {
    note: {
      title: 'Note',
      className: 'callout-note',
      icon: (
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    warning: {
      title: 'Warning',
      className: 'callout-warning',
      icon: (
        <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    tip: {
      title: 'Tip',
      className: 'callout-tip',
      icon: (
        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    }
  };

  const config = calloutConfig[type] || calloutConfig.note;

  return (
    <div className={`${config.className} rounded-lg p-4 mb-6 transition-all duration-300 hover:shadow-md`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          {config.icon}
        </div>
        <div className="ml-3 flex-1">
          <h4 className="font-bold text-base-content mb-1">{config.title}</h4>
          <div className="text-base-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalloutBox;