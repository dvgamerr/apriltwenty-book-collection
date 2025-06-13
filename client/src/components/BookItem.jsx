// src/components/BookItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function BookItem({ book }) {
  return (
    <div
      className="book-item"
      style={{ border: '1px solid #ccc', padding: '1rem', margin: '0.5rem 0' }}
    >
      <Link to={`/books/${book.book_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <h3>{book.title}</h3>
        <p>{book.description}</p>
      </Link>
    </div>
  );
}

export default BookItem;