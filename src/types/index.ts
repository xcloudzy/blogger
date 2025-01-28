export interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}