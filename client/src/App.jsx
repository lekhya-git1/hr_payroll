import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/public/Home';
import Dashboard from './pages/app/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;