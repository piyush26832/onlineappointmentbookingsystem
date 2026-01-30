import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '@/app/components/context/AuthContext';
import { Calendar, LogOut, User, Briefcase, Shield, Search } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleIcon = {
    user: <User className="size-5" />,
    professional: <Briefcase className="size-5" />,
    admin: <Shield className="size-5" />,
  };

  const roleColor = {
    user: 'cyan',
    professional: 'purple',
    admin: 'blue',
  };

  return (
    <nav className="glass-strong sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={user?.role === 'admin' ? '/admin' : user?.role === 'professional' ? '/professional' : '/dashboard'}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <div className="bg-gradient-to-br from-cyan-500 to-purple-600 p-2 rounded-lg glow-cyan">
                <Calendar className="size-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AppointMe</span>
            </motion.div>
          </Link>

          <div className="flex items-center gap-4">
            {user?.role === 'user' && (
              <Link to="/professionals">
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <Search className="size-4 mr-2" />
                  Find Professionals
                </Button>
              </Link>
            )}

            <div className="flex items-center gap-3 glass rounded-full px-4 py-2">
              <div className={`text-${roleColor[user?.role || 'user']}-400`}>
                {roleIcon[user?.role || 'user']}
              </div>
              <div className="text-sm">
                <p className="text-white font-medium">{user?.name}</p>
                <p className="text-gray-400 text-xs capitalize">{user?.role}</p>
              </div>
            </div>

            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-gray-300 hover:text-red-400 hover:bg-gray-800"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
