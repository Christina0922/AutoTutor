import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Terminal, 
  Users, 
  Award, 
  Settings,
  Moon,
  Sun,
  Video,
  BookOpen
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Hub', href: '/', icon: LayoutDashboard },
  { name: 'Command Console', href: '/console', icon: Terminal },
  { name: 'Students', href: '/students', icon: Users },
  { name: 'Rewards', href: '/rewards', icon: Award },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-sm">
        <div className="flex h-16 items-center border-b border-border px-6">
          <h1 className="text-xl font-semibold">Auto-Tutor</h1>
        </div>
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== '/' && location.pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                )}
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold">
              {navigation.find((item) => 
                location.pathname === item.href || 
                (item.href !== '/' && location.pathname.startsWith(item.href))
              )?.name || 'Auto-Tutor'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                const zoomLink = localStorage.getItem('auto-tutor-zoom-link') || 'https://zoom.us';
                window.open(zoomLink, '_blank');
              }}
              className="gap-2 h-9"
            >
              <Video className="h-4 w-4" />
              Zoom 입장
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const problemSiteLink = localStorage.getItem('auto-tutor-problem-site-link') || 'https://example.com';
                window.open(problemSiteLink, '_blank');
              }}
              className="gap-2 h-9"
            >
              <BookOpen className="h-4 w-4" />
              변형문제 사이트
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="h-9 w-9"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-background to-secondary/40 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
