export interface Author {
  id: string;
  name: string;
  profilePicture: string;
  yearOfLife: string;
  bio: string;
  description: string;
}

export interface Post {
  id: string;
  title: string;
  author: string;
  content: string;
}
