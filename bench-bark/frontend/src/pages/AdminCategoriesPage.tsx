import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../hooks/useCategories';
import CategoryForm from '../components/lessons/CategoryForm';
import type { CategoryFormData } from '../components/lessons/CategoryForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import type { Category } from '../types/category';

export default function AdminCategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;

  const handleCreate = (data: CategoryFormData) => {
    createMutation.mutate(data, { onSuccess: () => setShowCreate(false) });
  };

  const handleUpdate = (data: CategoryFormData) => {
    if (editing) updateMutation.mutate({ id: editing.id, data }, { onSuccess: () => setEditing(null) });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Categories</h1>
        <Button onClick={() => setShowCreate(true)}><FaPlus className="text-xs" /> New Category</Button>
      </div>

      <div className="space-y-3">
        {categories?.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{cat.name}</h3>
              <p className="text-sm text-gray-500">{cat.description}</p>
              <p className="text-xs text-paw-600 mt-1">{cat.lesson_count} lessons | Order: {cat.display_order}</p>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => setEditing(cat)}><FaEdit /></Button>
              <Button variant="ghost" size="sm" onClick={() => setDeleteId(cat.id)}><FaTrash className="text-red-400" /></Button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Category">
        <CategoryForm onSubmit={handleCreate} isSubmitting={createMutation.isPending} submitLabel="Create" />
      </Modal>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Edit Category">
        {editing && (
          <CategoryForm
            defaultValues={{ name: editing.name, description: editing.description || '', image_url: editing.image_url || '', display_order: editing.display_order }}
            onSubmit={handleUpdate}
            isSubmitting={updateMutation.isPending}
            submitLabel="Save"
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }}
        title="Delete Category"
        message="This will also delete all lessons in this category. Are you sure?"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
