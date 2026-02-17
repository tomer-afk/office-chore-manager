import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCategories } from '../../hooks/useCategories';
import type { Lesson } from '../../types/lesson';

const lessonSchema = z.object({
  category_id: z.coerce.number().min(1, 'Category is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  content_body: z.string().optional(),
  video_url: z.string().url().optional().or(z.literal('')),
  thumbnail_url: z.string().url().optional().or(z.literal('')),
  display_order: z.coerce.number().default(0),
  is_published: z.boolean().default(false),
});

export type LessonFormData = z.infer<typeof lessonSchema>;

interface LessonFormProps {
  defaultValues?: Partial<LessonFormData>;
  onSubmit: (data: LessonFormData) => void;
  isSubmitting: boolean;
  submitLabel: string;
  lesson?: Lesson;
}

export default function LessonForm({ defaultValues, onSubmit, isSubmitting, submitLabel }: LessonFormProps) {
  const { data: categories } = useCategories();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: { display_order: 0, is_published: false, ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            {...register('title')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bark-500 focus:border-transparent outline-none"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select
            {...register('category_id')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bark-500 focus:border-transparent outline-none"
          >
            <option value="">Select a category</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          {...register('description')}
          rows={2}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bark-500 focus:border-transparent outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Content Body (HTML)</label>
        <textarea
          {...register('content_body')}
          rows={10}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bark-500 focus:border-transparent outline-none font-mono text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (YouTube/Vimeo embed)</label>
          <input
            {...register('video_url')}
            placeholder="https://www.youtube.com/embed/..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bark-500 focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
          <input
            {...register('thumbnail_url')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bark-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
          <input
            type="number"
            {...register('display_order')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bark-500 focus:border-transparent outline-none"
          />
        </div>
        <div className="flex items-center pt-7">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('is_published')} className="w-4 h-4 rounded text-bark-500 focus:ring-bark-500" />
            <span className="text-sm font-medium text-gray-700">Published</span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-bark-500 hover:bg-bark-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
