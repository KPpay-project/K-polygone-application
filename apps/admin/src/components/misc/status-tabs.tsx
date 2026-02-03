interface StatusTab {
  key: string;
  label: string;
  count?: number;
}

interface StatusTabsProps {
  tabs: StatusTab[];
  activeTab: string;
  onTabChange: (tabKey: string) => void;
  className?: string;
  useWhiteBg?: boolean;
}

const StatusTabs = ({ tabs, activeTab, onTabChange, className = '', useWhiteBg = true }: StatusTabsProps) => {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex space-x-1 rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-3 rounded-lg text-sm transition-colors ${
              activeTab === tab.key
                ? 'text-blue-700 shadow-sm border border-blue-700 bg-blue-100/70'
                : useWhiteBg
                  ? 'bg-white hover:text-gray-900 border border-transparent'
                  : 'bg-gray-50 hover:text-gray-900 border border-transparent'
            }`}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
            {typeof tab.count === 'number' && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-blue-700 text-white rounded-full">{tab.count}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusTabs;
