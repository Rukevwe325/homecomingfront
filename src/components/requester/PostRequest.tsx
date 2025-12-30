import { useState } from 'react';
import { User } from '../../App';
import { Package, MapPin, Calendar, Weight, FileText, CheckCircle } from 'lucide-react';
import { LocationPicker } from '../shared/LocationPicker';
import api from '../../api/axiosInstance'; // Ensure this matches your axios setup

interface PostRequestProps {
  user: User;
}

export function PostRequest({ user }: PostRequestProps) {
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    weight: '',
    originCountry: '',
    originState: '',
    originCity: '',
    destCountry: '',
    destState: '',
    destCity: '',
    deadline: '',
    notes: '',
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Map the form data to your backend endpoint structure
    const requestPayload = {
      itemName: formData.itemName,
      quantity: parseInt(formData.quantity),
      weightKg: parseFloat(formData.weight),
      fromCountry: formData.originCountry,
      fromState: formData.originState,
      fromCity: formData.originCity,
      toCountry: formData.destCountry,
      toState: formData.destState,
      toCity: formData.destCity,
      desiredDeliveryDate: formData.deadline,
      notes: formData.notes,
      status: "active"
    };

    try {
      // API call to your backend
      await api.post('/item-requests', requestPayload);

      setSuccess(true);
      // Reset form fields
      setFormData({
        itemName: '',
        quantity: '',
        weight: '',
        originCountry: '',
        originState: '',
        originCity: '',
        destCountry: '',
        destState: '',
        destCity: '',
        deadline: '',
        notes: '',
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error("Error posting item request:", err);
      alert("Failed to post request. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Post a Request</h1>
        <p className="text-gray-600">Request an item to be shipped internationally</p>
      </div>

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800">Request posted successfully! We'll notify you of any matches.</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        {/* Item Details */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-blue-600" />
            <h2 className="text-gray-900 font-semibold">Item Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="itemName" className="block text-gray-700 mb-2 text-sm">
                Item Name *
              </label>
              <input
                id="itemName"
                type="text"
                required
                value={formData.itemName}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Books, Electronics, Clothing"
              />
            </div>
            <div>
              <label htmlFor="quantity" className="block text-gray-700 mb-2 text-sm">
                Quantity *
              </label>
              <input
                id="quantity"
                type="number"
                required
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1"
              />
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="weight" className="block text-gray-700 mb-2 text-sm">
              Total Weight (kg) *
            </label>
            <div className="flex items-center gap-2">
              <Weight className="w-5 h-5 text-gray-400" />
              <input
                id="weight"
                type="number"
                required
                min="0.1"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 5"
              />
            </div>
          </div>
        </div>

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

        {/* Deadline */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-gray-900 font-semibold">Delivery Deadline</h2>
          </div>
          <div>
            <label htmlFor="deadline" className="block text-gray-700 mb-2 text-sm">
              Desired Delivery Date *
            </label>
            <input
              id="deadline"
              type="date"
              required
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            placeholder="Any additional details about the item or special requirements..."
          />
        </div>

        {/* Submit Button */}
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