interface Post {
  id: string;
  title: string;
  content: string;
}

// Next.js will invalidate the cache when a
// request comes in, at most once every 60 seconds.

// We'll prerender only the params from `generateStaticParams` at build time.
// If a request comes in for a path that hasn't been generated,
// Next.js will server-render the page on-demand.
const url = "https://api.jsonbin.io/v3/b/68639f398a456b7966b958d6";

export const dynamicParams = true; // or false, to 404 on unknown paths
export const revalidate = false;
export const dynamic = "error";
export async function generateStaticParams() {
  const posts: { record: Post[] } = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key":
        "$2a$10$oq6asaZz8iPqzgDJxEnE3u3hmWqF8shY7jjEY7ZbFc/wKLUfqaIzO",
    },
  }).then(res => res.json());
  return posts.record.map(post => ({
    id: String(post.id),
  }));
}

export default async function Page({
  params,
  ...x
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const posts: { record: Post[] } = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key":
        "$2a$10$oq6asaZz8iPqzgDJxEnE3u3hmWqF8shY7jjEY7ZbFc/wKLUfqaIzO",
    },
  }).then(res => res.json());
  const timeNow = new Date().toString();
  const post = posts.record.find(p => p.id.toString() === id);
  if (!post) throw new Error();
  return (
    <main>
      <h1>{post?.title}</h1>
      <h2>Time {timeNow}</h2>
      <p>{post?.content}</p>
    </main>
  );
}
