import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import LessonContentRenderer from './LessonContentRenderer';
import type { Lesson } from '../../types/lesson';

interface LessonViewProps {
  lesson: Lesson;
}

export default function LessonView({ lesson }: LessonViewProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <Link to={`/lessons/category/${lesson.category_id}`} className="inline-flex items-center gap-2 text-bark-600 hover:text-bark-700 mb-4">
        <FaArrowLeft /> Back to lessons
      </Link>

      {lesson.video_url && (
        <div className="aspect-video rounded-2xl overflow-hidden mb-6 bg-black">
          <iframe
            src={lesson.video_url}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      )}

      {!lesson.video_url && lesson.video_file_url && (
        <div className="aspect-video rounded-2xl overflow-hidden mb-6 bg-black">
          <video src={lesson.video_file_url} controls className="w-full h-full" />
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs bg-paw-100 text-paw-700 px-2 py-0.5 rounded-full">{lesson.category_name}</span>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{lesson.title}</h1>
            {lesson.description && <p className="text-gray-500 mt-1">{lesson.description}</p>}
          </div>
          {lesson.is_read && (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <FaCheckCircle /> Read
            </div>
          )}
        </div>

        {lesson.content_body && <LessonContentRenderer html={lesson.content_body} />}

        {lesson.image_urls && lesson.image_urls.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {lesson.image_urls.map((url, i) => (
              <img key={i} src={url} alt={`Lesson image ${i + 1}`} className="rounded-xl w-full" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
