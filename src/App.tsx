import { SearchWidget } from './components/search/SearchWidget';
import { YouTubeSearchProvider } from './context/youtube-search-context';

function App() {
  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <YouTubeSearchProvider>
        <SearchWidget />
      </YouTubeSearchProvider>
    </main>
  );
}

export default App;
