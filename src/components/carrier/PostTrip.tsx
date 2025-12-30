import { useState } from 'react';
import { User } from '../../App';
import { Plane, MapPin, Calendar, Weight, FileText, CheckCircle } from 'lucide-react';
import { LocationPicker } from '../shared/LocationPicker';
import api from '../../api/axiosInstance'; 

interface PostTripProps {
  user: User;
}

export function PostTrip({ user }: PostTripProps) {
  const [formData, setFormData] = useState({
    originCountry: '',
    originState: '',
    originCity: '',
    destCountry: '',
    destState: '',
    destCity: '',
    departureDate: '',
    returnDate: '',
    availableSpace: '',
    notes: '',
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const tripPayload = {
      fromCountry: formData.originCountry,
      fromState: formData.originState,
      fromCity: formData.originCity,
      toCountry: formData.destCountry,
      toState: formData.destState,
      toCity: formData.destCity,
      departureDate: formData.departureDate,
      returnDate: formData.returnDate || null,
      availableLuggageSpace: parseFloat(formData.availableSpace),
      notes: formData.notes,
    };

    try {
      await api.post('/trips', tripPayload);

      setSuccess(true);
      setFormData({
        originCountry: '',
        originState: '',
        originCity: '',
        destCountry: '',
        destState: '',
        destCity: '',
        departureDate: '',
        returnDate: '',
        availableSpace: '',
        notes: '',
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error("Error posting trip:", err);
      alert("Failed to post trip. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Post a Trip</h1>
        <p className="text-gray-600">Share your travel plans and help deliver items along your route</p>
      </div>

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800">Trip posted successfully! We'll notify you of any matches.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        {/* Origin Location */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h2 className="text-gray-900 font-semibold">Origin Location</h2>
          </div>
          <LocationPicker
            country={formData.originCountry}
            state={formData.originState}
            city={formData.originCity}
            onCountryChange={(value) => setFormData({ ...formData, originCountry: value, originState: '', originCity: '' })}
            onStateChange={(value) => setFormData({ ...formData, originState: value, originCity: '' })}
            onCityChange={(value) => setFormData({ ...formData, originCity: value })}
          />
        </div>

        {/* Destination Location */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-teal-600" />
            <h2 className="text-gray-900 font-semibold">Destination Location</h2>
          </div>
          <LocationPicker
            country={formData.destCountry}
            state={formData.destState}
            city={formData.destCity}
            onCountryChange={(value) => setFormData({ ...formData, destCountry: value, destState: '', destCity: '' })}
            onStateChange={(value) => setFormData({ ...formData, destState: value, destCity: '' })}
            onCityChange={(value) => setFormData({ ...formData, destCity: value })}
          />
        </div>

        {/* Dates */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-gray-900 font-semibold">Travel Dates</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="departureDate" className="block text-gray-700 mb-2 text-sm">
                Departure Date *
              </label>
              <input
                id="departureDate"
                type="date"
                required
                value={formData.departureDate}
                onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="returnDate" className="block text-gray-700 mb-2 text-sm">
                Return Date (Optional)
              </label>
              <input
                id="returnDate"
                type="date"
                value={formData.returnDate}
                onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Available Space */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Weight className="w-5 h-5 text-blue-600" />
            <h2 className="text-gray-900 font-semibold">Available Luggage Space</h2>
          </div>
          <div>
            <label htmlFor="availableSpace" className="block text-gray-700 mb-2 text-sm">
              Weight (kg) *
            </label>
            <input
              id="availableSpace"
              type="number"
              required
              min="0.1"
              step="0.1"
              value={formData.availableSpace}
              onChange={(e) => setFormData({ ...formData, availableSpace: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 15"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-gray-900 font-semibold">Additional Notes</h2>
          </div>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Any additional details about your trip..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium disabled:bg-blue-400"
        >
          <Plane className="w-5 h-5" />
          {loading ? 'Posting...' : 'Post Trip'}
        </button>
      </form>
    </div>
  );
}