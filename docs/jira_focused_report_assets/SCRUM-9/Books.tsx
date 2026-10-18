import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import type { Book } from '../services/storage';

export const Books: React.FC = () => {
  const { books, addBook, updateBook, deleteBook } = useLibrary();
  const { userRole } = useAuth();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [filterAvailability, setFilterAvailability] = useState('All');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Form fields state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [genre, setGenre] = useState('');
  const [publisher, setPublisher] = useState('');
  const [publicationYear, setPublicationYear] = useState<number>(new Date().getFullYear());
  const [totalCopies, setTotalCopies] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const genres = ['All', ...Array.from(new Set(books.map((b) => b.genre)))];

  const handleOpenAddModal = () => {
    setEditingBook(null);
    setTitle('');
    setAuthor('');
    setIsbn('');
    setGenre('');
    setPublisher('');
    setPublicationYear(new Date().getFullYear());
    setTotalCopies(1);
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (book: Book) => {
    setEditingBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setIsbn(book.isbn);
    setGenre(book.genre);
    setPublisher(book.publisher || '');
    setPublicationYear(book.publicationYear);
    setTotalCopies(book.totalCopies);
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !isbn || !genre) {
      setError('Please fill in all required fields.');
      return;
    }

    // ISBN validation (prevent duplicate)
    const duplicateIsbn = books.some(
      (b) => b.isbn.trim() === isbn.trim() && (!editingBook || b.id !== editingBook.id)
    );
    if (duplicateIsbn) {
      setError('A book with this ISBN already exists in the catalog.');
      return;
    }

    if (totalCopies < 1) {
      setError('Total copies must be at least 1.');
      return;
    }

    if (publicationYear > new Date().getFullYear()) {
      setError('Publication year cannot be in the future.');
      return;
    }

    setError(null);

    if (editingBook) {
      updateBook({
        ...editingBook,
        title,
        author,
        isbn,
        genre,
        publisher,
        publicationYear,
        totalCopies,
      });
    } else {
      addBook({
        title,
        author,
        isbn,
        genre,
        publisher,
        publicationYear,
        totalCopies,
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      const res = deleteBook(id);
      if (!res.success) {
        alert(`Deletion Denied: ${res.error}`);
      }
    }
  };

  // Filtered books
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.isbn.includes(search);

    const matchesGenre = selectedGenre === 'All' || book.genre === selectedGenre;

    const matchesAvailability =
      filterAvailability === 'All' ||
      (filterAvailability === 'Available' && book.availableCopies > 0) ||
      (filterAvailability === 'Unavailable' && book.availableCopies === 0);

    return matchesSearch && matchesGenre && matchesAvailability;
  });

  const canManage = userRole === 'Admin' || userRole === 'Librarian';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Search & Actions Bar */}
      <div className="glass-panel search-bar-container">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="form-input"
            placeholder="Search by Title, Author, or ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ margin: 0, minWidth: '150px' }}>
          <select
            className="form-input form-select"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ margin: 0, minWidth: '150px' }}>
          <select
            className="form-input form-select"
            value={filterAvailability}
            onChange={(e) => setFilterAvailability(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Unavailable">Out of Stock</option>
          </select>
        </div>

        {canManage && (
          <button onClick={handleOpenAddModal} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            ➕ Add Book
          </button>
        )}
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          📚 No books found matching the search criteria.
        </div>
      ) : (
        <div className="catalog-grid">
          {filteredBooks.map((book) => {
            const isAvailable = book.availableCopies > 0;
            return (
              <div key={book.id} className="glass-panel book-card">
                <div className="book-info">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span className="badge badge-active" style={{ background: isAvailable ? 'var(--success-glow)' : 'var(--danger-glow)', color: isAvailable ? 'var(--success)' : 'var(--danger)', border: `1px solid ${isAvailable ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                      {isAvailable ? 'Available' : 'Out of Stock'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}>
                      {book.genre}
                    </span>
                  </div>
                  <h3 className="book-title" title={book.title} style={{ marginTop: '0.5rem' }}>
                    {book.title}
                  </h3>
                  <span className="book-author">By {book.author}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>ISBN: {book.isbn}</span>
                    <span>Publisher: {book.publisher || 'N/A'} ({book.publicationYear})</span>
                  </div>
                </div>

                <div className="book-meta">
                  <div>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {book.availableCopies}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}> / {book.totalCopies} copies</span>
                  </div>

                  {canManage && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleOpenEditModal(book)}
                        className="btn btn-secondary btn-icon-only"
                        title="Edit Book"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="btn btn-danger btn-icon-only"
                        title="Delete Book"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
              {editingBook ? 'Edit Book Details' : 'Add New Book'}
            </h2>

            {error && (
              <div
                style={{
                  background: 'var(--danger-glow)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: 'var(--danger)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  fontSize: '0.85rem',
                }}
              >
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ textAlign: 'left', margin: 0 }}>
                <label className="form-label">Book Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Clean Code"
                  required
                />
              </div>

              <div className="form-group" style={{ textAlign: 'left', margin: 0 }}>
                <label className="form-label">Author Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Robert C. Martin"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ textAlign: 'left', margin: 0 }}>
                  <label className="form-label">ISBN Number *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    placeholder="e.g. 9780132350884"
                    required
                  />
                </div>

                <div className="form-group" style={{ textAlign: 'left', margin: 0 }}>
                  <label className="form-label">Genre / Category *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="e.g. Technology"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ textAlign: 'left', margin: 0 }}>
                  <label className="form-label">Publisher</label>
                  <input
                    type="text"
                    className="form-input"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    placeholder="e.g. Prentice Hall"
                  />
                </div>

                <div className="form-group" style={{ textAlign: 'left', margin: 0 }}>
                  <label className="form-label">Pub Year</label>
                  <input
                    type="number"
                    className="form-input"
                    value={publicationYear}
                    onChange={(e) => setPublicationYear(parseInt(e.target.value) || new Date().getFullYear())}
                    min="1000"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>

              <div className="form-group" style={{ textAlign: 'left', margin: 0 }}>
                <label className="form-label">Total Copies Owned *</label>
                <input
                  type="number"
                  className="form-input"
                  value={totalCopies}
                  onChange={(e) => setTotalCopies(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editingBook ? 'Save Changes' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
