import { Trip, Request, Match, UserRole } from '../../App';
import { Plane, Package, MapPin, Calendar, Weight, FileText, Check, X } from 'lucide-react';

interface MatchDetailProps {
  match: Match & { trip: Trip; request: Request };
  userRole: UserRole;
  onStatusUpdate: (matchId: string, status: 'accepted' | 'rejected') => void;
}

export function MatchDetail({ match, userRole, onStatusUpdate }: MatchDetailProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Trip Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
            <Plane className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Trip Information</h3>
            <p className="text-sm text-gray-600">
              {userRole === 'carrier' ? 'Your trip details' : 'Carrier trip details'}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Origin */}
            <div>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1 uppercase tracking-wider font-semibold">
                <MapPin className="w-4 h-4" />
                <span>Origin</span>
              </div>
              <p className="text-gray-900 font-medium">
                {match.trip.originCity}, {match.trip.originState}, {match.trip.originCountry}
              </p>
            </div>
            {/* Destination */}
            <div>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1 uppercase tracking-wider font-semibold">
                <MapPin className="w-4 h-4" />
                <span>Destination</span>
              </div>
              <p className="text-gray-900 font-medium">
                {match.trip.destCity}, {match.trip.destState}, {match.trip.destCountry}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-gray-200">
            <div>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1 font-semibold">
                <Calendar className="w-4 h-4" />
                <span>Departure</span>
              </div>
              <p className="text-gray-900">{formatDate(match.trip.departureDate)}</p>
            </div>

            {match.trip.returnDate && (
              <div>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1 font-semibold">
                  <Calendar className="w-4 h-4" />
                  <span>Return</span>
                </div>
                <p className="text-gray-900">{formatDate(match.trip.returnDate)}</p>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1 font-semibold">
                <Weight className="w-4 h-4" />
                <span>Available Space</span>
              </div>
              <p className="text-gray-900 font-bold">{match.trip.availableSpace} kg</p>
            </div>
          </div>

          {match.trip.notes && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-2 font-semibold">
                <FileText className="w-4 h-4" />
                <span>Carrier Notes</span>
              </div>
              <div className="text-gray-700 bg-white border border-gray-100 rounded-lg p-3 text-sm leading-relaxed">
                {match.trip.notes}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Request Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
            <Package className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Request Information</h3>
            <p className="text-sm text-gray-600">
              {userRole === 'requester' ? 'Your request details' : 'Requester item details'}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="text-gray-500 text-sm mb-1 font-semibold">Item Name</div>
              <div className="text-gray-900 font-bold text-lg">{match.request.itemName}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1 font-semibold uppercase">Quantity</div>
              <div className="text-gray-900 font-medium">{match.request.quantity}x</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1 font-semibold uppercase">
                <Weight className="w-4 h-4" />
                <span>Weight</span>
              </div>
              <div className="text-gray-900 font-bold">{match.request.weight} kg</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
            <div>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1 uppercase font-semibold">
                <MapPin className="w-4 h-4" />
                <span>Item Origin</span>
              </div>
              <p className="text-gray-800 text-sm">
                {match.request.originCity}, {match.request.originState}, {match.request.originCountry}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1 uppercase font-semibold">
                <MapPin className="w-4 h-4" />
                <span>Item Destination</span>
              </div>
              <p className="text-gray-800 text-sm">
                {match.request.destCity}, {match.request.destState}, {match.request.destCountry}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1 font-semibold">
              <Calendar className="w-4 h-4" />
              <span>Delivery Deadline</span>
            </div>
            <p className="text-gray-900">{formatDate(match.request.deadline)}</p>
          </div>

          {match.request.notes && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-2 font-semibold">
                <FileText className="w-4 h-4" />
                <span>Request Notes</span>
              </div>
              <div className="text-gray-700 bg-white border border-gray-100 rounded-lg p-3 text-sm leading-relaxed">
                {match.request.notes}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-10">
        {match.status === 'pending' && (
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onStatusUpdate(match.id, 'accepted')}
              className="flex-1 bg-green-600 text-white py-4 px-6 rounded-xl font-bold hover:bg-green-700 active:scale-95 transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Accept Match
            </button>
            <button
              onClick={() => onStatusUpdate(match.id, 'rejected')}
              className="flex-1 bg-white text-gray-600 border-2 border-gray-200 py-4 px-6 rounded-xl font-bold hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Reject Match
            </button>
          </div>
        )}

        {match.status === 'accepted' && (
          <div className="bg-green-50 border-2 border-green-100 rounded-2xl p-6 text-center">
            <div className="flex flex-col items-center gap-2 text-green-700 font-bold">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <Check className="w-6 h-6" />
              </div>
              <span className="text-lg">Match Accepted</span>
              <p className="text-sm text-green-600 font-normal">You can now proceed with the shipping details.</p>
            </div>
          </div>
        )}

        {match.status === 'rejected' && (
          <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-6 text-center">
            <div className="flex flex-col items-center gap-2 text-red-700 font-bold">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-2">
                <X className="w-6 h-6" />
              </div>
              <span className="text-lg">Match Rejected</span>
              <p className="text-sm text-red-600 font-normal">This request has been removed from active consideration.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}