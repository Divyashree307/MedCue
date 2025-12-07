
export enum ScreenName {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  OTP = 'OTP',
  CARETAKER_INFO = 'CARETAKER_INFO',
  DASHBOARD = 'DASHBOARD',
  MEDICINE_SCHEDULE = 'MEDICINE_SCHEDULE',
  LOG = 'LOG',
  APPOINTMENTS = 'APPOINTMENTS',
  ROUTINE = 'ROUTINE',
  EMERGENCY = 'EMERGENCY',
  NOTIFICATIONS = 'NOTIFICATIONS',
  THEME = 'THEME',
  FONT = 'FONT',
  LANGUAGE = 'LANGUAGE',
  SYMPTOMS = 'SYMPTOMS',
  PROFILE = 'PROFILE',
  MED_GALLERY = 'MED_GALLERY',
  LOCATION = 'LOCATION',
  CAMERA = 'CAMERA'
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other'
}

export enum DosageTime {
  MORNING = 'Morning',
  AFTERNOON = 'Afternoon',
  NIGHT = 'Night'
}

export enum MedicineStatus {
  TAKEN = 'Taken',
  PENDING = 'Pending',
  MISSED = 'Missed'
}

export enum RoutineStatus {
  DONE = 'Done',
  PENDING = 'Pending',
  INCOMPLETE = 'Incomplete'
}

export interface User {
  name: string;
  gender: Gender;
  age: string;
  dob: string;
  phone: string;
  email: string;
}

export interface Caretaker {
  name: string;
  gender: Gender;
  age: string;
  relationship: string;
  phone: string;
  email: string;
}

export interface Doctor {
  name: string;
  specialist: string;
  hospital: string;
  phone: string;
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  timing: DosageTime[];
  startDate: string;
  endDate: string;
  instruction: 'Before Food' | 'After Food';
}

export interface MedicineLogEntry {
  id: string;
  medicineId: string;
  medicineName: string;
  date: string; // YYYY-MM-DD
  timeSlot: DosageTime;
  status: MedicineStatus;
  timestamp?: string;
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialist: string;
  hospital: string;
  date: string;
  time: string;
  reason: string;
  instructions: string;
  reportUrl?: string;
}

export interface RoutineTask {
  id: string;
  title: string;
  status: RoutineStatus;
  timeOfDay: string; // e.g. "8:00 AM"
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

export interface GalleryItem {
  id: string;
  imageData: string; // Base64
  timestamp: string;
  note?: string;
}

export interface AppSettings {
  theme: 'system' | 'light' | 'dark' | 'custom';
  fontScale: 'sm' | 'md' | 'lg' | 'xl';
  language: string;
  backgroundImage?: string | null;
  notifications: {
    // Alert Types
    vibration: boolean;
    voiceAlerts: boolean;
    fullScreen: boolean;
    smsAlerts: boolean;
    emailAlerts: boolean;
    
    // Toggles
    medicationReminder: boolean;
    appointmentReminder: boolean;
    refillReminder: boolean;

    // Detailed Config
    ringtone: string;
    soundDuration: string; // 5s, 10s...
    snoozeDuration: string; // 1m, 3m...
    apptReminderTiming: string; // 10 days before...
    caretakerMissedTiming: string; // 15 mins...
    refillReminderTiming: string; // 5 days before...
  };
}
