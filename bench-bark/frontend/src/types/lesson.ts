export interface Lesson {
  id: number;
  category_id: number;
  category_name: string;
  title: string;
  description: string | null;
  content_body: string | null;
  video_url: string | null;
  video_file_url: string | null;
  image_urls: string[];
  thumbnail_url: string | null;
  created_by: number | null;
  display_order: number;
  is_published: boolean;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateLessonInput {
  category_id: number;
  title: string;
  description?: string;
  content_body?: string;
  video_url?: string;
  video_file_url?: string;
  image_urls?: string[];
  thumbnail_url?: string;
  display_order?: number;
  is_published?: boolean;
}

export interface UpdateLessonInput extends Partial<CreateLessonInput> {}

export interface ProgressResponse {
  total: number;
  read: number;
  percentage: number;
}
