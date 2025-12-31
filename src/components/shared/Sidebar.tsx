import { Home, PlaneTakeoff, Package, Heart, Settings, LogOut, Plane, PackageCheck } from 'lucide-react';
import { User } from '../../App';

interface SidebarProps {
  user: User;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  pendingMatchesCount: number;
}

export function Sidebar({ user, currentView, onNavigate, onLogout, pendingMatchesCount }: SidebarProps) {
  // Defensive check: if firstName is missing, use email or "User"
  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`
    : user?.email || 'User';

  const avatarInitial = (user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase();

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'post-trip', icon: PlaneTakeoff, label: 'Post Trip' },
    { id: 'my-trips', icon: Plane, label: 'My Trips' },
    { id: 'post-request', icon: Package, label: 'Post Request' },
    { id: 'my-requests', icon: PackageCheck, label: 'My Requests' },
    { id: 'matches', icon: Heart, label: 'Matches', badge: pendingMatchesCount },
    { id: 'settings', icon: Settings as any, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-gray-900 font-bold">Dconnect</div>
            <div className="text-gray-600 text-xs capitalize">{user?.role || 'Member'}</div>
          </div>
        </div>
      </div>

      {/* User Info Section - FIXED CRASH HERE */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold">{avatarInitial}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-gray-900 text-sm font-medium truncate">{displayName}</div>
            <div className="text-gray-500 text-xs truncate">{user?.email}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {!!item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}