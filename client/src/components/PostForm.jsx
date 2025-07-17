import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useApi from '../hooks/useApi';
import { BlogContext } from '../context/BlogContext';
import { AuthContext } from '../context/AuthContext';

const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { request, loading, error } = useApi();
  const { categories, addOrUpdatePost } = useContext(BlogContext);
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [formError, setFormError] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (id) {
      const fetchPost = async () => {
        try {
          const data = await request('get', `/api/posts/${id}`);
          setValue('title', data.title);
          setValue('content', data.content);
          setValue('category', data.category._id);
          setValue('author', data.author);
        } catch (err) {
          setFormError(err.message);
        }
      };
      fetchPost();
    }
  }, [id, request, setValue, user, navigate]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('category', data.category);
    formData.append('author', data.author);
    if (file) {
      formData.append('featuredImage', file);
    }

    try {
      const post = id
        ? await request('put', `/api/posts/${id}`, formData, () => addOrUpdatePost({ ...data, _id: id }))
        : await request('post', '/api/posts', formData, () => addOrUpdatePost({ ...data, _id: Date.now().toString() }));
      addOrUpdatePost(post);
      navigate('/');
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{id ? 'Edit Post' : 'Create Post'}</h1>
      {formError && <p className="text-red-500 mb-4">{formError}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" encType="multipart/form-data">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            {...register('title', { required: 'Title is required', minLength: { value: 3, message: 'Title must be at least 3 characters' } })}
            className={`w-full border p-2 rounded ${errors.title ? 'border-red-500' : ''}`}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Content</label>
          <textarea
            {...register('content', { required: 'Content is required', minLength: { value: 10, message: 'Content must be at least 10 characters' } })}
            className={`w-full border p-2 rounded ${errors.content ? 'border-red-500' : ''}`}
            rows="5"
          />
          {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            {...register('category', { required: 'Category is required' })}
            className={`w-full border p-2 rounded ${errors.category ? 'border-red-500' : ''}`}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Author</label>
          <input
            {...register('author', { required: 'Author is required', minLength: { value: 3, message: 'Author must be at least 3 characters' } })}
            className={`w-full border p-2 rounded ${errors.author ? 'border-red-500' : ''}`}
          />
          {errors.author && <p className="text-red-500 text-sm">{errors.author.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Featured Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Saving...' : id ? 'Update Post' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default PostForm;