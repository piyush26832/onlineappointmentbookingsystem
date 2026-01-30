import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Navbar } from '@/app/components/shared/Navbar';
import { StatsCard } from '@/app/components/shared/StatsCard';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getAppointments } from '@/app/lib/mockData';
import { Appointment } from '@/app/lib/types';
import { format } from 'date-fns';
import { Badge } from '@/app/components/ui/badge';
import { useAuth } from '@/app/components/context/AuthContext';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const allAppointments = getAppointments();
    setAppointments(allAppointments.filter(apt => apt.userId === user?.id || apt.userId === 'user-1'));
  }, [user]);

  const stats = {
    total: appointments.length,
    upcoming: appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length,
    completed: appointments.filter(a => a.status === 'completed').length,
  };

  const statusColor = {
    confirmed: 'bg-green-500/20 text-green-400 border-green-500/30',
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Welcome Back, {user?.name}!</h1>
          <p className="text-gray-400">Here's what's happening with your appointments</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Appointments"
            value={stats.total}
            icon={Calendar}
            color="cyan"
            delay={0}
          />
          <StatsCard
            title="Upcoming"
            value={stats.upcoming}
            icon={Clock}
            color="purple"
            delay={0.1}
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            icon={CheckCircle}
            color="blue"
            delay={0.2}
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Your Appointments</h2>
          </div>

          <div className="space-y-4">
            {appointments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-xl p-12 text-center"
              >
                <Calendar className="size-16 mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Appointments Yet</h3>
                <p className="text-gray-400">Start by browsing our professionals and booking your first appointment!</p>
              </motion.div>
            ) : (
              appointments.map((appointment, index) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="glass rounded-xl p-6 glow-hover-cyan transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{appointment.professionalName}</h3>
                        <Badge className={statusColor[appointment.status]}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{appointment.professionalProfession}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 text-cyan-400" />
                          {format(new Date(appointment.date), 'MMM dd, yyyy')}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="size-4 text-purple-400" />
                          {appointment.startTime} - {appointment.endTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
