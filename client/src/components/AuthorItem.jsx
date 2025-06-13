// src/components/AuthorItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function AuthorItem({ author }) {
  return (
    <div className="author-item" style={{ border: '1px solid #ccc', padding: '1rem', margin: '0.5rem 0' }}>
      <Link to={`/authors/${author.author_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <h3>{author.name}</h3>
      </Link>
    </div>
  );
}

export default AuthorItem;