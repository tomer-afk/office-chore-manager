import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useLesson, useCreateLesson, useUpdateLesson } from '../hooks/useLessons';
import LessonForm from '../components/lessons/LessonForm';
import type { LessonFormData } from '../components/lessons/LessonForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ROUTES } from '../config/constants';

export default function AdminLessonFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  const { data: lesson, isLoading } = useLesson(Number(id));
  const createMutation = useCreateLesson();
  const updateMutation = useUpdateLesson();

  if (isEditing && isLoading) return <LoadingSpinner size="lg" className="py-20" />;

  const handleSubmit = (data: LessonFormData) => {
    if (isEditing && id) {
      updateMutation.mutate(
        { id: Number(id), data },
        { onSuccess: () => navigate(ROUTES.ADMIN_LESSONS) }
      );
    } else {
      createMutation.mutate(data, { onSuccess: () => navigate(ROUTES.ADMIN_LESSONS) });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Link to={ROUTES.ADMIN_LESSONS} className="inline-flex items-center gap-2 text-bark-600 hover:text-bark-700 mb-4">
        <FaArrowLeft /> Back to lessons
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isEditing ? 'Edit Lesson' : 'New Lesson'}</h1>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <LessonForm
          defaultValues={
            isEditing && lesson
              ? {
                  category_id: lesson.category_id,
                  title: lesson.title,
                  description: lesson.description || '',
                  content_body: lesson.content_body || '',
                  video_url: lesson.video_url || '',
                  thumbnail_url: lesson.thumbnail_url || '',
                  display_order: lesson.display_order,
                  is_published: lesson.is_published,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          submitLabel={isEditing ? 'Save Changes' : 'Create Lesson'}
          lesson={lesson}
        />
      </div>
    </div>
  );
}
