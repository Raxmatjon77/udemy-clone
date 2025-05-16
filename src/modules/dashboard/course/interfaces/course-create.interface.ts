export interface CreateCourseRequest {
  title: string;
  slug: string;
  desc: string;
  price: number;
  thumbnail: string;
  image?: string;
  isPublished: boolean;
  categoryId: string;
  authorId: string;
}
