export interface IAllPosts {
  id: string;
  title: string | null;
  body: string;
  hashtags: string[];
  post_type: string;
  file_type: string;
  media: string;
  author: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    image: string;
    roles: string[];
    is_online: boolean;
    last_login: string | null;
  };
  liked: {
    status: boolean;
    id: string;
  };
  bookmarked: {
    status: boolean;
    id: string | null;
  };
  thumbnail: string | null;
  comment_count: number;
  liked_avatars: string[];
  like_count: number;
  share_count: number;
  created_at: string;
  modified_at: string;
  is_following: boolean;
  view_count: number;
}

export interface IAllPolls {
  id: string;
  question_text: string;
  image: string | null;
  video: string | null;
  author: {
    id: string;
    email: string;
    roles: string[];
    firstname: string;
    lastname: string;
    image: string;
  };
  duration: string;
  poll_choices: {
    choice_id: string;
    choice_text: string;
    percentage: number;
  }[];
  total_vote_count: number;
  comment_count: number;
  like_count: number;
  is_liked: boolean;
  voted: boolean;
  created_at: string;
  modified_at: string;
}
