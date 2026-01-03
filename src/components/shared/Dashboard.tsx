import { useState, useEffect, useRef } from 'react';
import { User } from '../../App';
import { Sidebar } from './Sidebar';
import { Home } from '../views/Home';
import { PostTrip } from '../carrier/PostTrip';
import { MyTrips } from '../carrier/MyTrips';
import { PostRequest } from '../requester/PostRequest';
import { MyRequests } from '../requester/MyRequests';
import { MatchesList } from '../matches/MatchesList';
import { Settings } from '../views/Settings';
import { Messages } from '../views/Messages';
import { NotificationsMenu } from './NotificationsMenu';
import { Menu, X, CheckCircle, AlertCircle } from 'lucide-react';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [currentView, setCurrentView] = useState('home');
  const [viewParams, setViewParams] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [flashMessage, setFlashMessage] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const flashMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (flashMessage) {
      flashMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [flashMessage]);

  const handleShowFlash = (message: string, type: 'success' | 'error' = 'success') => {
    setFlashMessage({ message, type });
    // Auto-clear after 5 seconds
    setTimeout(() => setFlashMessage(null), 5000);
  };

  const handleNavigate = (view: string, params?: any) => {
    setCurrentView(view);
    setSidebarOpen(false); // Close sidebar on mobile when navigating
    if (params) {
      setViewParams(params);
    } else {
      setViewParams(null);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home user={user} onNavigate={handleNavigate} />;
      case 'post-trip':
        return <PostTrip user={user} onNavigate={handleNavigate} onShowFlash={handleShowFlash} />;
      case 'my-trips':
        return (
          <MyTrips
            user={user}
            onNavigate={handleNavigate}
          />
        );
      case 'post-request':
        return <PostRequest user={user} onNavigate={handleNavigate} onShowFlash={handleShowFlash} />;
      case 'my-requests':
        return (
          <MyRequests
            user={user}
            onNavigate={handleNavigate}
          />
        );
      case 'matches':
        return (
          <MatchesList
            key={viewParams?.tripId || viewParams?.itemRequestId || 'all'}
            user={user}
            initialFilters={viewParams}
            onNavigate={handleNavigate}
          />
        );
      case 'settings':
        return <Settings user={user} />;
      case 'messages':
        return <Messages user={user} onNavigate={handleNavigate} initialMatchId={viewParams?.matchId} />;
      default:
        return <Home user={user} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">


      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <Sidebar
          user={user}
          currentView={currentView}
          onNavigate={handleNavigate}
          onLogout={onLogout}
          pendingMatchesCount={0}
        />
      </div>

      {/* Sidebar - Mobile */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 z-50 lg:hidden animate-in slide-in-from-left duration-300">
            <Sidebar
              user={user}
              currentView={currentView}
              onNavigate={handleNavigate}
              onLogout={onLogout}
              pendingMatchesCount={0}
            />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
          {/* Mobile Menu Trigger (moved from fixed position) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Spacer for desktop to push notifications to the right */}
          <div className="hidden lg:block flex-1" />

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <NotificationsMenu />
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className={`flex-1 flex flex-col ${currentView === 'messages' ? 'overflow-hidden p-0 md:p-0' : 'overflow-y-auto p-4 md:p-8'}`}>
          {flashMessage && (
            <div
              ref={flashMessageRef}
              className={`mb-6 rounded-lg p-4 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${flashMessage.type === 'error'
                ? 'bg-red-50 border border-red-200'
                : 'bg-green-50 border border-green-200'
                }`}>
              <div className="flex items-center gap-3">
                {flashMessage.type === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                <span className={`font-medium ${flashMessage.type === 'error' ? 'text-red-800' : 'text-green-800'
                  }`}>
                  {flashMessage.message}
                </span>
              </div>
              <button
                onClick={() => setFlashMessage(null)}
                className={`${flashMessage.type === 'error' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                  } transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          {renderView()}
        </div>
      </div>
    </div>
  );
}