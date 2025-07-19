import { posts } from "@/lib/posts";

export default async function Post({ params }: { params: Promise<{ slug: number }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.id == slug);
  return (
    <div>
      Hello World
      {post?.title}
    </div>
  );
}
