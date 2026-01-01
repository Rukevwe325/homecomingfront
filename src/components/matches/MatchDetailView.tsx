import React, { useState, useEffect } from 'react';
import { User } from '../../App';
import {
  Package,
  Plane,
  Calendar,
  Weight,
  Clock,
  ShieldCheck,
  ArrowRight,
  Check,
  X,
  Loader2,
  AlertCircle,
  MessageCircle
} from 'lucide-react';
import api from '../../api/axiosInstance';
import '../../styles/matches.css'; // Import the custom CSS

interface MatchDetailViewProps {
  match: any;
  user: User;
  onStatusUpdate?: () => void;
}

export function MatchDetailView({ match, user, onStatusUpdate }: MatchDetailViewProps) {
  const [localMatch, setLocalMatch] = useState(match);
  const [updating, setUpdating] = useState(false);

  // Sync state with props
  useEffect(() => {
    setLocalMatch(match);
  }, [match]);

  if (!localMatch) return null;

  const handleStatusUpdate = async (newStatus: 'accepted' | 'rejected') => {
    try {
      setUpdating(true);
      const response = await api.patch(`/matches/${localMatch.id}/status`, {
        status: newStatus
      });
      setLocalMatch(response.data);
      if (onStatusUpdate) onStatusUpdate();
    } catch (error: any) {
      console.error("Error updating match status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: any) => {
    if (!dateString) return 'TBD';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'TBD';
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'TBD';
    }
  };

  const status = localMatch.status?.toLowerCase();
  const isAccepted = status === 'accepted';
  const isRejected = status === 'rejected';

  // Determine if action is needed from current user
  const needsAction = () => {
    if (isAccepted || isRejected) return false;
    if (user.role === 'carrier' && status === 'carrier_accepted') return false;
    if (user.role === 'requester' && status === 'requester_accepted') return false;
    return true;
  };

  const getStatusConfig = () => {
    if (isAccepted) return {
      label: localMatch.displayStatus || 'Confirmed',
      type: 'accepted',
      icon: ShieldCheck
    };
    if (isRejected) return {
      label: localMatch.displayStatus || 'Rejected',
      type: 'rejected',
      icon: X
    };
    if (needsAction()) return {
      label: localMatch.displayStatus || 'Action Required',
      type: 'action',
      icon: AlertCircle
    };
    return {
      label: localMatch.displayStatus || 'Waiting',
      type: 'pending',
      icon: Clock
    };
  };

  const config = getStatusConfig();

  return (
    <div className="match-detail-container">
      <div className="match-detail-content">
        {/* Traveler Section */}
        <div className="match-section-card">
          <div className="flex items-start gap-4 mb-4">
            <div className="match-section-icon match-section-icon--blue">
              <Plane className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="match-route-display">
                <div className="match-section-title">
                  {localMatch.trip?.fromCity}{localMatch.trip?.fromCountry ? `, ${localMatch.trip.fromCountry}` : ''}
                </div>
                <ArrowRight className="match-route-arrow" />
                <div className="match-section-title">
                  {localMatch.trip?.toCity}{localMatch.trip?.toCountry ? `, ${localMatch.trip.toCountry}` : ''}
                </div>
              </div>
              <p className="match-section-subtitle">Traveler Route</p>
            </div>
          </div>

          <div className="match-detail-grid">
            <div className="match-detail-item">
              <Calendar className="match-detail-icon match-detail-icon--blue" />
              <div>
                <p className="match-detail-label">Departure Date</p>
                <p className="match-detail-value">{formatDate(localMatch.trip?.departureDate)}</p>
              </div>
            </div>
            <div className="match-detail-item">
              <Weight className="match-detail-icon match-detail-icon--orange" />
              <div>
                <p className="match-detail-label">Available Space</p>
                <p className="match-detail-value">
                  {localMatch.trip?.availableLuggageSpace
                    ? `${parseFloat(localMatch.trip.availableLuggageSpace).toFixed(1)} kg`
                    : (localMatch.agreedWeightKg ? `${parseFloat(localMatch.agreedWeightKg).toFixed(1)} kg` : 'N/A')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="match-divider" />

        {/* Package Section */}
        <div className="match-section-card">
          <div className="flex items-start gap-4 mb-4">
            <div className="match-section-icon match-section-icon--teal">
              <Package className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="match-section-title">
                {localMatch.itemRequest?.itemName}
              </div>
              <p className="match-section-subtitle">Package Details</p>
            </div>
          </div>

          <div className="match-detail-grid">
            <div className="match-detail-item">
              <Weight className="match-detail-icon match-detail-icon--teal" />
              <div>
                <p className="match-detail-label">{localMatch.agreedWeightKg ? 'Agreed Weight' : 'Item Weight'}</p>
                <p className="match-detail-value">
                  {parseFloat(localMatch.agreedWeightKg || localMatch.itemRequest?.weightKg || '0').toFixed(1)} kg
                </p>
              </div>
            </div>
            <div className="match-detail-item">
              <Clock className="match-detail-icon match-detail-icon--gray" />
              <div>
                <p className="match-detail-label">Needed By</p>
                <p className="match-detail-value">
                  {formatDate(
                    localMatch.itemRequest?.desiredDeliveryDate ||
                    localMatch.itemRequest?.deliveryDate ||
                    localMatch.itemRequest?.desired_delivery_date ||
                    localMatch.itemRequest?.delivery_date ||
                    localMatch.item_request?.desiredDeliveryDate ||
                    localMatch.item_request?.deliveryDate ||
                    localMatch.item_request?.desired_delivery_date ||
                    localMatch.item_request?.delivery_date ||
                    localMatch.desiredDeliveryDate ||
                    localMatch.deliveryDate ||
                    localMatch.desired_delivery_date ||
                    localMatch.delivery_date ||
                    localMatch.itemRequest?.departureDate ||
                    localMatch.departureDate
                  )}
                </p>
              </div>
            </div>
          </div>

          {localMatch.itemRequest?.notes && (
            <div className="match-notes">
              <p className="match-notes-text">
                "{localMatch.itemRequest.notes}"
              </p>
            </div>
          )}
        </div>

        {/* Status & Actions Section */}
        <div className="pt-2">
          <div className={`match-status-card match-status-card--${config.type}`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`match-status-icon-container match-status-icon-container--${config.type}`}>
                  <config.icon className="match-status-icon" />
                </div>
                <div>
                  <h4 className="match-status-label">{config.label}</h4>
                  <p className="match-status-id">Match ID: {localMatch.id}</p>
                </div>
              </div>

              {needsAction() ? (
                <div className="match-actions-container">
                  <button
                    onClick={() => handleStatusUpdate('rejected')}
                    disabled={updating}
                    className="match-button match-button--secondary flex-1"
                  >
                    <X className="w-4 h-4" />
                    Decline
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('accepted')}
                    disabled={updating}
                    className="match-button match-button--primary flex-[2]"
                  >
                    {updating ? (
                      <Loader2 className="match-loading-spinner" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Confirm Match
                  </button>
                </div>
              ) : (
                <div className="text-right">
                  {isAccepted ? (
                    <button className="match-button match-button--teal">
                      <MessageCircle className="w-4 h-4" />
                      Message Partner
                    </button>
                  ) : isRejected ? (
                    <div className="match-status-message">
                      <span className="match-status-text match-status-text--rejected">
                        Match Cancelled
                      </span>
                    </div>
                  ) : (
                    <div className="match-status-message">
                      <Loader2 className="match-loading-spinner" />
                      <span className="match-status-text match-status-text--waiting">
                        Awaiting Partner
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}