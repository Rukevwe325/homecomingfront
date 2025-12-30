import { Country, State, City } from 'country-state-city';

interface LocationPickerProps {
  country: string;
  state: string;
  city: string;
  onCountryChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onCityChange: (value: string) => void;
}

export function LocationPicker({
  country,
  state,
  city,
  onCountryChange,
  onStateChange,
  onCityChange,
}: LocationPickerProps) {
  // Get all countries
  const countries = Country.getAllCountries();

  // Get states for selected country
  const selectedCountry = countries.find(c => c.isoCode === country);
  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : [];

  // Get cities for selected state
  const selectedState = states.find(s => s.isoCode === state);
  const cities = selectedState && selectedCountry
    ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
    : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Country */}
      <div>
        <label className="block text-gray-700 mb-2 text-sm font-medium">Country *</label>
        <select
          required
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c.isoCode} value={c.isoCode}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* State */}
      <div>
        <label className="block text-gray-700 mb-2 text-sm font-medium">State/Region *</label>
        <select
          required
          value={state}
          onChange={(e) => onStateChange(e.target.value)}
          disabled={!country}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Select State/Region</option>
          {states.map((s) => (
            <option key={s.isoCode} value={s.isoCode}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* City */}
      <div>
        <label className="block text-gray-700 mb-2 text-sm font-medium">City *</label>
        <select
          required
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          disabled={!state}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Select City</option>
          {cities.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
