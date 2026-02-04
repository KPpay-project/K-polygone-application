import React from 'react';

interface ActivityItem {
  time: string;
  content: string;
}

interface ActivityTimelineProps {
  items: ActivityItem[];
  className?: string;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ items, className = '' }) => {
  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      {items.map((activity, index) => (
        <div key={index} className="flex justify-between items-center w-full gap-4">
          <span className="text-sm font-medium leading-[20px] tracking-[-0.28px] text-gray-700">{activity.time}</span>
          <div className="bg-gray-100 rounded-[10px] p-[10px_10px_10px_16px] w-[336px] flex items-center justify-center">
            <div className="flex items-center gap-[10px]">
              <span className="text-sm font-normal leading-[20px] tracking-[-0.28px] text-gray-900">
                {activity.content}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export { type ActivityItem };
export default ActivityTimeline;
