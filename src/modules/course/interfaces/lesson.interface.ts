import { Comment } from '@prisma/client'

export interface GetLessonResponse {
  id: string
  title: string
  videoUrl: string
  sectionId: string
  order: number
  freePreview: boolean
  completed?:boolean
  comments?: Comment[]
}

export interface CreateLessonRequest {
  title: string
  videoUrl: string
  freePreview: boolean
  sectionId: string
  order: number
}

export interface UpdateLessonRequest {
  title?: string
  videoUrl?: string
  freePreview?: boolean
  sectionId?: string
  order?: number
}
