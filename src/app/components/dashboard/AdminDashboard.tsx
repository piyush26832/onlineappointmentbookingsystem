import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Navbar } from '@/app/components/shared/Navbar';
import { StatsCard } from '@/app/components/shared/StatsCard';
import { Users, Briefcase, Calendar, TrendingUp } from 'lucide-react';
import { getProfessionals, getAppointments, saveProfessionals } from '@/app/lib/mockData';
import { Professional, Appointment } from '@/app/lib/types';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Switch } from '@/app/components/ui/switch';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProfessionals(getProfessionals());
    setAppointments(getAppointments());
  };

  const toggleProfessionalStatus = (proId: string) => {
    const updated = professionals.map(p =>
      p.id === proId ? { ...p, isActive: !p.isActive } : p
    );
    saveProfessionals(updated);
    setProfessionals(updated);
    toast.success('Professional status updated');
  };

  const stats = {
    totalUsers: 128, // Mock data
    totalProfessionals: professionals.length,
    totalAppointments: appointments.length,
    activeAppointments: appointments.filter(a => a.status !== 'completed').length,
  };

  const chartData = professionals.map(p => ({
    name: p.name.split(' ')[0],
    bookings: appointments.filter(a => a.professionalId === p.id).length,
  }));

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage professionals, users, and appointments</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            color="cyan"
            trend="+8 this week"
            delay={0}
          />
          <StatsCard
            title="Professionals"
            value={stats.totalProfessionals}
            icon={Briefcase}
            color="purple"
            delay={0.1}
          />
          <StatsCard
            title="Total Appointments"
            value={stats.totalAppointments}
            icon={Calendar}
            color="blue"
            delay={0.2}
          />
          <StatsCard
            title="Active Bookings"
            value={stats.activeAppointments}
            icon={TrendingUp}
            trend="+15%"
            color="cyan"
            delay={0.3}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6">Bookings by Professional</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.2)" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(20, 20, 30, 0.9)',
                    border: '1px solid rgba(100, 116, 139, 0.3)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="bookings" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00d9ff" stopOpacity={1} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={1} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6">Recent Appointments</h2>
            <div className="space-y-3">
              {appointments.slice(0, 5).map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{apt.professionalName}</p>
                    <p className="text-xs text-gray-400">{apt.date}</p>
                  </div>
                  <Badge
                    className={
                      apt.status === 'confirmed'
                        ? 'bg-green-500/20 text-green-400'
                        : apt.status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }
                  >
                    {apt.status}
                  </Badge>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white">Manage Professionals</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionals.map((pro, index) => (
              <motion.div
                key={pro.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="glass rounded-xl p-6 glow-hover-cyan"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{pro.name}</h3>
                    <p className="text-sm text-gray-400">{pro.profession}</p>
                  </div>
                  <Badge
                    className={
                      pro.isActive
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }
                  >
                    {pro.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <span className="text-sm text-gray-400">Enable Profile</span>
                  <Switch
                    checked={pro.isActive}
                    onCheckedChange={() => toggleProfessionalStatus(pro.id)}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};
