import React, { useState } from 'react';
import './BlogSection.css';

const BlogSection = () => {
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: 'My First Blog Post',
      content: 'This is a sample blog post. Click the + button to add your own!',
      image: 'https://source.unsplash.com/random/400x200?blog,writing',
      date: new Date().toLocaleDateString(),
    },
  ]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    image: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBlog(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newBlog.title && newBlog.content) {
      const blogToAdd = {
        ...newBlog,
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        image: newBlog.image || 'https://source.unsplash.com/random/400x200?blog,writing'
      };
      setBlogs(prev => [blogToAdd, ...prev]);
      setNewBlog({ title: '', content: '', image: '' });
      setIsFormOpen(false);
    }
  };

  const handleDelete = (id) => {
    setBlogs(prev => prev.filter(blog => blog.id !== id));
  };

  return (
    <div className="blog-section">
      <div className="blog-header">
        <h2>My Blog</h2>
        <button 
          className="add-blog-btn" 
          onClick={() => setIsFormOpen(true)}
          aria-label="Add new blog post"
        >
          +
        </button>
      </div>

      {isFormOpen && (
        <div className="blog-form-overlay">
          <div className="blog-form-container">
            <h3>Add New Blog Post</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={newBlog.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea
                  name="content"
                  value={newBlog.content}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Image URL (optional)</label>
                <input
                  type="url"
                  name="image"
                  value={newBlog.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </button>
                <button type="submit">Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="blog-posts">
        {blogs.map(blog => (
          <div key={blog.id} className="blog-card">
            {blog.image && (
              <div className="blog-image">
                <img src={blog.image} alt={blog.title} />
              </div>
            )}
            <div className="blog-content">
              <h3>{blog.title}</h3>
              <p>{blog.content}</p>
              <div className="blog-footer">
                <span className="blog-date">{blog.date}</span>
                <button 
                  className="delete-blog"
                  onClick={() => handleDelete(blog.id)}
                  aria-label={`Delete blog post: ${blog.title}`}
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogSection;
