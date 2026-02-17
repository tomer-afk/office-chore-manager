import { useCategories } from '../hooks/useCategories';
import { useProgress } from '../hooks/useProgress';
import CategoryCard from '../components/lessons/CategoryCard';
import ProgressBar from '../components/lessons/ProgressBar';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function LessonsPage() {
  const { data: categories, isLoading } = useCategories();
  const { data: progress } = useProgress();

  if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Training</h1>
          <p className="text-gray-500">Browse lessons by category</p>
        </div>
        {progress && (
          <div className="w-64 hidden md:block">
            <ProgressBar percentage={progress.percentage} read={progress.read} total={progress.total} />
          </div>
        )}
      </div>

      {progress && (
        <div className="mb-6 md:hidden">
          <ProgressBar percentage={progress.percentage} read={progress.read} total={progress.total} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories?.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
}
