import React, { useState } from 'react';
import './BlogSection.css';

const BlogSection = () => {
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: 'Hello from the editor',
      content: 'This little corner is for my own notes. Hit + to write one of yours.',
      image: '',
      date: new Date().toLocaleDateString(),
    },
  ]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newBlog, setNewBlog] = useState({ title: '', content: '', image: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBlog(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newBlog.title && newBlog.content) {
      setBlogs(prev => [{ ...newBlog, id: Date.now(), date: new Date().toLocaleDateString() }, ...prev]);
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
        <h2 className="panel-title">Editor's notes</h2>
        <button className="add-blog-btn" type="button" onClick={() => setIsFormOpen(true)} aria-label="Write a new note">+</button>
      </div>

      {isFormOpen && (
        <div className="blog-form-overlay" onClick={() => setIsFormOpen(false)}>
          <div className="blog-form-container" role="dialog" aria-modal="true" aria-label="New note" onClick={(e) => e.stopPropagation()}>
            <h3>New note</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="blog-title">Title</label>
                <input id="blog-title" type="text" name="title" value={newBlog.title} onChange={handleInputChange} required autoFocus />
              </div>
              <div className="form-group">
                <label htmlFor="blog-content">Note</label>
                <textarea id="blog-content" name="content" value={newBlog.content} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="blog-image">Image URL (optional)</label>
                <input id="blog-image" type="url" name="image" value={newBlog.image} onChange={handleInputChange} placeholder="https://…" />
              </div>
              <div className="form-actions">
                <button type="button" className="btn ghost" onClick={() => setIsFormOpen(false)}>Cancel</button>
                <button type="submit" className="btn">Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="blog-posts">
        {blogs.map(blog => (
          <article key={blog.id} className="blog-card">
            {blog.image && (
              <div className="blog-image">
                <img src={blog.image} alt="" />
              </div>
            )}
            <h3>{blog.title}</h3>
            <p>{blog.content}</p>
            <div className="blog-footer">
              <span>{blog.date}</span>
              <button className="delete-blog" type="button" onClick={() => handleDelete(blog.id)} aria-label={`Delete note: ${blog.title}`}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogSection;
