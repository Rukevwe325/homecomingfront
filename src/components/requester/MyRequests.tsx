import { useState, useEffect } from 'react';
import { User } from '../../App';
import { Package, MapPin, Calendar, Weight, AlertCircle, Loader2, ChevronLeft, ChevronRight, CheckCircle, X } from 'lucide-react';
import api from '../../api/axiosInstance';

interface MyRequestsProps {
  user: User;
  onNavigate?: (view: string, params?: any) => void;
  flashMessage?: string;
  onClearFlash?: () => void;
}

export function MyRequests({ user, onNavigate, flashMessage, onClearFlash }: MyRequestsProps) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadRequests();
  }, [user, currentPage]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      // Fetching from your dedicated endpoint
      const response = await api.get(`/item-requests/my?page=${currentPage}&limit=5`);

      // Map response data
      setRequests(response.data.data || []);
      setTotalPages(response.data.lastPage || 1);
    } catch (error) {
      console.error("Error loading requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-teal-600 animate-spin mb-4" />
        <p className="text-gray-500">Loading your requests...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-0">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">My Requests</h1>
        <p className="text-gray-600">View and manage your shipment requests</p>
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

      {requests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-teal-600" />
          </div>
          <h3 className="text-gray-900 mb-2 font-bold">No requests yet</h3>
          <p className="text-gray-600 mb-6">Post your first request to start finding carriers</p>
          <button
            onClick={() => onNavigate?.('post-request')}
            className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-bold"
          >
            <Package className="w-5 h-5" />
            Post Your First Request
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Request Info */}
                <div className="flex-1">
                  {/* Item Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1 font-bold text-lg">{request.itemName}</h3>
                      <div className="flex items-center gap-4 text-gray-600 text-sm">
                        <span className="font-medium">Qty: {request.quantity}</span>
                        <span className="flex items-center gap-1 font-medium">
                          <Weight className="w-4 h-4" />
                          {request.weightKg} kg
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 font-medium">
                      {request.fromCity}, {request.fromState}, {request.fromCountry}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="text-gray-700 font-medium">
                      {request.toCity}, {request.toState}, {request.toCountry}
                    </span>
                  </div>

                  {/* Deadline */}
                  <div className="flex items-center gap-2 text-gray-600 mb-3 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">
                      Deadline: {formatDate(request.desiredDeliveryDate)}
                    </span>
                  </div>

                  {request.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-gray-700 text-sm italic">"{request.notes}"</p>
                    </div>
                  )}
                </div>

                {/* Match Badge */}
                <div className="flex-shrink-0 lg:w-48">
                  {/* Always show card, just change style based on matches */}
                  <div className={`border-2 rounded-xl p-4 text-center ${request.potentialMatches > 0
                    ? 'bg-teal-50 border-teal-200'
                    : 'bg-gray-50 border-gray-200'
                    }`}>
                    <div className={`font-black text-2xl mb-1 ${request.potentialMatches > 0 ? 'text-teal-900' : 'text-gray-400'}`}>
                      {request.potentialMatches}
                    </div>
                    <div className={`font-bold text-sm ${request.potentialMatches > 0 ? 'text-teal-700' : 'text-gray-500'}`}>
                      {request.potentialMatches === 1 ? 'Potential Match' : 'Potential Matches'}
                    </div>

                    <button
                      onClick={() => {
                        onNavigate?.('matches', { itemRequestId: request.id.toString() });
                      }}
                      className={`mt-4 w-full py-2 rounded-lg text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors ${request.potentialMatches > 0
                        ? 'bg-teal-600 text-white hover:bg-teal-700'
                        : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      <AlertCircle className="w-4 h-4" />
                      Check Matches
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Bar */}
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
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold bg-gray-100 px-4 py-1.5 rounded-full">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage(prev => prev + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-2 border rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}