import Post from "@/ui/post";
import { posts } from "../../lib/posts";
import Link from "next/link";

export default async function Posts({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const category: PostCategory | undefined = (await searchParams).category as PostCategory | undefined;

  let filteredPosts = posts;

  if (category) filteredPosts = posts.filter((p) => p.category === category);
  return (
    <div>
      {filteredPosts.map((post) => (
        <li key={post.id}>
          <Post post={post} />
          <Link className='underline' href={`/blog/${post.id}`}>
            Open
          </Link>
        </li>
      ))}
    </div>
  );
}
