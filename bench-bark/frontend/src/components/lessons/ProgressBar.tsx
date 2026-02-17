interface ProgressBarProps {
  percentage: number;
  read: number;
  total: number;
}

export default function ProgressBar({ percentage, read, total }: ProgressBarProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">Training Progress</span>
        <span className="text-sm text-gray-500">{read}/{total} lessons</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-bark-400 to-bark-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">{percentage}% complete</p>
    </div>
  );
}
