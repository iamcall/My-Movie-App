import { useAppStore } from '../store/useAppStore';

export const Hero = () => {
  const setCurrentView = useAppStore((state) => state.setCurrentView);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 via-purple-600 to-pink-500">
      <div className="text-center px-6">
        <h1 className="text-6xl font-bold text-white mb-6 animate-fade-in">
          Next Watch Compass
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-slide-up">
          Find your perfect movie match across all your streaming services.
          <br />
          Let us guide you to your next great watch.
        </p>
        <button
          onClick={() => setCurrentView('streaming')}
          className="bg-white text-primary-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};
