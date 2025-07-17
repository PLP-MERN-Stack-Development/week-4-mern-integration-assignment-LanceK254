import { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { BlogContext } from '../context/BlogContext';
import { AuthContext } from '../context/AuthContext';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { request, loading, error } = useApi();
  const { deletePost } = useContext(BlogContext);
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await request('get', `/api/posts/${id}`);
        setPost(data);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchComments = async () => {
      try {
        const data = await request('get', `/api/comments/${id}`);
        setComments(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPost();
    fetchComments();
  }, [id, request]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await request('delete', `/api/posts/${id}`, null, () => {
          deletePost(id);
          return post;
        });
        navigate('/');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const newComment = await request('post', `/api/comments/${id}`, { content: commentContent });
      setComments((prev) => [...prev, newComment]);
      setCommentContent('');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      {post.featuredImage && (
        <img src={post.featuredImage} alt={post.title} className="w-full h-64 object-cover mb-4 rounded" />
      )}
      <p className="text-gray-600 mb-2">By {post.author}</p>
      <p className="text-gray-600 mb-4">Category: {post.category.name}</p>
      <p className="mb-4">{post.content}</p>
      {user && (
        <div className="space-x-4 mb-4">
          <Link
            to={`/edit/${post._id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="border p-4 rounded">
                <p>{comment.content}</p>
                <p className="text-gray-600 text-sm">By {comment.author.username}</p>
              </div>
            ))}
          </div>
        )}
        {user && (
          <form onSubmit={handleCommentSubmit} className="mt-4">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="w-full border p-2 rounded"
              rows="3"
              placeholder="Add a comment..."
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PostDetail;