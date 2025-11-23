import React from 'react';

interface QRButtonProps {
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export function QRButton({ onClick, className = '' }: QRButtonProps) {
  return (
    <div className={`flex justify-center ${className}`}>
      <button
        onClick={onClick}
        className="w-12 h-12 border-2 border-gray-300 rounded-xl flex items-center justify-center transition-all duration-200 hover:border-gray-900 hover:bg-gray-900 group focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        aria-label="View QR Code"
      >
        <svg
          width="24"
          height="24"
          fill="currentColor"
          className="text-gray-500 transition-colors duration-200 group-hover:text-white"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM19 13h2v2h-2zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM15 19h2v2h-2zM17 17h2v2h-2zM17 13h2v2h-2zM19 15h2v2h-2z"/>
        </svg>
      </button>
    </div>
  );
}
