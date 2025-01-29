import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Trash2, ArrowUpRight } from "lucide-react";
import api from "../lib/axios";
import { Post, User } from "../types";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const [postsRes, usersRes] = await Promise.all([
          api.get("/posts"),
          api.get("/users"),
        ]);
        setPosts(postsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/posts/${postId}`);
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      setError("Failed to delete post");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold mb-6">Posts</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">
                  Title
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  User
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Date
                </th>
                <th className="text-right p-4 font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <Link
                      to={`/post/${post._id}`}
                      className="group inline-flex items-center gap-1.5 font-medium text-gray-900 hover:text-blue-600"
                    >
                      {post.title}
                      <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </Link>
                  </td>
                  <td className="p-4 text-gray-600">{post.author.username}</td>
                  <td className="p-4 text-gray-600">
                    {format(new Date(post.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete post"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">
                  Username
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Email
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Role
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">
                    {user.username}
                  </td>
                  <td className="p-4 text-gray-600">{user.email}</td>
                  <td className="p-4">
                    <span className="text-sm font-medium">
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">
                    {format(new Date(user.createdAt), "MMM d, yyyy")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
