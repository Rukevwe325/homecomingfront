import React, { useState } from 'react';
import {
  Package,
  Plane,
  Calendar,
  Weight,
  Clock,
  ShieldCheck,
  ArrowRight,
  UserCircle2,
  Check,
  X,
  Loader2
} from 'lucide-react';
import api from '../../api/axiosInstance';

interface MatchDetailViewProps {
  match: any;
}

export function MatchDetailView({ match }: MatchDetailViewProps) {
  const [updating, setUpdating] = useState(false);
  const [localMatch, setLocalMatch] = useState(match);

  if (!localMatch) return null;

  const handleStatusUpdate = async (newStatus: 'accepted' | 'rejected') => {
    try {
      setUpdating(true);
      const response = await api.patch(`/matches/${localMatch.id}/status`, {
        status: newStatus
      });
      // Update local state with response
      setLocalMatch(response.data);
    } catch (error: any) {
      console.error("Error updating match status:", error);
      console.error("Error details:", error.response?.data);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Match Details</h1>
        <p className="text-gray-600">Review the details for this matched shipment</p>
      </div>

      {/* Status Section */}
      <div className="mb-6">
        {localMatch.status?.toLowerCase() === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="px-3 py-1 text-center text-[10px] font-black uppercase tracking-widest border rounded-md bg-yellow-100 text-yellow-700 border-yellow-300">
                Pending
              </div>
              <div className="flex-1">
                <p className="text-sm text-yellow-800 font-medium mb-3">
                  {localMatch.displayStatus || 'This match is waiting for confirmation from both parties.'}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleStatusUpdate('rejected')}
                    disabled={updating}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium disabled:opacity-50"
                  >
                    {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                    Decline
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('accepted')}
                    disabled={updating}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Accept Match
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {localMatch.status?.toLowerCase() === 'carrier_accepted' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="px-3 py-1 text-center text-[10px] font-black uppercase tracking-widest border rounded-md bg-blue-100 text-blue-700 border-blue-300">
                Carrier Accepted
              </div>
              <div className="flex-1">
                <p className="text-sm text-blue-800 font-medium mb-3">
                  {localMatch.displayStatus || 'The carrier has accepted this match. Waiting for requester confirmation.'}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleStatusUpdate('rejected')}
                    disabled={updating}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium disabled:opacity-50"
                  >
                    {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                    Decline
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('accepted')}
                    disabled={updating}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Accept Match
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {localMatch.status?.toLowerCase() === 'requester_accepted' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="px-3 py-1 text-center text-[10px] font-black uppercase tracking-widest border rounded-md bg-blue-100 text-blue-700 border-blue-300">
                Requester Accepted
              </div>
              <div className="flex-1">
                <p className="text-sm text-blue-800 font-medium mb-3">
                  {localMatch.displayStatus || 'The requester has accepted this match. Waiting for carrier confirmation.'}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleStatusUpdate('rejected')}
                    disabled={updating}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium disabled:opacity-50"
                  >
                    {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                    Decline
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('accepted')}
                    disabled={updating}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Accept Match
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {localMatch.status?.toLowerCase() === 'accepted' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="px-3 py-1 text-center text-[10px] font-black uppercase tracking-widest border rounded-md bg-green-100 text-green-700 border-green-300">
                Accepted
              </div>
              <div className="flex-1">
                <p className="text-sm text-green-800 font-medium">
                  {localMatch.displayStatus || 'Both parties have confirmed this match. You can now coordinate the shipment details.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {localMatch.status?.toLowerCase() === 'rejected' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="px-3 py-1 text-center text-[10px] font-black uppercase tracking-widest border rounded-md bg-red-100 text-red-700 border-red-300">
                Rejected
              </div>
              <div className="flex-1">
                <p className="text-sm text-red-800 font-medium">
                  {localMatch.displayStatus || 'This match has been declined by one or both parties.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Route Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start gap-4 mb-6">

            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <div className="text-lg font-bold text-gray-900">
                  {localMatch.trip?.fromCity || localMatch.itemRequest?.fromCity}
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <div className="text-lg font-bold text-gray-900">
                  {localMatch.trip?.toCity || localMatch.itemRequest?.toCity}
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Shipment Route
              </p>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Traveler Schedule */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                  Traveler Schedule
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Departure Date</p>
                    <p className="font-medium">{formatDate(localMatch.trip?.departureDate)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                  <Clock className="w-5 h-5 text-teal-500" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Booking Reference</p>
                    <p className="font-medium font-mono text-sm">TRP-{localMatch.tripId}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Item Details */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-teal-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                  Item Details
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                  <Package className="w-5 h-5 text-teal-500" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Item Name</p>
                    <p className="font-medium">{localMatch.itemRequest?.itemName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                  <Weight className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Agreed Weight</p>
                    <p className="font-medium">
                      {parseFloat(localMatch.agreedWeightKg || localMatch.itemRequest?.weightKg).toFixed(1)} kg
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Action Footer for Accepted Matches */}
        {localMatch.status === 'accepted' && (
          <div className="p-6 pt-0">
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <UserCircle2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-gray-900 mb-1">
                    Ready to Connect
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Both parties have confirmed this match. You can now coordinate pickup details.
                  </p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Message Shipping Partner
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}