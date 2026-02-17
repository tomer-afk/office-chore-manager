import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useCategory } from '../hooks/useCategories';
import { useLessons } from '../hooks/useLessons';
import LessonCard from '../components/lessons/LessonCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import { ROUTES } from '../config/constants';

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const { data: category } = useCategory(Number(id));
  const { data: lessons, isLoading } = useLessons(Number(id));

  if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;

  return (
    <div>
      <Link to={ROUTES.LESSONS} className="inline-flex items-center gap-2 text-bark-600 hover:text-bark-700 mb-4">
        <FaArrowLeft /> All categories
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">{category?.name}</h1>
      {category?.description && <p className="text-gray-500 mb-6">{category.description}</p>}

      {!lessons || lessons.length === 0 ? (
        <EmptyState title="No lessons yet" description="Lessons will appear here once added." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      )}
    </div>
  );
}
