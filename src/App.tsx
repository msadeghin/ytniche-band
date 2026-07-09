import { Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Landing } from '@/pages/Landing';
import { Dashboard } from '@/pages/Dashboard';
import { Workflow } from '@/pages/Workflow';
import { Results } from '@/pages/Results';

export default function App() {
  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workflow" element={<Workflow />} />
        <Route path="/results/:analysisId" element={<Results />} />
      </Routes>
    </div>
  );
}
