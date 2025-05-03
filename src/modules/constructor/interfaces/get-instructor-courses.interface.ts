

export interface GetInstructorCoursesRequest {
  instructorId: string;
}

export interface GetInstructorCoursesResponse {
  courses: Course[];
}

export interface Course {
  id: string;
  title: string;
  desc: string;
  price: number;
  thumbnail: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  authorId: string;
  categoryId: string;
  sections: Section[];
  enrollments: Enrollment[];
  reviews: Review[];
  stars: Star[];
}

export interface Section {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  courseId: string;
  rating: number;
}

export interface Star {
  id: string;
  userId: string;
  courseId: string;
  rating: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  sectionId: string;
}
