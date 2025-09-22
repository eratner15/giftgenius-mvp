import React from 'react';

const ErrorMessage = ({ title = 'Something went wrong', message, onRetry, actionLabel = 'Try Again' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200">
      <div className="text-red-500 mb-4">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.924-.833-2.598 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-red-800 mb-2">{title}</h3>
      {message && (
        <p className="text-red-600 text-center mb-4 max-w-md">{message}</p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;