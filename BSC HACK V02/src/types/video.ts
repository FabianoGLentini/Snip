
export interface Video {
  id: string;
  url: string;
  title: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  author: {
    name: string;
    username: string;
    avatar: string;
    followers: number;
  };
}
