import { useParams } from 'react-router-dom';
import { useLesson } from '../hooks/useLessons';
import LessonView from '../components/lessons/LessonView';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function LessonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: lesson, isLoading } = useLesson(Number(id));

  if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;
  if (!lesson) return <p className="text-center text-gray-500 py-20">Lesson not found.</p>;

  return <LessonView lesson={lesson} />;
}
