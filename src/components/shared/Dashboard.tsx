import { useState } from 'react';
import { User } from '../../App';
import { Sidebar } from './Sidebar';
import { Home } from '../views/Home';
import { PostTrip } from '../carrier/PostTrip';
import { MyTrips } from '../carrier/MyTrips';
import { PostRequest } from '../requester/PostRequest';
import { MyRequests } from '../requester/MyRequests';
import { MatchesList } from '../matches/MatchesList';
import { Settings } from '../views/Settings';
import { NotificationsMenu } from './NotificationsMenu';
import { Menu, X } from 'lucide-react';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [currentView, setCurrentView] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home user={user} onNavigate={setCurrentView} />;
      case 'post-trip':
        return <PostTrip user={user} />;
      case 'my-trips':
        return <MyTrips user={user} onNavigate={setCurrentView} />;
      case 'post-request':
        return <PostRequest user={user} />;
      case 'my-requests':
        return <MyRequests user={user} onNavigate={setCurrentView} />;
      case 'matches':
        return <MatchesList user={user} />;
      case 'settings':
        return <Settings user={user} />;
      default:
        return <Home user={user} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">


      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <Sidebar
          user={user}
          currentView={currentView}
          onNavigate={setCurrentView}
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
              onNavigate={(view) => {
                setCurrentView(view);
                setSidebarOpen(false);
              }}
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
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderView()}
        </div>
      </div>
    </div>
  );
}