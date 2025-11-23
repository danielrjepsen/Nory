'use client';

import React from 'react';
import { Checkbox } from '../form/Checkbox';
import { Chip } from '../ui/Chip';

interface ComponentPreviewProps {
  componentType: string;
  config: any;
}

const ComponentPreview: React.FC<ComponentPreviewProps> = ({ componentType, config }) => {
  const title = config.properties?.title || config.meta?.name || 'Component';

  switch (componentType) {
    case 'remote':
      const mode = config.properties?.mode || 'slideshow';
      return (
        <div>
          <div className="grid grid-cols-3 gap-2">
            {['⏮️', '⏯️', '⏭️', '🔇', '🔊', '🔳'].map((icon, idx) => (
              <div
                key={idx}
                className="aspect-square bg-black rounded-xl flex items-center justify-center text-white text-2xl cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-[#2D2D2D]"
              >
                {icon}
              </div>
            ))}
          </div>
          <p className="text-center mt-2 text-xs text-gray-600">Mode: {mode}</p>
        </div>
      );

    case 'guestbook':
      const gbStyle = config.properties?.style || 'cards';
      const allowPhotos = config.properties?.photos !== false;

      if (gbStyle === 'cards') {
        return (
          <div>
            {[
              { name: 'John Doe', time: '2 hours ago', message: 'Congratulations! Wishing you all the best!', hasPhoto: allowPhotos },
              { name: 'Jane Smith', time: '5 hours ago', message: 'So happy for you both! 💕', hasPhoto: false },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 mb-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full" />
                  <div>
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-[0.7rem] text-gray-600">{item.time}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-900 my-1">{item.message}</p>
                {item.hasPhoto && <div className="w-full h-20 bg-gray-100 rounded-lg mt-2" />}
              </div>
            ))}
          </div>
        );
      } else if (gbStyle === 'timeline') {
        return (
          <div className="border-l-2 border-gray-200 pl-4 ml-4">
            {[
              { name: 'John Doe', time: '2 hours ago', message: 'Best wishes!' },
              { name: 'Jane Smith', time: '5 hours ago', message: 'Congratulations!' },
            ].map((item, idx) => (
              <div key={idx} className="relative mb-6">
                <div className="absolute -left-[21px] w-3 h-3 bg-black rounded-full border-2 border-white" />
                <p className="text-[0.7rem] text-gray-600 mb-0.5">{item.time}</p>
                <p className="font-semibold text-sm">{item.name}</p>
                <p className="text-sm mt-1">{item.message}</p>
              </div>
            ))}
          </div>
        );
      } else {
        return (
          <div className="grid grid-cols-2 gap-1">
            {[
              { name: 'John', message: 'Congrats! 🎉', gradient: 'linear-gradient(135deg, #667EEA, #764BA2)' },
              { name: 'Sarah', message: 'Love you both!', gradient: 'linear-gradient(135deg, #F093FB, #F5576C)' },
              { name: 'Mike', message: 'Amazing! ❤️', gradient: 'linear-gradient(135deg, #4FACFE, #00F2FE)' },
              { name: 'Emma', message: 'Best wishes!', gradient: 'linear-gradient(135deg, #43E97B, #38F9D7)' },
            ].map((item, idx) => (
              <div key={idx} className="text-white p-2 rounded-lg text-xs" style={{ background: item.gradient }}>
                <div className="font-semibold">{item.name}</div>
                <div className="mt-1">{item.message}</div>
              </div>
            ))}
          </div>
        );
      }

    case 'lists':
      const items = config.properties?.items || ['Wedding Cake', 'Champagne Glasses', 'Photo Album'];
      const listType = config.properties?.type || 'wishlist';
      const claiming = config.properties?.claiming !== false;

      return (
        <div>
          {items.slice(0, 3).map((item: string, idx: number) => (
            <div
              key={idx}
              className="bg-white rounded-lg p-2 mb-1 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center gap-2">
                {listType === 'checklist' ? (
                  <Checkbox size="small" checked={idx === 0} />
                ) : (
                  <div className={`w-[18px] h-[18px] rounded ${idx === 0 ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
                <p
                  className={`text-sm ${
                    idx === 0 && listType === 'checklist' ? 'line-through opacity-60' : ''
                  }`}
                >
                  {item}
                </p>
              </div>
              {claiming && listType === 'wishlist' && (
                <Chip
                  label={idx === 0 ? 'Claimed by JD' : 'Available'}
                  className={idx === 0 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}
                  style={{ fontSize: '0.7rem', height: '20px' }}
                />
              )}
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-center text-gray-600 py-4">Add items to see preview</p>
          )}
        </div>
      );

    case 'gallery':
      const layout = config.properties?.layout || 'masonry';

      if (layout === 'carousel') {
        return (
          <div className="relative bg-white rounded-lg overflow-hidden h-40">
            <div className="w-full h-full bg-gradient-to-br from-[#667EEA] to-[#764BA2]" />
            <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1 p-2">
              {[true, false, false].map((active, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full ${
                    active ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        );
      } else {
        const cols = layout === 'grid' ? 3 : 2;
        const heights = layout === 'masonry' ? [80, 120, 100, 90, 110, 70] : Array(6).fill(80);

        return (
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
          >
            {heights.slice(0, 6).map((height, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-gray-200 to-gray-100 rounded-lg"
                style={{ height: `${height}px` }}
              />
            ))}
          </div>
        );
      }

    case 'schedule':
      const events = config.properties?.events || [
        { time: '2:00 PM', title: 'Ceremony Begins' },
        { time: '3:00 PM', title: 'Cocktail Hour' },
        { time: '4:00 PM', title: 'Reception' },
      ];
      const countdown = config.properties?.countdown !== false;

      return (
        <div>
          {countdown && (
            <div className="bg-gradient-to-br from-[#667EEA] to-[#764BA2] text-white rounded-lg p-4 mb-4 text-center">
              <p className="text-xs opacity-90">Next Event In</p>
              <p className="text-xl font-semibold mt-1">2h 15m</p>
            </div>
          )}
          {events.map((event: any, idx: number) => (
            <div
              key={idx}
              className={`flex gap-4 mb-4 ${idx === 0 ? 'opacity-100' : 'opacity-60'}`}
            >
              <div className="flex-shrink-0">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-sm ${
                    idx === 0 ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {event.time.split(':')[0]}
                </div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{event.title}</p>
                <p className="text-xs text-gray-600 mt-0.5">{event.time}</p>
              </div>
            </div>
          ))}
        </div>
      );

    case 'polls':
      const question = config.properties?.question || "What's your favorite moment?";
      const options = config.properties?.options || ['First Dance', 'Ceremony', 'Speeches'];
      const realtime = config.properties?.realtime !== false;
      const percentages = [45, 30, 25];

      return (
        <div>
          <p className="text-sm mb-2">{question}</p>
          {options.map((opt: string, idx: number) => (
            <div key={idx} className="mb-2">
              <div className="flex justify-between mb-1">
                <p className="text-sm">{opt}</p>
                {realtime && (
                  <p className="text-xs text-gray-600">{percentages[idx] || 0}%</p>
                )}
              </div>
              <div className="h-6 bg-gray-200 rounded-xl overflow-hidden">
                {realtime && (
                  <div
                    className="h-full bg-gradient-to-r from-[#667EEA] to-[#764BA2] transition-all duration-300"
                    style={{ width: `${percentages[idx] || 0}%` }}
                  />
                )}
              </div>
            </div>
          ))}
          {realtime && (
            <p className="text-center text-xs text-gray-600 mt-4">
              23 votes • Live updating
            </p>
          )}
        </div>
      );

    case 'custom':
      const endpoint = config.properties?.endpoint || '';
      const method = config.properties?.method || 'GET';
      const refresh = config.properties?.refresh || 60;

      return (
        <div>
          <div className="bg-[#1A1A1A] text-green-400 p-4 rounded-lg font-mono text-xs">
            <div className="text-gray-500 mb-1">// API Configuration</div>
            <div>{'{'}</div>
            <div className="pl-4">
              <div>"endpoint": "{endpoint || 'not configured'}",</div>
              <div>"method": "{method}",</div>
              <div>"refresh": {refresh},</div>
              <div>"status": "ready"</div>
            </div>
            <div>{'}'}</div>
          </div>
          <div
            className={`mt-4 p-2 rounded-lg text-white text-center text-xs ${
              endpoint ? 'bg-green-500' : 'bg-amber-500'
            }`}
          >
            {endpoint ? '✓ Connected to API' : '⚠️ Configure API endpoint'}
          </div>
        </div>
      );

    default:
      return (
        <div className="text-center py-8">
          <div className="text-5xl mb-4">{config.meta?.icon || '📦'}</div>
          <p className="text-base font-semibold mb-2">{title}</p>
          <p className="text-sm text-gray-600">{config.meta?.description || 'Component preview'}</p>
        </div>
      );
  }
};

export default ComponentPreview;
