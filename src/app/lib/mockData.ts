import { Professional, Appointment, TimeSlot } from './types';
import { addDays, format } from 'date-fns';

export const mockProfessionals: Professional[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@example.com',
    profession: 'Corporate Lawyer',
    experience: 12,
    rating: 4.9,
    description: 'Specializing in corporate law, mergers & acquisitions, and contract negotiations. Over a decade of experience helping businesses navigate complex legal landscapes.',
    avatar: 'https://images.unsplash.com/photo-1736939678218-bd648b5ef3bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBsYXd5ZXIlMjBidXNpbmVzcyUyMHBlcnNvbnxlbnwxfHx8fDE3Njk3NjU4NTd8MA&ixlib=rb-4.1.0&q=80&w=400',
    availableSlots: generateTimeSlots('1'),
    isActive: true,
  },
  {
    id: '2',
    name: 'David Chen',
    email: 'david.chen@example.com',
    profession: 'Business Consultant',
    experience: 8,
    rating: 4.7,
    description: 'Strategic business consultant with expertise in digital transformation, process optimization, and organizational development.',
    avatar: 'https://images.unsplash.com/photo-1758691463198-dc663b8a64e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjb25zdWx0YW50JTIwb2ZmaWNlfGVufDF8fHx8MTc2OTc2NTg1N3ww&ixlib=rb-4.1.0&q=80&w=400',
    availableSlots: generateTimeSlots('2'),
    isActive: true,
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    email: 'emma.rodriguez@example.com',
    profession: 'Personal Fitness Trainer',
    experience: 6,
    rating: 4.8,
    description: 'Certified personal trainer specializing in strength training, weight loss, and athletic performance. Customized programs for all fitness levels.',
    avatar: 'https://images.unsplash.com/photo-1540205453279-389ebbc43b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwdHJhaW5lciUyMGNvYWNofGVufDF8fHx8MTc2OTc1ODQ5N3ww&ixlib=rb-4.1.0&q=80&w=400',
    availableSlots: generateTimeSlots('3'),
    isActive: true,
  },
  {
    id: '4',
    name: 'Michael Thompson',
    email: 'michael.thompson@example.com',
    profession: 'Life Coach',
    experience: 10,
    rating: 4.9,
    description: 'Empowering individuals to achieve their personal and professional goals through proven coaching methodologies and mindfulness techniques.',
    avatar: 'https://images.unsplash.com/photo-1589114207353-1fc98a11070b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNvbnN1bHRhbnQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY5Njc4NTI5fDA&ixlib=rb-4.1.0&q=80&w=400',
    availableSlots: generateTimeSlots('4'),
    isActive: true,
  },
];

function generateTimeSlots(professionalId: string): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const times = [
    { start: '09:00', end: '10:00' },
    { start: '10:00', end: '11:00' },
    { start: '11:00', end: '12:00' },
    { start: '14:00', end: '15:00' },
    { start: '15:00', end: '16:00' },
    { start: '16:00', end: '17:00' },
  ];

  for (let i = 0; i < 7; i++) {
    const date = format(addDays(new Date(), i), 'yyyy-MM-dd');
    times.forEach((time, index) => {
      slots.push({
        id: `${professionalId}-${i}-${index}`,
        date,
        startTime: time.start,
        endTime: time.end,
        isBooked: Math.random() > 0.7, // Random bookings
      });
    });
  }

  return slots;
}

export const mockAppointments: Appointment[] = [
  {
    id: 'apt-1',
    userId: 'user-1',
    professionalId: '1',
    professionalName: 'Sarah Mitchell',
    professionalProfession: 'Corporate Lawyer',
    date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    startTime: '10:00',
    endTime: '11:00',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'apt-2',
    userId: 'user-1',
    professionalId: '3',
    professionalName: 'Emma Rodriguez',
    professionalProfession: 'Personal Fitness Trainer',
    date: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '10:00',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
];

// LocalStorage keys
export const STORAGE_KEYS = {
  AUTH_USER: 'appointmentSystem_authUser',
  PROFESSIONALS: 'appointmentSystem_professionals',
  APPOINTMENTS: 'appointmentSystem_appointments',
};

// Initialize localStorage with mock data
export const initializeMockData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PROFESSIONALS)) {
    localStorage.setItem(STORAGE_KEYS.PROFESSIONALS, JSON.stringify(mockProfessionals));
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(mockAppointments));
  }
};

export const getProfessionals = (): Professional[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PROFESSIONALS);
  return data ? JSON.parse(data) : mockProfessionals;
};

export const getAppointments = (): Appointment[] => {
  const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
  return data ? JSON.parse(data) : mockAppointments;
};

export const saveProfessionals = (professionals: Professional[]) => {
  localStorage.setItem(STORAGE_KEYS.PROFESSIONALS, JSON.stringify(professionals));
};

export const saveAppointments = (appointments: Appointment[]) => {
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
};
