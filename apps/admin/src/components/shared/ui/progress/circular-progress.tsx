interface CircularProgressBarProps {
  percentage?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  percentage = 50,
  size = 120,
  strokeWidth = 10,
  color = 'text-brandBlue-500'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="circular-progress-bar">
        {/* Background Circle */}
        <circle
          className="circle-bg"
          stroke="#D9D9D9"
          strokeWidth={strokeWidth}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        {/* Progress Circle */}
        <circle
          className={`circle-progress stroke-current ${color} transition-[stroke-dashoffset] duration-500 [transform:rotate(-90deg)] [transform-origin:50%_50%]`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
    </div>
  );
};

export default CircularProgressBar;
