import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import api from '../lib/axios';
import { Post } from '../types';
import { useAuth } from '../context/AuthContext';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPost(data);
      } catch (error) {
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/posts/${id}`);
      navigate('/');
    } catch (error) {
      setError('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center text-red-500 py-8">
        {error || 'Post not found'}
      </div>
    );
  }

  const canModify = user && (user.isAdmin || user._id === post.author._id);

  return (
    <article className="max-w-3xl mx-auto">
      <div className="aspect-video mb-8 rounded-lg overflow-hidden">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center justify-between text-gray-500 mb-8">
          <div className="flex items-center gap-2">
            <span>By {post.author.username}</span>
            <span>•</span>
            <time>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</time>
          </div>

          {canModify && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/edit-post/${post._id}`)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="whitespace-pre-wrap">{post.content}</div>
      </div>
    </article>
  );
}