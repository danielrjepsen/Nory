'use client';

import React from 'react';

interface FeatureItem {
  icon?: React.ReactNode;
  text: string;
}

interface PreviewStat {
  value: string | number;
  label: string;
}

interface ExplanationCardProps {
  tag?: string;
  title: string;
  description?: string;
  features?: FeatureItem[];
  previewTitle?: string;
  previewSubtitle?: string;
  previewStats?: PreviewStat[];
  children?: React.ReactNode;
}

export function ExplanationCard({
  tag,
  title,
  description,
  features,
  previewTitle,
  previewSubtitle,
  previewStats,
  children,
}: ExplanationCardProps) {
  return (
    <div className="bg-nory-text rounded-card p-8 text-nory-card sticky top-8">
      <div className="mb-6">
        {tag && (
          <span className="inline-block bg-nory-yellow text-black font-mono text-[0.7rem] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md mb-4">
            {tag}
          </span>
        )}
        <h3 className="text-[1.5rem] font-bold leading-tight mb-2 font-grotesk">
          {title}
        </h3>
        {description && (
          <p className="text-[0.85rem] text-white/60 dark:text-nory-muted leading-relaxed font-grotesk">
            {description}
          </p>
        )}
      </div>

      {(previewTitle || previewStats) && (
        <div className="bg-white rounded-card p-5 mb-6">
          {previewTitle && (
            <div className="bg-nory-yellow rounded-btn p-4 mb-4">
              <div className="text-[1rem] font-bold text-black font-grotesk">
                {previewTitle}
              </div>
              {previewSubtitle && (
                <div className="text-[0.75rem] text-black/50 mt-0.5 font-grotesk">
                  {previewSubtitle}
                </div>
              )}
            </div>
          )}
          {previewStats && previewStats.length > 0 && (
            <div className="flex gap-4">
              {previewStats.map((stat, index) => (
                <div
                  key={index}
                  className="flex-1 bg-gray-100 rounded-btn p-3 text-center"
                >
                  <div className="font-mono text-[1.25rem] font-bold text-black">
                    {stat.value}
                  </div>
                  <div className="text-[0.65rem] text-gray-500 mt-0.5 font-grotesk">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {children}

      {features && features.length > 0 && (
        <div className="flex flex-col gap-3 mt-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-3 text-[0.85rem] text-white/80 font-grotesk"
            >
              <div className="w-7 h-7 bg-white/10 rounded-btn flex items-center justify-center flex-shrink-0">
                {feature.icon || (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-3.5 h-3.5 text-nory-yellow"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              {feature.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
