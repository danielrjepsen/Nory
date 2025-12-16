import React from 'react';

interface DebugToolsProps {
  eventId: string;
  onClearSession: () => void;
}

export function DebugTools({ eventId, onClearSession }: DebugToolsProps) {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 space-y-2">
      <button
        onClick={onClearSession}
        className="block bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
      >
        Clear Session
      </button>
      <button
        onClick={() => window.location.search = '?welcome=true'}
        className="block bg-yellow-600 hover:bg-yellow-700 text-white text-xs px-3 py-1 rounded"
      >
        Force Welcome
      </button>
    </div>
  );
}