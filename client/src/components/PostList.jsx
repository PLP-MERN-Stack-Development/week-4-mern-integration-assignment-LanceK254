import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BlogContext } from '../context/BlogContext';

const PostList = () => {
  const { posts, loading, error, page, setPage, totalPages } = useContext(BlogContext);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Blog Posts</h1>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div key={post._id} className="border p-4 rounded shadow">
              {post.featuredImage && (
                <img src={post.featuredImage} alt={post.title} className="w-full h-48 object-cover mb-2 rounded" />
              )}
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-600">By {post.author}</p>
              <p className="text-gray-600">Category: {post.category.name}</p>
              <Link
                to={`/posts/${post._id}`}
                className="text-blue-600 hover:underline"
              >
                Read More
              </Link>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 flex justify-center space-x-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PostList;