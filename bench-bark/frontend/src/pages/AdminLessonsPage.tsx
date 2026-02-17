import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useLessons, useDeleteLesson } from '../hooks/useLessons';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ROUTES } from '../config/constants';

export default function AdminLessonsPage() {
  const { data: lessons, isLoading } = useLessons();
  const deleteMutation = useDeleteLesson();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Lessons</h1>
        <Link to={ROUTES.ADMIN_LESSON_NEW}>
          <Button><FaPlus className="text-xs" /> New Lesson</Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-600">Title</th>
              <th className="px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Category</th>
              <th className="px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 font-medium text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {lessons?.map((lesson) => (
              <tr key={lesson.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{lesson.title}</td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{lesson.category_name}</td>
                <td className="px-4 py-3">
                  <Badge variant={lesson.is_published ? 'success' : 'default'}>
                    {lesson.is_published ? 'Published' : 'Draft'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link to={`/admin/lessons/${lesson.id}/edit`}>
                      <Button variant="ghost" size="sm"><FaEdit /></Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteId(lesson.id)}>
                      <FaTrash className="text-red-400" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }}
        title="Delete Lesson"
        message="Are you sure? This cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
