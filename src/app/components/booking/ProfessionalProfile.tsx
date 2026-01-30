import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Navbar } from '@/app/components/shared/Navbar';
import { getProfessionals, getAppointments, saveAppointments } from '@/app/lib/mockData';
import { Professional, TimeSlot } from '@/app/lib/types';
import { Star, Calendar, Clock, Award, ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/app/components/context/AuthContext';

export const ProfessionalProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const pros = getProfessionals();
    const pro = pros.find(p => p.id === id);
    if (pro) {
      setProfessional(pro);
    }
  }, [id]);

  const handleBooking = async () => {
    if (!selectedSlot || !professional || !user) return;

    setIsBooking(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const appointments = getAppointments();
    const newAppointment = {
      id: `apt-${Date.now()}`,
      userId: user.id,
      professionalId: professional.id,
      professionalName: professional.name,
      professionalProfession: professional.profession,
      date: selectedSlot.date,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      status: 'confirmed' as const,
      createdAt: new Date().toISOString(),
    };

    appointments.push(newAppointment);
    saveAppointments(appointments);

    // Update slot availability
    const pros = getProfessionals();
    const updatedPros = pros.map(p => {
      if (p.id === professional.id) {
        return {
          ...p,
          availableSlots: p.availableSlots.map(slot =>
            slot.id === selectedSlot.id ? { ...slot, isBooked: true } : slot
          ),
        };
      }
      return p;
    });
    
    toast.success('Appointment booked successfully!');
    setIsBooking(false);
    navigate('/dashboard');
  };

  if (!professional) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="size-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const availableSlots = professional.availableSlots.filter(slot => !slot.isBooked);
  const groupedSlots = availableSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/professionals')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Professionals
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="glass rounded-xl overflow-hidden glow-cyan sticky top-24">
              <div className="relative h-64">
                <ImageWithFallback
                  src={professional.avatar}
                  alt={professional.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>

              <div className="p-6 space-y-4">
                <h2 className="text-2xl font-bold text-white">{professional.name}</h2>
                <p className="text-cyan-400">{professional.profession}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <div className="flex items-center gap-2">
                    <Star className="size-5 text-yellow-400 fill-current" />
                    <span className="text-xl font-bold text-white">{professional.rating}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Award className="size-5" />
                    <span>{professional.experience} years</span>
                  </div>
                </div>

                <p className="text-gray-400 text-sm pt-4">{professional.description}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="size-5 text-cyan-400" />
                Available Time Slots
              </h3>

              {Object.keys(groupedSlots).length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="size-16 mx-auto text-gray-600 mb-4" />
                  <p className="text-gray-400">No available slots at the moment</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedSlots).map(([date, slots]) => (
                    <div key={date} className="space-y-3">
                      <h4 className="text-lg font-semibold text-white">
                        {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {slots.map((slot) => (
                          <motion.button
                            key={slot.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedSlot(slot)}
                            className={`p-4 rounded-lg glass border transition-all ${
                              selectedSlot?.id === slot.id
                                ? 'border-cyan-500 glow-cyan'
                                : 'border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <div className="flex items-center justify-center gap-2 text-white">
                              <Clock className="size-4" />
                              <span className="font-medium">
                                {slot.startTime} - {slot.endTime}
                              </span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedSlot && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-6 glow-purple"
              >
                <h4 className="text-lg font-semibold text-white mb-4">Booking Summary</h4>
                <div className="space-y-3 text-gray-300">
                  <div className="flex justify-between">
                    <span>Professional:</span>
                    <span className="font-semibold text-white">{professional.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-semibold text-white">
                      {format(new Date(selectedSlot.date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="font-semibold text-white">
                      {selectedSlot.startTime} - {selectedSlot.endTime}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleBooking}
                  disabled={isBooking}
                  className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white glow-hover-purple"
                >
                  {isBooking ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="size-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    'Confirm Booking'
                  )}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};
