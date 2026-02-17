export interface Category {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  lesson_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  image_url?: string;
  display_order?: number;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {}
