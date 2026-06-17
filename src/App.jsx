import { Routes, Route } from 'react-router-dom';
import { DiagnosticProvider } from './lib/diagnosticState';
import Landing from './pages/Landing';
import Diagnostic from './pages/Diagnostic';
import Email from './pages/Email';
import Report from './pages/Report';

export default function App() {
  return (
    <DiagnosticProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/diagnostic" element={<Diagnostic />} />
        <Route path="/email" element={<Email />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </DiagnosticProvider>
  );
}
