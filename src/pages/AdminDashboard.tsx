import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import api from "../lib/axios";
import { Post, User } from "../types";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
        // Posts endpoint works fine
        console.log("Fetching posts...");
        const postsRes = await api.get("/posts");
        console.log("Posts fetched successfully:", postsRes.data);
        setPosts(postsRes.data);

        // Temporarily disable users fetch until backend is ready
        setUsers([]); // Set empty array for now
        setError("Users endpoint is being set up");

        /* Uncomment this when backend is ready
        console.log('Fetching users...');
        const usersRes = await api.get("/users");
        console.log('Users data structure:', usersRes.data);
        setUsers(usersRes.data);
        */
      } catch (error: any) {
        console.error("Error details:", error);
        setError(
          `Failed to load data: ${error.response?.status} ${
            error.response?.statusText || error.message
          }`
        );
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
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-4">Title</th>
                <th className="text-left p-4">Author</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {posts.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50">
                  <td className="p-4">{post.title}</td>
                  <td className="p-4">{post.author.username}</td>
                  <td className="p-4">
                    {format(new Date(post.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="text-red-600 hover:text-red-700"
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
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-4">Username</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Role</th>
                <th className="text-left p-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="p-4">{user.username}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.isAdmin ? "Admin" : "User"}</td>
                  <td className="p-4">
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
