import { Link } from 'react-router-dom';
import { FaCheckCircle, FaPlayCircle } from 'react-icons/fa';
import type { Lesson } from '../../types/lesson';

interface LessonCardProps {
  lesson: Lesson;
}

export default function LessonCard({ lesson }: LessonCardProps) {
  return (
    <Link
      to={`/lessons/${lesson.id}`}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
    >
      <div className="aspect-video bg-gray-100 relative flex items-center justify-center">
        {lesson.thumbnail_url ? (
          <img src={lesson.thumbnail_url} alt={lesson.title} className="w-full h-full object-cover" />
        ) : (
          <FaPlayCircle className="text-5xl text-gray-300 group-hover:text-bark-400 transition-colors" />
        )}
        {lesson.is_read && (
          <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
            <FaCheckCircle className="text-sm" />
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs bg-paw-100 text-paw-700 px-2 py-0.5 rounded-full">{lesson.category_name}</span>
        </div>
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{lesson.title}</h3>
        {lesson.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{lesson.description}</p>
        )}
      </div>
    </Link>
  );
}
