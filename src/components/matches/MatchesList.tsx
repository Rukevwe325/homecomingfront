import { useState, useEffect } from 'react';
import { User } from '../../App';
import { Heart, Plane, Package, MapPin, Calendar, Weight, X, Loader2, ChevronLeft, ChevronRight, Check, Trash2, Filter } from 'lucide-react';
import { MatchDetailView } from './MatchDetailView';
import api from '../../api/axiosInstance';

interface MatchesListProps {
  user: User;
  initialFilters?: {
    tripId?: string;
    itemRequestId?: string;
  };
}

export function MatchesList({ user, initialFilters }: MatchesListProps) {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  // Consolidate filter state to avoid race conditions
  const [filterState, setFilterState] = useState<{
    type: 'all' | 'trip' | 'request';
    id: string;
  }>(() => {
    if (initialFilters?.tripId) return { type: 'trip', id: initialFilters.tripId };
    if (initialFilters?.itemRequestId) return { type: 'request', id: initialFilters.itemRequestId };
    return { type: 'all', id: '' };
  });

  const [userTrips, setUserTrips] = useState<any[]>([]);
  const [userRequests, setUserRequests] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Initial Load & URL Params Check
  useEffect(() => {
    fetchUserOptions();

    // Priority: initialFilters prop > URL params > default
    if (initialFilters?.tripId) {
      setFilterState({ type: 'trip', id: initialFilters.tripId });
    } else if (initialFilters?.itemRequestId) {
      setFilterState({ type: 'request', id: initialFilters.itemRequestId });
    } else if (initialFilters === null) {
      // RESET: If navigating from sidebar, clear the filters
      setFilterState({ type: 'all', id: '' });
    } else {
      const params = new URLSearchParams(window.location.search);
      const tripId = params.get('tripId');
      const itemRequestId = params.get('itemRequestId');

      if (tripId) {
        setFilterState({ type: 'trip', id: tripId });
      } else if (itemRequestId) {
        setFilterState({ type: 'request', id: itemRequestId });
      }
    }
  }, [initialFilters]); // Re-run if initialFilters changes

  useEffect(() => {
    loadMatches();
  }, [user, currentPage, filter, filterState]);

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
      if (filterState.type === 'trip' && filterState.id) {
        extraParams += `&tripId=${filterState.id}&trip_id=${filterState.id}`; // Support both camel and snake
      } else if (filterState.type === 'request' && filterState.id) {
        extraParams += `&itemRequestId=${filterState.id}&item_request_id=${filterState.id}`;
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

  const formatDate = (dateString: any) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      });
    } catch {
      return 'N/A';
    }
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
            value={filterState.type}
            onChange={(e) => {
              setFilterState({ type: e.target.value as any, id: '' });
              setCurrentPage(1);
            }}
          >
            <option value="all">All Matches</option>
            <option value="trip">By Trip</option>
            <option value="request">By Request</option>
          </select>

          {filterState.type === 'trip' && (
            <select
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 max-w-xs"
              value={filterState.id}
              onChange={(e) => {
                setFilterState(prev => ({ ...prev, id: e.target.value }));
                setCurrentPage(1);
              }}
            >
              <option value="">Select a Trip...</option>
              {userTrips.map(trip => (
                <option key={trip.id} value={trip.id}>
                  {trip.fromCity} → {trip.toCity} ({formatDate(trip.departureDate || trip.departure_date)})
                </option>
              ))}
            </select>
          )}

          {filterState.type === 'request' && (
            <select
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 max-w-xs"
              value={filterState.id}
              onChange={(e) => {
                setFilterState(prev => ({ ...prev, id: e.target.value }));
                setCurrentPage(1);
              }}
            >
              <option value="">Select a Request...</option>
              {userRequests.map(req => (
                <option key={req.id} value={req.id}>
                  {req.itemName} ({req.fromCity} → {req.toCity} - {formatDate(req.desiredDeliveryDate || req.deliveryDate || req.desired_delivery_date)})
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

      {filteredMatches.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No matches found</h3>
          <p className="text-gray-600 mb-6">
            {filter !== 'all'
              ? `No matches with status "${filter}". Try changing the filter.`
              : 'You do not have any matches yet. Matches appear when trips and requests align.'}
          </p>
          <button
            onClick={() => {
              setFilter('all');
              setFilterState({ type: 'all', id: '' });
              // Optionally reload or navigate
            }}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Clear Filters
          </button>
        </div>
      ) : (
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
                    <div className="text-xs text-gray-500">
                      {parseFloat(match.agreedWeightKg || match.itemRequest?.weightKg || match.item_request?.weightKg || match.weightKg || '0').toFixed(1)} kg • Needs: {formatDate(
                        match.itemRequest?.desiredDeliveryDate ||
                        match.itemRequest?.deliveryDate ||
                        match.itemRequest?.desired_delivery_date ||
                        match.itemRequest?.delivery_date ||
                        match.item_request?.desiredDeliveryDate ||
                        match.item_request?.deliveryDate ||
                        match.item_request?.desired_delivery_date ||
                        match.item_request?.delivery_date ||
                        match.desiredDeliveryDate ||
                        match.deliveryDate ||
                        match.desired_delivery_date ||
                        match.delivery_date
                      )}
                    </div>
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
      )}

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
              <MatchDetailView
                match={selectedMatch}
                user={user}
                onStatusUpdate={() => {
                  loadMatches();
                  setSelectedMatch(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}