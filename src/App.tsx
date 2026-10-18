import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LibraryProvider } from './context/LibraryContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Books } from './pages/Books';
import { Members } from './pages/Members';
import { Issues } from './pages/Issues';
import { MyLoans } from './pages/MyLoans';
import { Settings } from './pages/Settings';
import './App.css';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, userRole } = useAuth();
  const [currentPage, setCurrentPage] = useState('books');

  // Set default page on login
  useEffect(() => {
    if (isAuthenticated) {
      if (userRole === 'Admin' || userRole === 'Librarian') {
        setCurrentPage('dashboard');
      } else if (userRole === 'Student') {
        setCurrentPage('books');
      }
    }
  }, [isAuthenticated, userRole]);

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'books':
        return <Books />;
      case 'members':
        return <Members />;
      case 'issues':
        return <Issues />;
      case 'my-loans':
        return <MyLoans />;
      case 'settings':
        return <Settings />;
      default:
        return <Books />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main-content">
        <Navbar currentPage={currentPage} />
        {renderPage()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <LibraryProvider>
        <MainAppContent />
      </LibraryProvider>
    </AuthProvider>
  );
}

export default App;
