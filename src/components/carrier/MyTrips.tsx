import { useState, useEffect } from 'react';
import { User } from '../../App';
import { Plane, MapPin, Calendar, Weight, Loader2, ChevronLeft, ChevronRight, CheckCircle, X } from 'lucide-react';
import api from '../../api/axiosInstance';

interface MyTripsProps {
  user: User;
  onNavigate?: (view: string, params?: any) => void;
  flashMessage?: string;
  onClearFlash?: () => void;
}

interface TripData {
  id: number;
  fromCountry: string;
  fromState: string;
  fromCity: string;
  toCountry: string;
  toState: string;
  toCity: string;
  departureDate: string;
  returnDate: string | null;
  availableLuggageSpace: string;
  notes: string;
  status: string;
  matches: number;
}

export function MyTrips({ user, onNavigate, flashMessage, onClearFlash }: MyTripsProps) {
  const [trips, setTrips] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTrips();
  }, [user, currentPage]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      // Using your specific endpoint with query params
      const response = await api.get(`/trips/my-trips?page=${currentPage}&limit=5`);

      setTrips(response.data.data || []);
      setTotalPages(response.data.lastPage || 1);
    } catch (err) {
      console.error("Error fetching trips:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading && trips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500">Loading your trips...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Trips</h1>
        <p className="text-gray-600">View and manage your posted trips</p>
      </div>

      {flashMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">{flashMessage}</span>
          </div>
          <button
            onClick={onClearFlash}
            className="text-green-600 hover:text-green-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {trips.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Plane className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips yet</h3>
          <p className="text-gray-600 mb-6">Post your first trip to start connecting with requesters</p>
          <button
            onClick={() => onNavigate?.('post-trip')}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plane className="w-5 h-5" />
            Post Your First Trip
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Trip Info */}
                  <div className="flex-1">
                    {/* Route */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="text-lg font-bold text-gray-900">
                            {trip.fromCity}, {trip.fromCountry}
                          </div>
                          <Plane className="w-4 h-4 text-gray-400 rotate-90" />
                          <div className="text-lg font-bold text-gray-900">
                            {trip.toCity}, {trip.toCountry}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Route: {trip.fromState} to {trip.toState}
                        </p>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Departure</p>
                          <p className="font-medium">{formatDate(trip.departureDate)}</p>
                        </div>
                      </div>
                      {trip.returnDate && (
                        <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                          <Calendar className="w-5 h-5 text-teal-500" />
                          <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Return</p>
                            <p className="font-medium">{formatDate(trip.returnDate)}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                        <Weight className="w-5 h-5 text-orange-500" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Space</p>
                          <p className="font-medium">{parseFloat(trip.availableLuggageSpace).toFixed(1)} kg</p>
                        </div>
                      </div>
                    </div>

                    {trip.notes && (
                      <div className="mt-6">
                        <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                          <p className="text-sm text-blue-800 italic">"{trip.notes}"</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Match Badge */}
                  <div className="lg:w-48">
                    {/* Always show card, just change style based on matches */}
                    <div className={`border rounded-xl p-5 text-center shadow-sm ${trip.matches > 0
                      ? 'bg-gradient-to-br from-green-50 to-teal-50 border-teal-200'
                      : 'bg-gray-50 border-gray-200'
                      }`}>
                      <div className={`text-3xl font-bold mb-1 ${trip.matches > 0 ? 'text-teal-600' : 'text-gray-400'}`}>
                        {trip.matches}
                      </div>
                      <div className={`text-sm font-semibold uppercase tracking-wider ${trip.matches > 0 ? 'text-teal-800' : 'text-gray-400'}`}>
                        {trip.matches === 1 ? 'Match Found' : 'Matches Found'}
                      </div>

                      <button
                        className={`mt-4 w-full py-2 rounded-lg text-sm font-bold transition-colors ${trip.matches > 0
                          ? 'bg-teal-600 text-white hover:bg-teal-700'
                          : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                        onClick={() => {
                          onNavigate?.('matches', { tripId: trip.id.toString() });
                        }}
                      >
                        View Matches
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-10 mb-10">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage(prev => prev - 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-2 border rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
                  {currentPage}
                </span>
                <span className="text-sm text-gray-400">of</span>
                <span className="text-sm font-bold text-gray-700">
                  {totalPages}
                </span>
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage(prev => prev + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-2 border rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}