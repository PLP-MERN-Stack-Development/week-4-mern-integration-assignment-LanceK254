import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BlogProvider } from './context/BlogContext';
import NavBar from './components/NavBar';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import PostForm from '/components/PostForm';

function App() {
  return (
    <BlogProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/create" element={<PostForm />} />
          <Route path="/edit/:id" element={<PostForm />} />
          <Route path="/categories" element={<div>Categories Page (To be implemented)</div>} />
        </Routes>
      </Router>
    </BlogProvider>
  );
}

export default App;