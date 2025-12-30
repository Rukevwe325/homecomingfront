import { useState } from 'react';
import { Mail, Lock, User, Phone, Plane, Package, Luggage } from 'lucide-react';
import { UserRole } from '../../App';
import api from '../../api/axiosInstance'; // Make sure this path points to your axios file

interface RegisterPageProps {
  // onRegister is kept as a prop if you still need to update parent state, 
  // but we are handling the API call here now.
  onRegister?: (fullName: string, email: string, phone: string, password: string, role: UserRole) => void;
  onSwitchToLogin: () => void;
}

export function RegisterPage({ onRegister, onSwitchToLogin }: RegisterPageProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('carrier');
  
  // New UI states
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Basic Validation
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // 2. Prepare data (Splitting Full Name)
    const [firstName, ...lastNameParts] = fullName.trim().split(' ');
    const lastName = lastNameParts.join(' ');

    const payload = {
      email,
      password,
      firstName,
      lastName: lastName || '.', // Fallback if user only enters one name
      // phone // include this if your backend expects it
    };

    try {
      setIsSubmitting(true);

      // 3. API POST Request
      const response = await api.post('/users/register', payload);

      console.log('Success:', response.data);
      
      // Optional: Call the old onRegister prop if you still need it for local state
      if (onRegister) onRegister(fullName, email, phone, password, role);
      
      // 4. Success Action
      alert('Registration successful! Please log in.');
      onSwitchToLogin();

    } catch (err: any) {
      // 5. Error Handling
      // This looks for error messages returned by your backend
      const serverMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(serverMessage);
      console.error('Axios Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="w-full max-w-2xl">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4">
            <Plane className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-gray-900 mb-2">Join Homecoming</h1>
          <p className="text-gray-600">Start carrying or shipping items worldwide</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-gray-900 mb-6">Create an Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-gray-700 mb-3">I want to:</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('carrier')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    role === 'carrier' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${role === 'carrier' ? 'bg-blue-600' : 'bg-gray-200'}`}>
                      <Luggage className={`w-6 h-6 ${role === 'carrier' ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <div className="text-left">
                      <div className="text-gray-900 font-medium">Carry Items</div>
                      <div className="text-xs text-gray-600">Traveler with space</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('requester')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    role === 'requester' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${role === 'requester' ? 'bg-blue-600' : 'bg-gray-200'}`}>
                      <Package className={`w-6 h-6 ${role === 'requester' ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <div className="text-left">
                      <div className="text-gray-900 font-medium">Send Items</div>
                      <div className="text-xs text-gray-600">International shipping</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full text-white py-3 px-4 rounded-lg transition-colors font-medium ${
                isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-600">Already have an account? </span>
            <button onClick={onSwitchToLogin} className="text-blue-600 hover:text-blue-700 font-medium">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}