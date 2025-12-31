import { useState } from 'react';
import { User } from '../../App';
import { Package, MapPin, Calendar, FileText, DollarSign, CheckCircle } from 'lucide-react';
import { LocationPicker } from '../shared/LocationPicker';
import api from '../../api/axiosInstance';

interface PostRequestProps {
  user: User;
  onNavigate?: (view: string) => void;
  onShowFlash?: (message: string, type?: 'success' | 'error') => void;
}

export function PostRequest({ user, onNavigate, onShowFlash }: PostRequestProps) {
  const [formData, setFormData] = useState({
    originCountry: '',
    originState: '',
    originCity: '',
    destCountry: '',
    destState: '',
    destCity: '',
    deliveryDate: '',
    itemName: '',
    itemWeight: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const requestPayload = {
      itemName: formData.itemName,
      quantity: 1,
      weightKg: parseFloat(formData.itemWeight),
      fromCountry: formData.originCountry,
      fromState: formData.originState,
      fromCity: formData.originCity,
      toCountry: formData.destCountry,
      toState: formData.destState,
      toCity: formData.destCity,
      desiredDeliveryDate: formData.deliveryDate,
      notes: formData.notes,
      status: 'active',
    };

    try {
      await api.post('/item-requests', requestPayload);

      // Trigger flash message and redirect
      if (onShowFlash) onShowFlash("Request posted successfully!", "success");
      if (onNavigate) onNavigate('my-requests');

      // Clear form
      setFormData({
        originCountry: '',
        originState: '',
        originCity: '',
        destCountry: '',
        destState: '',
        destCity: '',
        deliveryDate: '',
        itemName: '',
        itemWeight: '',
        notes: '',
      });

    } catch (err) {
      console.error("Error posting request:", err);
      if (onShowFlash) {
        onShowFlash("Failed to submit request. Please try again.", "error");
      } else {
        alert("Failed to submit request. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Request an Item</h1>
        <p className="text-gray-600">Connect with travelers to get items delivered to you</p>
      </div>



      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        {/* Item Details */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-blue-600" />
            <h2 className="text-gray-900 font-semibold">Item Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="itemName" className="block text-gray-700 mb-2 text-sm">Item Name *</label>
              <input
                id="itemName"
                type="text"
                required
                value={formData.itemName}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., iPhone 15 Pro, Documents, etc."
              />
            </div>
            <div>
              <label htmlFor="itemWeight" className="block text-gray-700 mb-2 text-sm">Est. Weight (kg) *</label>
              <input
                id="itemWeight"
                type="number"
                required
                min="0.1"
                step="0.1"
                value={formData.itemWeight}
                onChange={(e) => setFormData({ ...formData, itemWeight: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 2.5"
              />
            </div>
          </div>
        </div>

        {/* Origin Location */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h2 className="text-gray-900 font-semibold">Item Origin (Purchase Location)</h2>
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
            <h2 className="text-gray-900 font-semibold">Destination (Delivery Location)</h2>
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

        {/* Delivery Details */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-gray-900 font-semibold">Delivery Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="deliveryDate" className="block text-gray-700 mb-2 text-sm">Needed By *</label>
              <input
                id="deliveryDate"
                type="date"
                required
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-gray-900 font-semibold">Additional Details</h2>
          </div>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the item in detail, specific purchase instructions, etc."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium disabled:bg-blue-400"
        >
          <Package className="w-5 h-5" />
          {loading ? 'Posting...' : 'Post Request'}
        </button>
      </form>
    </div>
  );
}