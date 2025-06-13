// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BooksPage from './pages/BooksPage.jsx';
import BookDetailPage from './pages/BookDetailPage.jsx';
import AuthorsPage from './pages/AuthorsPage.jsx';
import AuthorDetailPage from './pages/AuthorDetailPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AuthenticatedRoute from './components/AuthenticatedRoute.jsx';
import UnauthenticatedRoute from './components/UnauthenticatedRoute.jsx';
import NavBar from './components/NavBar.jsx';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        {/* Unauthenticated routes */}
        <Route
          path="/login"
          element={
            <UnauthenticatedRoute>
              <LoginPage />
            </UnauthenticatedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <UnauthenticatedRoute>
              <RegisterPage />
            </UnauthenticatedRoute>
          }
        />
        <Route path="/" element={<BooksPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />

        {/* Authenticated routes */}
        <Route
          path="/authors"
          element={
            <AuthenticatedRoute>
              <AuthorsPage />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/authors/:id"
          element={
            <AuthenticatedRoute>
              <AuthorDetailPage />
            </AuthenticatedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;