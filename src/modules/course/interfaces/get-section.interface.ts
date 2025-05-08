export interface GetSectionResponse {
  id: string;
  title: string;
  order: number;
  lessons: {
    id: string;
    title: string;
    order: number;
    freePreview: boolean;
  }[];
}
