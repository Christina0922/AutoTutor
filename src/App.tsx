import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { Hub } from './pages/Hub';
import { StudentDashboard } from './pages/StudentDashboard';
import { CommandConsole } from './pages/CommandConsole';
import { Rewards } from './pages/Rewards';
import { Settings } from './pages/Settings';
import { Students } from './pages/Students';

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Hub />} />
          <Route path="/console" element={<CommandConsole />} />
          <Route path="/students" element={<Students />} />
          <Route path="/student/:studentId" element={<StudentDashboard />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
