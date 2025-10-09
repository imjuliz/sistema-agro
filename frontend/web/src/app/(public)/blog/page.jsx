import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { BlogManagement } from './components/admin/BlogManagement';
import { UserManagement } from './components/admin/UserManagement';
import { CreateBlog } from './components/admin/CreateBlog';
import { PublicBlogView } from './components/public/PublicBlogView';

// type AdminPage = 'dashboard' | 'blogs' | 'users' | 'create-blog';

export default function Blog() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [currentAdminPage, setCurrentAdminPage] = useState<AdminPage>('dashboard');
  const [showAuth, setShowAuth] = useState(false);

  // Show authentication if user clicks sign in or is not authenticated and trying to access admin
  if (!isAuthenticated && (showAuth || isAdmin)) {
    return <AuthPage />;
  }

  // Admin interface
  if (isAuthenticated && isAdmin) {
    const renderAdminContent = () => {
      switch (currentAdminPage) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'blogs':
          return <BlogManagement onCreateNew={() => setCurrentAdminPage('create-blog')} />;
        case 'users':
          return <UserManagement />;
        case 'create-blog':
          return <CreateBlog />;
        default:
          return <AdminDashboard />;
      }
    };

    return (
      <AdminLayout 
        currentPage={currentAdminPage} 
        onPageChange={setCurrentAdminPage}
      >
        {renderAdminContent()}
      </AdminLayout>
    );
  }

  // Public blog interface for regular users and non-authenticated visitors
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Technical Blog</h1>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Welcome back!</span>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setShowAuth(true)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <PublicBlogView onShowAuth={() => setShowAuth(true)} />
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <div className="size-full">
        <AppContent />
      </div>
    </AuthProvider>
  );
}