import { useState, useId } from 'react';
import { cn } from '@/lib/glass-utils';

export interface GlassTabItem {
  // Renamed for clarity
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface GlassTabsProps {
  tabs: GlassTabItem[];
  defaultTab?: string;
  className?: string;
  tabListClassName?: string;
  tabButtonClassName?: string;
  activeTabButtonClassName?: string;
  inactiveTabButtonClassName?: string;
  tabPanelClassName?: string;
  orientation?: 'horizontal' | 'vertical'; // For future enhancement
}

export function GlassTabs({
  tabs,
  defaultTab,
  className,
  tabListClassName,
  tabButtonClassName,
  activeTabButtonClassName = 'bg-primary text-white', // Default active class
  inactiveTabButtonClassName = 'text-secondary hover:text-primary', // Default inactive class
  tabPanelClassName,
  // orientation = 'horizontal', // For future enhancement
}: GlassTabsProps) {
  const [activeTab, setActiveTab] = useState(
    defaultTab || tabs.find(tab => !tab.disabled)?.id || tabs[0]?.id
  );
  const baseId = useId();

  // TODO: Implement keyboard navigation for tabs (ArrowLeft/Right or ArrowUp/Down based on orientation)
  // This would typically involve managing focus manually within the tablist.

  return (
    <div className={cn('w-full', className)}>
      <div
        role="tablist"
        aria-orientation="horizontal" // Change to 'vertical' if orientation prop is implemented
        className={cn(
          'mb-6 flex space-x-1 glass-effect rounded-lg p-1',
          tabListClassName
        )}
      >
        {tabs.map(tab => (
          <button
            type="button"
            role="tab"
            key={tab.id}
            id={`${baseId}-tab-${tab.id}`}
            aria-controls={`${baseId}-panel-${tab.id}`}
            aria-selected={activeTab === tab.id}
            tabIndex={activeTab === tab.id ? 0 : -1} // Only active tab is in tab order initially
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            disabled={tab.disabled}
            className={cn(
              'flex-1 px-4 py-2 rounded-md font-medium text-sm transition-all btn-scale focus:outline-none focus:ring-2 focus:ring-blue-500',
              tabButtonClassName,
              activeTab === tab.id
                ? activeTabButtonClassName
                : inactiveTabButtonClassName,
              tab.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map(tab => (
        <div
          key={tab.id}
          id={`${baseId}-panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={activeTab !== tab.id}
          className={cn('tab-content focus:outline-none', tabPanelClassName)} // Added focus:outline-none for potential programmatic focus
          tabIndex={0} // Make panel focusable if needed, e.g., for scroll management
        >
          {activeTab === tab.id && (
            <div className="glass-effect rounded-lg p-6">{tab.content}</div>
          )}
        </div>
      ))}
    </div>
  );
}
