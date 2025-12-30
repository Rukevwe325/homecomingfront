import { useState, useEffect } from 'react';
import { User } from '../../App';
import { Heart, Plane, Package, MapPin, Calendar, Weight, X, Loader2, ChevronLeft, ChevronRight, Check, Trash2, Filter } from 'lucide-react';
import { MatchDetailView } from './MatchDetailView';
import api from '../../api/axiosInstance';

interface MatchesListProps {
  user: User;
}

export function MatchesList({ user }: MatchesListProps) {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  // Filter Dropdown State
  const [filterType, setFilterType] = useState<'all' | 'trip' | 'request'>('all');
  const [selectedFilterId, setSelectedFilterId] = useState<string>('');
  const [userTrips, setUserTrips] = useState<any[]>([]);
  const [userRequests, setUserRequests] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Initial Load & URL Params Check
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tripId = params.get('tripId');
    const itemRequestId = params.get('itemRequestId');

    fetchUserOptions();

    if (tripId) {
      setFilterType('trip');
      setSelectedFilterId(tripId);
    } else if (itemRequestId) {
      setFilterType('request');
      setSelectedFilterId(itemRequestId);
    }
  }, []);

  useEffect(() => {
    loadMatches();
  }, [user, currentPage, filter, filterType, selectedFilterId]);

  const fetchUserOptions = async () => {
    try {
      const tripsRes = await api.get('/trips/my-trips?limit=100'); // Fetch enough for dropdown
      const requestsRes = await api.get('/item-requests/my?limit=100');
      setUserTrips(tripsRes.data.data || []);
      setUserRequests(requestsRes.data.data || []);
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  const loadMatches = async () => {
    try {
      setLoading(true);
      const statusParam = filter !== 'all' ? `&status=${filter}` : '';

      let extraParams = '';
      if (filterType === 'trip' && selectedFilterId) {
        extraParams += `&tripId=${selectedFilterId}`;
      } else if (filterType === 'request' && selectedFilterId) {
        extraParams += `&itemRequestId=${selectedFilterId}`;
      }

      const response = await api.get(`/matches?page=${currentPage}&limit=10${statusParam}${extraParams}`);
      const allFetchedMatches = response.data.data || [];
      setMatches(allFetchedMatches);
      setTotalPages(response.data.lastPage || 1);
    } catch (error) {
      console.error("Error loading matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (matchId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      setUpdatingId(matchId);
      await api.patch(`/matches/${matchId}/status`, {
        status: newStatus
      });

      await loadMatches();
      setSelectedMatch(null);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  /**
   * REVISED: Only show actions if someone has already started the handshake.
   * If status is 'pending', buttons stay hidden.
   */
  const shouldShowActions = (match: any) => {
    const status = match.status.toLowerCase();

    // 1. Hide if purely pending, accepted, or rejected
    if (['pending', 'accepted', 'rejected'].includes(status)) return false;

    // 2. Hide if user has already accepted their part
    if (user.role === 'carrier' && status === 'carrier_accepted') return false;
    if (user.role === 'requester' && status === 'requester_accepted') return false;

    // 3. Otherwise, show buttons (means the other party accepted and is waiting for you)
    return true;
  };

  // No client-side filtering needed - backend handles it
  const filteredMatches = matches;

  if (loading && matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500">Loading matches...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-0">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Matches</h1>
          <p className="text-gray-600">Review and confirm your shipping handshakes.</p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex gap-2">
          <select
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value as any);
              setSelectedFilterId('');
              setCurrentPage(1);
            }}
          >
            <option value="all">All Matches</option>
            <option value="trip">By Trip</option>
            <option value="request">By Request</option>
          </select>

          {filterType === 'trip' && (
            <select
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 max-w-xs"
              value={selectedFilterId}
              onChange={(e) => {
                setSelectedFilterId(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Select a Trip...</option>
              {userTrips.map(trip => (
                <option key={trip.id} value={trip.id}>
                  {trip.fromCity} → {trip.toCity} ({formatDate(trip.departureDate)})
                </option>
              ))}
            </select>
          )}

          {filterType === 'request' && (
            <select
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 max-w-xs"
              value={selectedFilterId}
              onChange={(e) => {
                setSelectedFilterId(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Select a Request...</option>
              {userRequests.map(req => (
                <option key={req.id} value={req.id}>
                  {req.itemName} ({req.fromCity} → {req.toCity})
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6 flex gap-2 overflow-x-auto">
        {['all', 'pending', 'accepted', 'rejected'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setFilter(tab as any);
              setCurrentPage(1); // Reset to page 1 when changing filter
            }}
            className={`px-4 py-2 rounded-lg transition-all font-medium capitalize ${filter === tab ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredMatches.map((match) => (
          <div key={match.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 border-r border-gray-50 pr-4">
                <div className="space-y-1">
                  <div className="text-blue-600 text-[10px] font-bold uppercase tracking-wider">Trip</div>
                  <div className="font-bold text-gray-900">{match.trip?.fromCity} → {match.trip?.toCity}</div>
                  <div className="text-xs text-gray-500">{formatDate(match.trip?.departureDate)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-teal-600 text-[10px] font-bold uppercase tracking-wider">Item</div>
                  <div className="font-bold text-gray-900">{match.itemRequest?.itemName}</div>
                  <div className="text-xs text-gray-500">{match.itemRequest?.weightKg} kg</div>
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:w-56 justify-center">
                <div className={`px-3 py-1 text-center text-[10px] font-black uppercase tracking-widest border rounded-md ${match.status.includes('accepted') ? 'bg-green-50 text-green-700 border-green-200' :
                  match.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                  }`}>
                  {match.status.replace('_', ' ')}
                </div>

                <div className="flex gap-2">
                  {shouldShowActions(match) && (
                    <>
                      <button
                        disabled={updatingId === match.id.toString()}
                        onClick={() => handleStatusUpdate(match.id.toString(), 'rejected')}
                        className="flex-1 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-all flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        disabled={updatingId === match.id.toString()}
                        onClick={() => handleStatusUpdate(match.id.toString(), 'accepted')}
                        className="flex-[2] py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                      >
                        {updatingId === match.id.toString() ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        <span>Accept</span>
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={() => setSelectedMatch(match)}
                  className="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors text-center w-full"
                >
                  View Full Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10 mb-10">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 border rounded-lg disabled:opacity-30">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-gray-700">Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 border rounded-lg disabled:opacity-30">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {selectedMatch && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setSelectedMatch(null)}
              className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white transition-colors border border-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="overflow-y-auto max-h-[90vh]">
              <MatchDetailView match={selectedMatch} />

              {shouldShowActions(selectedMatch) && (
                <div className="p-6 pt-0 flex gap-4 bg-white">
                  <button
                    onClick={() => handleStatusUpdate(selectedMatch.id.toString(), 'rejected')}
                    className="flex-1 py-3 border-2 border-red-100 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-all"
                  >
                    Decline Match
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedMatch.id.toString(), 'accepted')}
                    className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                  >
                    Confirm & Accept
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}