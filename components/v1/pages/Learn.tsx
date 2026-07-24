import PageShell from "@/components/v1/PageShell";
import Backdrop from "@/components/v1/sections/Events/Backdrop";
import ResourceExplorer from "@/components/v1/sections/Learn/ResourceExplorer";
import type { PostCard } from "@/components/v1/sections/Learn/types";

// Re-exported so the blog content layer can keep a single import site.
export type { PostCard };

export default function Learn({ posts }: { posts: PostCard[] }) {
  return (
    <PageShell backdrop={<Backdrop behindNav />}>
      <div className="overflow-x-clip">
        <ResourceExplorer posts={posts} />
      </div>
    </PageShell>
  );
}
