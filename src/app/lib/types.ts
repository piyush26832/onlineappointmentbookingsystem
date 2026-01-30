export type UserRole = 'user' | 'professional' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Professional {
  id: string;
  name: string;
  email: string;
  profession: string;
  experience: number;
  rating: number;
  description: string;
  avatar: string;
  availableSlots: TimeSlot[];
  isActive: boolean;
}

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  userId: string;
  professionalId: string;
  professionalName: string;
  professionalProfession: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  createdAt: string;
}
