import { User } from '../../App';
import { Settings as SettingsIcon, User as UserIcon, Mail, Phone, Shield } from 'lucide-react';

interface SettingsProps {
  user: User;
}

export function Settings({ user }: SettingsProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-gray-900">Profile Information</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Full Name</label>
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
              <UserIcon className="w-5 h-5 text-gray-400" />
              <span className="text-gray-900">{user.fullName}</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-400" />
              <span className="text-gray-900">{user.email}</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Phone Number</label>
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-400" />
              <span className="text-gray-900">{user.phone}</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Account Type</label>
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
              <Shield className="w-5 h-5 text-gray-400" />
              <span className="text-gray-900 capitalize">{user.role}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-gray-900">Account Actions</h2>
        </div>

        <div className="space-y-3">
          <button className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
            Change Password
          </button>
          <button className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
            Notification Preferences
          </button>
          <button className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
            Privacy Settings
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-blue-900 mb-2">About Your Data</h3>
        <p className="text-blue-800">
          Your information is stored locally in your browser. For a full-featured experience with
          real-time updates and multi-device sync, consider connecting to a database.
        </p>
      </div>
    </div>
  );
}
