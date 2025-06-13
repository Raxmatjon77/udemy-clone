export interface GetEnrollmentsRequest {
  userId: string
}

export interface Enrollment {
  id: string
  course: {
    id: string
    title: string
    slug: string
    image: string
    categoryId: string
  }
}
