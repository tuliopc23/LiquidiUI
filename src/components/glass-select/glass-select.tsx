import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn, getGlassClass } from '@/lib/glass-utils';

export interface GlassSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface GlassSelectProps {
  options: GlassSelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'search';
}

export const GlassSelect = React.forwardRef<HTMLDivElement, GlassSelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = 'Select an option',
      disabled,
      className,
      variant: _variant = 'default',
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || '');
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
      setSelectedValue(optionValue);
      onChange?.(optionValue);
      setIsOpen(false);
    };

    const selectedOption = options.find(opt => opt.value === selectedValue);

    return (
      <div
        ref={ref || selectRef}
        className={cn('relative', className)}
        {...props}
      >
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            getGlassClass('default'),
            'w-full px-4 py-3 text-left rounded-xl',
            'flex items-center justify-between',
            'transition-all duration-200 ease-out',
            'border border-white/20 dark:border-white/10',
            'text-gray-900 dark:text-white',
            'placeholder:text-gray-500 dark:placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent',
            'hover:bg-white/10 dark:hover:bg-white/5',
            disabled && 'opacity-50 cursor-not-allowed',
            isOpen && 'ring-2 ring-blue-500/50 border-transparent'
          )}
        >
          <span
            className={cn(
              selectedOption
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400'
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={cn(
              'h-4 w-4 text-gray-400 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        </button>

        {isOpen && (
          <div
            className={cn(
              getGlassClass('elevated'),
              'absolute z-50 w-full mt-2 rounded-xl border border-white/20 dark:border-white/10',
              'max-h-60 overflow-auto',
              'animate-in fade-in-0 zoom-in-95 duration-200'
            )}
          >
            {options.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => !option.disabled && handleSelect(option.value)}
                disabled={option.disabled}
                className={cn(
                  'w-full px-4 py-3 text-left transition-colors duration-200',
                  'hover:bg-white/10 dark:hover:bg-white/5',
                  'focus:outline-none focus:bg-white/10 dark:focus:bg-white/5',
                  'flex items-center justify-between',
                  'text-gray-900 dark:text-white',
                  option.disabled && 'opacity-50 cursor-not-allowed',
                  selectedValue === option.value &&
                    'bg-blue-500/10 text-blue-600 dark:text-blue-400',
                  'first:rounded-t-xl last:rounded-b-xl'
                )}
              >
                <span>{option.label}</span>
                {selectedValue === option.value && (
                  <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

GlassSelect.displayName = 'GlassSelect';
