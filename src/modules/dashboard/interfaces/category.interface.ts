export interface CreateCategoryRequest {
  name: string;
  slug: string;
}

export interface UpdateCategoryRequest {
  id: string;
  name?: string;
  slug?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetCategoryByIdRequest {
  id: string;
}
