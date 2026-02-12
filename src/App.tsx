import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Hub } from './pages/Hub';
import { StudentDashboard } from './pages/StudentDashboard';
import { CommandConsole } from './pages/CommandConsole';
import { Rewards } from './pages/Rewards';
import { Settings } from './pages/Settings';
import { useTheme } from './hooks/useTheme';
import './App.css';

function App() {
  useTheme();

  return (
    <BrowserRouter>
      <div className="app">
        <nav style={{
          backgroundColor: 'var(--nav-bg)',
          borderBottom: '1px solid var(--border-color)',
          padding: '12px 24px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
        }}>
          <a href="/" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 600 }}>
            Auto-Tutor
          </a>
          <a href="/rewards" style={{ textDecoration: 'none', color: 'var(--text-primary)' }}>
            보상 로그
          </a>
          <a href="/settings" style={{ textDecoration: 'none', color: 'var(--text-primary)' }}>
            설정
          </a>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<Hub />} />
            <Route path="/student/:studentId" element={<StudentDashboard />} />
            <Route path="/console/:studentId" element={<CommandConsole />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

