import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import api from "../lib/axios";
import { Post } from "../types";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get("/posts");
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Link
          key={post._id}
          to={`/post/${post._id}`}
          className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="aspect-video overflow-hidden">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600">
              {post.title}
            </h2>
            <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{post.author.username}</span>
              <time>{format(new Date(post.createdAt), "MMM d, yyyy")}</time>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
