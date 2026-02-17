import { Link } from 'react-router-dom';
import { FaBook } from 'react-icons/fa';
import type { Category } from '../../types/category';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/lessons/category/${category.id}`}
      className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
    >
      <div className="w-12 h-12 bg-bark-100 rounded-xl flex items-center justify-center mb-3">
        {category.image_url ? (
          <img src={category.image_url} alt={category.name} className="w-8 h-8 object-cover rounded" />
        ) : (
          <FaBook className="text-xl text-bark-500" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
      {category.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{category.description}</p>}
      <p className="text-xs text-paw-600 mt-2 font-medium">{category.lesson_count} lesson{category.lesson_count !== 1 ? 's' : ''}</p>
    </Link>
  );
}
