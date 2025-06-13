export interface CreateReviewRequest {
  userId: string
  courseId: string
  rating: number
  comment: string
}
