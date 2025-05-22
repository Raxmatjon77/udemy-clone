export interface UpdateCourseRequest {
  title?: string
  slug?: string
  desc?: string
  price?: number
  thumbnail?: string
  isPublished?: boolean
  categoryId?: string
  authorId?: string
}
