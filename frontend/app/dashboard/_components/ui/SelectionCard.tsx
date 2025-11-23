'use client';

import React, { CSSProperties } from 'react';
import { SIZE_CONFIG, DEFAULT_GRADIENT, type SizeKey } from './selectionCardConfig';

export interface SelectionCardOption {
  id: string;
  icon: string | React.ReactNode;
  title: string;
  description: string;
  gradient?: {
    from: string;
    to: string;
  };
}

export interface SelectionCardProps {
  options: SelectionCardOption[];
  value: string;
  onChange: (value: string) => void;
  columns?: 1 | 2;
  gap?: number;
  cardStyle?: 'elevated' | 'flat';
  size?: SizeKey;
}

const SelectionCard: React.FC<SelectionCardProps> = ({
  options,
  value,
  onChange,
  columns = 1,
  gap = 20,
  cardStyle = 'elevated',
  size = 'medium',
}) => {
  const currentSize = SIZE_CONFIG[size];

  const getCardStyle = (option: SelectionCardOption, isSelected: boolean): CSSProperties => {
    const gradient = option.gradient || DEFAULT_GRADIENT;

    const baseStyle: CSSProperties = {
      padding: `${currentSize.padding}px`,
      borderRadius: `${currentSize.borderRadius}px`,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      border: '2px solid transparent',
      transformOrigin: 'center center',
    };

    if (cardStyle === 'elevated') {
      return {
        ...baseStyle,
        border: `2px solid ${isSelected ? gradient.from : 'transparent'}`,
        background: isSelected
          ? `linear-gradient(white, white) padding-box, linear-gradient(135deg, ${gradient.from}, ${gradient.to}) border-box`
          : 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #E2E8F0, #F1F5F9) border-box',
        transform: isSelected ? 'translateY(-2px) scale(1.01)' : 'translateY(0) scale(1)',
        boxShadow: isSelected ? '0 20px 40px rgba(0,0,0,0.1)' : '0 4px 6px rgba(0, 0, 0, 0.07)',
      };
    } else {
      return {
        ...baseStyle,
        background: isSelected
          ? `linear-gradient(135deg, ${gradient.from}15, ${gradient.to}15)`
          : '#F8FAFC',
        border: `2px solid ${isSelected ? gradient.from : '#E2E8F0'}`,
      };
    }
  };

  const getIconStyle = (option: SelectionCardOption, isSelected: boolean): CSSProperties => {
    const gradient = option.gradient || DEFAULT_GRADIENT;

    return {
      width: `${currentSize.iconSize}px`,
      height: `${currentSize.iconSize}px`,
      background: isSelected
        ? `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`
        : 'linear-gradient(135deg, #F8FAFC, #E2E8F0)',
      borderRadius: `${currentSize.iconPadding}px`,
      fontSize: `${currentSize.iconSize * 0.43}px`,
      transition: 'all 0.4s ease',
      transform: isSelected ? 'rotate(5deg)' : 'rotate(0deg)',
      boxShadow: isSelected ? `0 10px 20px ${gradient.from}30` : 'none',
    };
  };

  const getTitleStyle = (option: SelectionCardOption, isSelected: boolean): CSSProperties => {
    const gradient = option.gradient || DEFAULT_GRADIENT;

    if (isSelected) {
      return {
        fontSize: `${currentSize.titleSize}px`,
        fontWeight: 700,
        background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '4px',
        transition: 'all 0.3s ease',
      };
    }

    return {
      fontSize: `${currentSize.titleSize}px`,
      fontWeight: 700,
      color: '#1e293b',
      marginBottom: '4px',
      transition: 'all 0.3s ease',
    };
  };

  const getCheckStyle = (option: SelectionCardOption, isSelected: boolean): CSSProperties => {
    const gradient = option.gradient || DEFAULT_GRADIENT;

    return {
      width: `${currentSize.checkSize}px`,
      height: `${currentSize.checkSize}px`,
      border: `2px solid ${isSelected ? 'transparent' : '#E2E8F0'}`,
      borderRadius: '50%',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      background: isSelected ? `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` : 'rgba(255, 255, 255, 0.7)',
      transform: isSelected ? 'scale(1.1)' : 'scale(1)',
    };
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>, isSelected: boolean) => {
    if (cardStyle === 'elevated' && !isSelected) {
      e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>, isSelected: boolean) => {
    if (cardStyle === 'elevated' && !isSelected) {
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)';
    }
  };

  return (
    <div
      className="w-full box-border px-1"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
      }}
    >
      {options.map((option) => {
        const isSelected = value === option.id;

        return (
          <div
            key={option.id}
            onClick={() => onChange(option.id)}
            style={getCardStyle(option, isSelected)}
            onMouseEnter={(e) => handleMouseEnter(e, isSelected)}
            onMouseLeave={(e) => handleMouseLeave(e, isSelected)}
            className="cursor-pointer flex items-center relative"
          >
            <div style={getIconStyle(option, isSelected)} className="flex items-center justify-center flex-shrink-0">
              {typeof option.icon === 'string' ? option.icon : option.icon}
            </div>

            <div className="flex-1" style={{ gap: `${gap}px` }}>
              <div style={getTitleStyle(option, isSelected)}>{option.title}</div>
              <div
                className="text-slate-500 leading-relaxed"
                style={{
                  fontSize: `${currentSize.descriptionSize}px`,
                }}
              >
                {option.description}
              </div>
            </div>

            <div style={getCheckStyle(option, isSelected)} className="flex items-center justify-center flex-shrink-0">
              {isSelected && (
                <span
                  className="text-white font-bold"
                  style={{
                    fontSize: `${currentSize.checkSize * 0.58}px`,
                  }}
                >
                  ✓
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SelectionCard;