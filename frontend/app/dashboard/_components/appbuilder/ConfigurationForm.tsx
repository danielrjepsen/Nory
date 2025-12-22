import React, { useState } from 'react';
import type { ComponentProperty } from './componentRegistry';

interface ConfigurationFormProps {
  properties: ComponentProperty[];
  config: any;
  onConfigChange: (key: string, value: any) => void;
}

const inputClasses = "w-full px-4 py-3 bg-nory-card border-2 border-nory-border rounded-btn font-grotesk text-nory-text transition-all duration-150 focus:outline-none focus:shadow-brutal-sm placeholder:text-nory-muted";

export function ConfigurationForm({ properties, config, onConfigChange }: ConfigurationFormProps) {
  const [arrayInputs, setArrayInputs] = useState<{ [key: string]: string }>({});

  const addArrayItem = (key: string, value: string) => {
    if (!value.trim()) return;

    const currentItems = config.properties?.[key] || [];
    const newItems = [...currentItems, value.trim()];
    onConfigChange(key, newItems);
    setArrayInputs({ ...arrayInputs, [key]: '' });
  };

  const removeArrayItem = (key: string, index: number) => {
    const currentItems = config.properties?.[key] || [];
    const newItems = currentItems.filter((_: any, i: number) => i !== index);
    onConfigChange(key, newItems);
  };

  return (
    <div>
      {properties.map((prop) => {
        if (prop.conditional) {
          const shouldShow = Object.entries(prop.conditional).every(
            ([key, value]) => config.properties?.[key] === value
          );
          if (!shouldShow) return null;
        }

        return (
          <div key={prop.key} className="mb-4">
            <label className="block text-sm font-semibold text-nory-text mb-1.5 font-grotesk">
              {prop.label}
            </label>

            {prop.type === 'text' && (
              <input
                type="text"
                className={inputClasses}
                placeholder={prop.placeholder || prop.default || ''}
                value={config.properties?.[prop.key] || ''}
                onChange={(e) => onConfigChange(prop.key, e.target.value)}
              />
            )}

            {prop.type === 'select' && (
              <select
                className={inputClasses}
                value={config.properties?.[prop.key] || prop.default || ''}
                onChange={(e) => onConfigChange(prop.key, e.target.value)}
              >
                {prop.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}

            {prop.type === 'boolean' && (
              <select
                className={inputClasses}
                value={config.properties?.[prop.key] !== undefined ? String(config.properties[prop.key]) : String(prop.default || false)}
                onChange={(e) => onConfigChange(prop.key, e.target.value === 'true')}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            )}

            {prop.type === 'number' && (
              <input
                type="number"
                className={inputClasses}
                value={config.properties?.[prop.key] || prop.default || ''}
                onChange={(e) => onConfigChange(prop.key, parseInt(e.target.value))}
              />
            )}

            {prop.type === 'array' && (
              <div>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className={`flex-1 ${inputClasses}`}
                    placeholder="Add item"
                    value={arrayInputs[prop.key] || ''}
                    onChange={(e) => setArrayInputs({ ...arrayInputs, [prop.key]: e.target.value })}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addArrayItem(prop.key, arrayInputs[prop.key] || '');
                      }
                    }}
                  />
                  <button
                    className="px-4 py-2.5 text-sm border-2 border-nory-border rounded-btn bg-nory-card hover:bg-nory-bg transition-colors font-grotesk font-medium text-nory-text"
                    onClick={() => addArrayItem(prop.key, arrayInputs[prop.key] || '')}
                  >
                    Add
                  </button>
                </div>
                {(config.properties?.[prop.key] || []).map((item: string, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-nory-bg rounded-btn border-2 border-transparent mb-2"
                  >
                    <span className="text-sm font-grotesk text-nory-text">{item}</span>
                    <button
                      className="w-6 h-6 flex items-center justify-center text-nory-muted hover:text-red-600 transition-colors"
                      onClick={() => removeArrayItem(prop.key, index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {prop.type === 'code' && (
              <textarea
                className="w-full px-4 py-3 border-2 border-nory-border rounded-btn font-mono bg-gray-900 text-green-400 focus:outline-none focus:shadow-brutal-sm"
                rows={4}
                placeholder={prop.placeholder || ''}
                value={config.properties?.[prop.key] || ''}
                onChange={(e) => onConfigChange(prop.key, e.target.value)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
