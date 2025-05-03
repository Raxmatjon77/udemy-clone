export interface CustomUser {
  user: {
    id: string;
    email: string;
    role: string;
    ip: string;
    userAgent: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
