import { useAppStore } from '../store/useAppStore';
import { STREAMING_SERVICES } from '../config/preferences';
import { fetchCalibrationMovies } from '../utils/api';
import toast from 'react-hot-toast';

export const StreamingSelector = () => {
  const {
    selectedServices,
    toggleService,
    setCurrentView,
    setCalibrationMovies,
    setIsLoading,
  } = useAppStore();

  const handleContinue = async () => {
    if (selectedServices.length === 0) {
      toast.error('Please select at least one streaming service');
      return;
    }

    setIsLoading(true);
    try {
      const movies = await fetchCalibrationMovies(12);
      setCalibrationMovies(movies);
      setCurrentView('calibration');
    } catch (error) {
      toast.error('Failed to load movies. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Select Your Streaming Services
          </h2>
          <p className="text-lg text-gray-600">
            Choose the platforms you have access to
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {STREAMING_SERVICES.map((service) => (
            <button
              key={service.id}
              onClick={() => toggleService(service.id)}
              className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                selectedServices.includes(service.id)
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-gray-300 bg-white hover:border-primary-300'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">
                  {getServiceIcon(service.id)}
                </div>
                <div className="font-semibold text-gray-900">
                  {service.name}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setCurrentView('landing')}
            className="btn-secondary"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={selectedServices.length === 0}
            className="btn-primary"
          >
            Continue to Taste Calibration
          </button>
        </div>

        {selectedServices.length > 0 && (
          <div className="mt-6 text-center text-gray-600">
            {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''}{' '}
            selected
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function for service icons
const getServiceIcon = (serviceId: string): string => {
  const icons: { [key: string]: string } = {
    Netflix: '🎬',
    Hulu: '📺',
    'Prime Video': '📦',
    'Disney+': '🏰',
    'HBO Max': '🎭',
    'Apple TV+': '🍎',
  };
  return icons[serviceId] || '🎥';
};
