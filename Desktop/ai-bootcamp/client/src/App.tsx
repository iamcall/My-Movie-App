import { Toaster } from 'react-hot-toast';
import { useAppStore } from './store/useAppStore';
import { Hero } from './components/Hero';
import { StreamingSelector } from './components/StreamingSelector';
import { TasteCalibration } from './components/TasteCalibration';
import { MoodPreferences } from './components/MoodPreferences';
import { RecommendationsList } from './components/RecommendationsList';
import { LoadingSpinner } from './components/LoadingSpinner';

function App() {
  const { currentView, isLoading } = useAppStore();

  return (
    <>
      <Toaster position="top-right" />
      {isLoading && <LoadingSpinner />}

      {currentView === 'landing' && <Hero />}
      {currentView === 'streaming' && <StreamingSelector />}
      {currentView === 'calibration' && <TasteCalibration />}
      {currentView === 'mood' && <MoodPreferences />}
      {currentView === 'results' && <RecommendationsList />}
    </>
  );
}

export default App;
