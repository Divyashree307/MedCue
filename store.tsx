
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, Caretaker, Medicine, MedicineLogEntry, Appointment, 
  RoutineTask, EmergencyContact, AppSettings, ScreenName, 
  Gender, MedicineStatus, DosageTime, RoutineStatus, Doctor, GalleryItem
} from './types';
import { getTranslation } from './utils/translations';

interface AppContextType {
  currentScreen: ScreenName;
  navigateTo: (screen: ScreenName) => void;
  user: User;
  updateUser: (u: User) => void;
  caretaker: Caretaker;
  updateCaretaker: (c: Caretaker) => void;
  doctor: Doctor;
  updateDoctor: (d: Doctor) => void;
  medicines: Medicine[];
  addMedicine: (m: Medicine) => void;
  deleteMedicine: (id: string) => void;
  medicineLogs: MedicineLogEntry[];
  updateLogStatus: (id: string, status: MedicineStatus) => void;
  appointments: Appointment[];
  addAppointment: (a: Appointment) => void;
  deleteAppointment: (id: string) => void;
  routines: RoutineTask[];
  updateRoutineStatus: (id: string, status: RoutineStatus) => void;
  addRoutine: (t: RoutineTask) => void;
  emergencyContacts: EmergencyContact[];
  addEmergencyContact: (c: EmergencyContact) => void;
  deleteEmergencyContact: (id: string) => void;
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;
  gallery: GalleryItem[];
  addToGallery: (item: GalleryItem) => void;
  deleteFromGallery: (id: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  goBack: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
  toastMessage: { msg: string, type: 'success' | 'error' } | null;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialUser: User = {
  name: '',
  gender: Gender.MALE,
  age: '',
  dob: '',
  phone: '',
  email: ''
};

const initialCaretaker: Caretaker = {
  name: '',
  gender: Gender.FEMALE,
  age: '',
  relationship: '',
  phone: '',
  email: ''
};

const initialDoctor: Doctor = {
  name: 'Dr. Smith',
  specialist: 'General Physician',
  hospital: 'City Care Hospital',
  phone: '555-0123'
};

// Seed Data for Prototype
const seedMedicines: Medicine[] = [
  { id: '1', name: 'Metformin', dosage: '500mg', timing: [DosageTime.MORNING, DosageTime.NIGHT], startDate: '2023-01-01', endDate: '2025-01-01', instruction: 'After Food' },
  { id: '2', name: 'Aspirin', dosage: '75mg', timing: [DosageTime.AFTERNOON], startDate: '2023-01-01', endDate: '2025-01-01', instruction: 'After Food' }
];

const seedRoutines: RoutineTask[] = [
  { id: '1', title: 'Morning Walk', status: RoutineStatus.PENDING, timeOfDay: '7:00 AM' },
  { id: '2', title: 'Breakfast', status: RoutineStatus.DONE, timeOfDay: '8:30 AM' },
  { id: '3', title: 'Check BP', status: RoutineStatus.PENDING, timeOfDay: '10:00 AM' },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>(ScreenName.LANDING);
  const [history, setHistory] = useState<ScreenName[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, updateUserState] = useState<User>(initialUser);
  const [caretaker, updateCaretakerState] = useState<Caretaker>(initialCaretaker);
  const [doctor, updateDoctorState] = useState<Doctor>(initialDoctor);
  const [medicines, setMedicines] = useState<Medicine[]>(seedMedicines);
  const [medicineLogs, setMedicineLogs] = useState<MedicineLogEntry[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [routines, setRoutines] = useState<RoutineTask[]>(seedRoutines);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { id: '1', name: 'Son (John)', relationship: 'Son', phone: '555-0199' },
    { id: '2', name: 'City Ambulance', relationship: 'Emergency', phone: '911' },
  ]);
  const [toastMessage, setToastMessage] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

  const [settings, setSettings] = useState<AppSettings>({
    theme: 'system',
    fontScale: 'lg',
    language: 'English',
    backgroundImage: null,
    notifications: { 
      ringtone: 'Chime', 
      vibration: true, 
      voiceAlerts: true, 
      fullScreen: true,
      smsAlerts: false,
      emailAlerts: true,
      medicationReminder: true,
      appointmentReminder: true,
      refillReminder: true,
      soundDuration: '15 seconds',
      snoozeDuration: '5 minutes',
      apptReminderTiming: '1 day before',
      caretakerMissedTiming: '30 minutes',
      refillReminderTiming: '3 days before'
    }
  });

  // Generate logs for today based on medicines
  useEffect(() => {
    if (medicineLogs.length === 0 && medicines.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const newLogs: MedicineLogEntry[] = [];
      medicines.forEach(med => {
        med.timing.forEach(time => {
          newLogs.push({
            id: Math.random().toString(36).substr(2, 9),
            medicineId: med.id,
            medicineName: med.name,
            date: today,
            timeSlot: time,
            status: MedicineStatus.PENDING
          });
        });
      });
      setMedicineLogs(newLogs);
    }
  }, [medicines, medicineLogs.length]);

  const navigateTo = (screen: ScreenName) => {
    setHistory(prev => [...prev, currentScreen]);
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(prevHist => prevHist.slice(0, -1));
      setCurrentScreen(prev);
    }
  };

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const t = (key: string) => getTranslation(settings.language, key);

  const updateUser = (u: User) => updateUserState(u);
  const updateCaretaker = (c: Caretaker) => updateCaretakerState(c);
  const updateDoctor = (d: Doctor) => updateDoctorState(d);

  const addMedicine = (m: Medicine) => setMedicines([...medicines, m]);
  const deleteMedicine = (id: string) => setMedicines(medicines.filter(m => m.id !== id));

  const updateLogStatus = (id: string, status: MedicineStatus) => {
    setMedicineLogs(logs => logs.map(l => l.id === id ? { ...l, status, timestamp: new Date().toISOString() } : l));
  };

  const addAppointment = (a: Appointment) => setAppointments([...appointments, a]);
  const deleteAppointment = (id: string) => setAppointments(appointments.filter(a => a.id !== id));

  const updateRoutineStatus = (id: string, status: RoutineStatus) => {
    setRoutines(r => r.map(t => t.id === id ? { ...t, status } : t));
  };
  const addRoutine = (t: RoutineTask) => setRoutines([...routines, t]);

  const addToGallery = (item: GalleryItem) => setGallery(prev => [item, ...prev]);
  const deleteFromGallery = (id: string) => setGallery(prev => prev.filter(i => i.id !== id));
  
  const addEmergencyContact = (c: EmergencyContact) => setEmergencyContacts([...emergencyContacts, c]);
  const deleteEmergencyContact = (id: string) => setEmergencyContacts(emergencyContacts.filter(c => c.id !== id));

  const updateSettings = (s: Partial<AppSettings>) => setSettings({ ...settings, ...s });

  return (
    <AppContext.Provider value={{
      currentScreen, navigateTo, goBack, isLoggedIn, setIsLoggedIn,
      user, updateUser, caretaker, updateCaretaker, doctor, updateDoctor,
      medicines, addMedicine, deleteMedicine,
      medicineLogs, updateLogStatus,
      appointments, addAppointment, deleteAppointment,
      routines, updateRoutineStatus, addRoutine,
      gallery, addToGallery, deleteFromGallery,
      emergencyContacts, addEmergencyContact, deleteEmergencyContact,
      settings, updateSettings,
      showToast, toastMessage, t
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppStore must be used within AppProvider");
  return context;
};
