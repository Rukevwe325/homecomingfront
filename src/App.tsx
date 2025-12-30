import { useState, useEffect } from 'react';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { Dashboard } from './components/shared/Dashboard';
import { NotificationProvider } from './components/shared/NotificationContext';

export type UserRole = 'carrier' | 'requester';

export interface User {
  id: string;
  email: string;
  firstName: string; // Updated to match backend
  lastName: string;  // Updated to match backend
  role: string;
}

type ViewMode = 'login' | 'register' | 'dashboard';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if a real session exists in localStorage
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
        setViewMode('dashboard');
      } catch (e) {
        handleLogout();
      }
    }
  }, []);

  const handleLoginSuccess = (userData: User) => {
    setCurrentUser(userData);
    setViewMode('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setViewMode('login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {viewMode === 'login' && (
        <LoginPage
          onLogin={handleLoginSuccess}
          onSwitchToRegister={() => setViewMode('register')}
        />
      )}
      {viewMode === 'register' && (
        <RegisterPage
          onSwitchToLogin={() => setViewMode('login')}
        />
      )}
      {viewMode === 'dashboard' && currentUser && (
        <NotificationProvider userId={currentUser.id}>
          <Dashboard user={currentUser} onLogout={handleLogout} />
        </NotificationProvider>
      )}
    </div>
  );
}

export default App;