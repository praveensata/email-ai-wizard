
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Mail, 
  BarChart, 
  User, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/campaigns', label: 'Campaigns', icon: Mail },
    { path: '/analytics', label: 'Analytics', icon: BarChart },
  ];

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  if (!currentUser) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r shadow-sm">
        <div className="p-4 border-b">
          <h1 className="font-bold text-xl text-marketing-blue-700">Email AI Wizard</h1>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-2 px-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 ${
                  location.pathname === item.path ? 'bg-marketing-blue-50 text-marketing-blue-700' : ''
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center mb-4">
            <div className="bg-marketing-blue-100 p-2 rounded-full">
              <User className="h-6 w-6 text-marketing-blue-700" />
            </div>
            <div className="ml-3">
              <p className="font-medium">{currentUser.email}</p>
            </div>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="w-full flex items-center justify-center"
          >
            <LogOut className="mr-2 h-4 w-4" /> Log Out
          </Button>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-10 flex items-center justify-between p-4 border-b shadow-sm">
        <h1 className="font-bold text-lg text-marketing-blue-700">Email AI Wizard</h1>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white pt-16">
          <nav className="p-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-lg ${
                  location.pathname === item.path ? 'text-marketing-blue-700 font-medium' : 'text-gray-700'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            ))}
            <hr className="my-4" />
            <div className="px-4 py-2">
              <p className="text-sm text-gray-500">Signed in as:</p>
              <p className="font-medium">{currentUser.email}</p>
            </div>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="w-full flex items-center justify-center mt-4"
            >
              <LogOut className="mr-2 h-4 w-4" /> Log Out
            </Button>
          </nav>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-y-auto md:pt-0 pt-16">
        {children}
      </div>
    </div>
  );
};

export default Layout;
