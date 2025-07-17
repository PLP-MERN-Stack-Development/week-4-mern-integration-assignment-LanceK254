import { createContext, useState, useEffect } from 'react';
import useApi from '../hooks/useApi';

export const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const { request } = useApi();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await request('get', `/api/posts?page=${page}&limit=6`);
        setPosts(data.posts);
        setTotalPages(data.pages);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchPosts();
  }, [request, page]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await request('get', '/api/categories');
        setCategories(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchCategories();
  }, [request]);

  const addOrUpdatePost = (post) => {
    setPosts((prevPosts) => {
      const existingPost = prevPosts.find((p) => p._id === post._id);
      if (existingPost) {
        return prevPosts.map((p) => (p._id === post._id ? post : p));
      }
      return [post, ...prevPosts];
    });
  };

  const deletePost = (id) => {
    setPosts((prevPosts) => prevPosts.filter((p) => p._id !== id));
  };

  return (
    <BlogContext.Provider value={{ posts, categories, loading, error, addOrUpdatePost, deletePost, page, setPage, totalPages }}>
      {children}
    </BlogContext.Provider>
  );
};