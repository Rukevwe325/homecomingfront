import { useState, useEffect } from 'react';
import { User } from '../../App';
import { Plane, Package, Heart, TrendingUp, ArrowRight, Loader2 } from 'lucide-react';
import api from '../../api/axiosInstance';

interface HomeProps {
  user: User;
  onNavigate?: (view: string) => void;
}

export function Home({ user, onNavigate }: HomeProps) {
  const [counts, setCounts] = useState({
    trips: 0,
    requests: 0,
    pendingMatches: 0,
    confirmedMatches: 0, // Keeping this for UI consistency
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Fetch all counts from your new endpoints in parallel
        const [tripsRes, requestsRes, matchesRes] = await Promise.all([
          api.get('/trips/count'),
          api.get('/item-requests/count'),
          api.get('/matches/count/pending')
        ]);

        setCounts({
          trips: tripsRes.data.count || 0,
          requests: requestsRes.data.count || 0,
          pendingMatches: matchesRes.data.count || 0,
          confirmedMatches: 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const statCards = [
    { title: 'My Trips', value: counts.trips, icon: Plane, color: 'blue' as const, route: 'my-trips' },
    { title: 'My Requests', value: counts.requests, icon: Package, color: 'blue' as const, route: 'my-requests' },
    { title: 'Pending Matches', value: counts.pendingMatches, icon: Heart, color: 'teal' as const, route: 'matches' },
    { title: 'Confirmed', value: counts.confirmedMatches, icon: TrendingUp, color: 'green' as const, route: 'matches' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Welcome back, {user.firstName} {user.lastName}!</h1>
        <p className="text-gray-600">
          Post trips or requests, manage your matches, and connect with the Dconnect community.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const colorClasses = {
            blue: 'bg-blue-50 text-blue-600 border-blue-100',
            teal: 'bg-teal-50 text-teal-600 border-teal-100',
            green: 'bg-green-50 text-green-600 border-green-100',
          }[card.color];

          return (
            <div
              key={index}
              onClick={() => onNavigate?.(card.route)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer hover:border-blue-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${colorClasses}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="text-gray-900 text-2xl font-bold mb-1">{card.value}</div>
              <div className="text-gray-600">{card.title}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate?.('post-trip')}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <Plane className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-gray-900 flex-1">Post Trip</h3>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <p className="text-gray-600">Share your travel plans</p>
          </button>
          <button
            onClick={() => onNavigate?.('post-request')}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <Package className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-gray-900 flex-1">Post Request</h3>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <p className="text-gray-600">Request a shipment</p>
          </button>
          <button
            onClick={() => onNavigate?.('my-trips')}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-all text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                <Plane className="w-5 h-5 text-teal-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-gray-900 flex-1">My Trips</h3>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors" />
            </div>
            <p className="text-gray-600">View your trips</p>
          </button>
          <button
            onClick={() => onNavigate?.('my-requests')}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-all text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                <Package className="w-5 h-5 text-teal-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-gray-900 flex-1">My Requests</h3>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors" />
            </div>
            <p className="text-gray-600">View your requests</p>
          </button>
        </div>
      </div>


    </div>
  );
}