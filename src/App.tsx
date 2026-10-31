import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import Overview from './pages/Overview';
import GraphPage from './pages/GraphPage';
import ChangedFiles from './pages/ChangedFiles';
import ReviewQueue from './pages/ReviewQueue';
import VerificationHistory from './pages/VerificationHistory';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen w-full bg-dark-bg text-gray-100 font-sans overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-8 h-full flex flex-col">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/graph" element={<GraphPage />} />
              <Route path="/files" element={<ChangedFiles />} />
              <Route path="/review" element={<ReviewQueue />} />
              <Route path="/history" element={<VerificationHistory />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;