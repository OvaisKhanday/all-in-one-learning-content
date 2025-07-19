import { FC } from "react";

interface PostProps {
  post: PostType;
}

const Post: FC<PostProps> = ({ post }) => {
  return (
    <div>
      <span>id: {post.id}</span>
      <span>title: {post.title}</span>
      <span>category: {post.category}</span>
    </div>
  );
};

export default Post;
