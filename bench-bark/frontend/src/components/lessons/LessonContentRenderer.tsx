import DOMPurify from 'dompurify';

interface LessonContentRendererProps {
  html: string;
}

export default function LessonContentRenderer({ html }: LessonContentRendererProps) {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'target', 'rel', 'class'],
  });

  return (
    <div
      className="prose prose-gray max-w-none"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
