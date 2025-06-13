export interface GetCourseResponse {
  id: string
  slug: string
  title: string
  desc: string
  price: number
  image: string
  thumbnail: string
  isPublished: boolean
  category: {
    id: string
    name: string
  }
  author: {
    id: string
    name: string
  }
  sections: {
    id: string
    title: string
  }[]
}
