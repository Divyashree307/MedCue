import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Button, Card, Header, Input, PageContainer } from '../components/Components';
import { Appointment, RoutineStatus, RoutineTask } from '../types';
import { Trash2, Plus, Phone, AlertTriangle, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { analyzeSymptoms } from '../services/geminiService';

// --- APPOINTMENTS SCREEN ---
export const AppointmentScreen: React.FC = () => {
  const { appointments, addAppointment, deleteAppointment } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newAppt, setNewAppt] = useState<Partial<Appointment>>({});

  const handleSave = () => {
    if (newAppt.doctorName && newAppt.date) {
      addAppointment({
        id: Date.now().toString(),
        doctorName: newAppt.doctorName,
        specialist: newAppt.specialist || '',
        hospital: newAppt.hospital || '',
        date: newAppt.date,
        time: newAppt.time || '',
        reason: newAppt.reason || '',
        instructions: newAppt.instructions || '',
      });
      setShowAdd(false);
      setNewAppt({});
    }
  };

  if (showAdd) {
    return (
      <PageContainer>
        <Header title="New Appointment" showBack={true} />
        <div className="p-4">
          <Card className="space-y-4">
            <Input label="Doctor Name" value={newAppt.doctorName || ''} onChange={e => setNewAppt({...newAppt, doctorName: e.target.value})} />
            <Input label="Specialist" value={newAppt.specialist || ''} onChange={e => setNewAppt({...newAppt, specialist: e.target.value})} />
            <Input label="Hospital" value={newAppt.hospital || ''} onChange={e => setNewAppt({...newAppt, hospital: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
               <Input type="date" label="Date" value={newAppt.date || ''} onChange={e => setNewAppt({...newAppt, date: e.target.value})} />
               <Input type="time" label="Time" value={newAppt.time || ''} onChange={e => setNewAppt({...newAppt, time: e.target.value})} />
            </div>
            <Input label="Reason" value={newAppt.reason || ''} onChange={e => setNewAppt({...newAppt, reason: e.target.value})} />
            
            {/* Mock File Upload */}
            <div className="mb-4">
               <label className="block text-slate-600 dark:text-slate-300 font-medium mb-2 ml-1">Upload Reports</label>
               <input type="file" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100"/>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </Card>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header title="Appointments" showBack={true} />
      <div className="p-4 space-y-4">
        {appointments.map(appt => (
          <Card key={appt.id} className="relative">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">{appt.doctorName}</h3>
            <p className="text-blue-600 dark:text-blue-400 font-medium">{appt.specialist}</p>
            <div className="mt-2 text-slate-600 dark:text-slate-400">
               <p>{appt.hospital}</p>
               <p className="font-bold">{appt.date} at {appt.time}</p>
            </div>
            <button onClick={() => deleteAppointment(appt.id)} className="absolute top-4 right-4 p-2 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-full">
              <Trash2 size={18} />
            </button>
          </Card>
        ))}
        {appointments.length === 0 && <div className="text-center text-slate-400 py-8">No appointments scheduled.</div>}
        <Button onClick={() => setShowAdd(true)}><Plus size={20} /> Add Appointment</Button>
      </div>
    </PageContainer>
  );
};

// --- ROUTINE SCREEN ---
export const RoutineScreen: React.FC = () => {
  const { routines, updateRoutineStatus, addRoutine, t } = useAppStore();
  const [newRoutineTitle, setNewRoutineTitle] = useState('');

  const handleAdd = () => {
    if(newRoutineTitle) {
      addRoutine({
        id: Date.now().toString(),
        title: newRoutineTitle,
        status: RoutineStatus.PENDING,
        timeOfDay: 'Anytime'
      });
      setNewRoutineTitle('');
    }
  };

  return (
    <PageContainer>
      <Header title={t('my_routine')} showBack={false} />
      <div className="p-4">
        <div className="mb-6 flex gap-2">
           <input 
              type="text" 
              placeholder={t('add_new_routine')} 
              value={newRoutineTitle}
              onChange={e => setNewRoutineTitle(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
           />
           <button onClick={handleAdd} className="bg-blue-600 text-white px-4 rounded-xl"><Plus/></button>
        </div>

        <div className="space-y-4">
          {routines.map(task => (
            <Card key={task.id} className="flex items-center justify-between p-4">
              <div>
                <h3 className={`text-lg font-bold ${task.status === RoutineStatus.DONE ? 'text-slate-400 dark:text-slate-600 line-through' : 'text-slate-800 dark:text-white'}`}>
                  {task.title}
                </h3>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {task.timeOfDay === 'Anytime' ? t('anytime') : task.timeOfDay}
                </span>
              </div>
              <div className="flex gap-2">
                 {task.status !== RoutineStatus.DONE && (
                   <button onClick={() => updateRoutineStatus(task.id, RoutineStatus.DONE)} className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full"><CheckCircle /></button>
                 )}
                 {task.status === RoutineStatus.PENDING && (
                   <button onClick={() => updateRoutineStatus(task.id, RoutineStatus.INCOMPLETE)} className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full"><XCircle /></button>
                 )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

// --- EMERGENCY SCREEN ---
export const EmergencyScreen: React.FC = () => {
  const { emergencyContacts, caretaker } = useAppStore();

  return (
    <PageContainer className="bg-red-50 dark:bg-red-950/20">
      <Header title="Emergency" showBack={true} />
      <div className="p-4 space-y-4">
        <div className="bg-red-100 dark:bg-red-900/40 border border-red-200 dark:border-red-800 p-4 rounded-2xl flex items-center gap-4 mb-6">
           <AlertTriangle size={32} className="text-red-600 dark:text-red-400" />
           <p className="text-red-800 dark:text-red-200 font-medium">Tap any button below to call immediately.</p>
        </div>

        <Card className="flex items-center justify-between border-l-4 border-l-red-500">
           <div>
              <h3 className="font-bold text-xl text-slate-800 dark:text-white">Ambulance</h3>
              <p className="text-slate-500 dark:text-slate-400">Medical Emergency</p>
           </div>
           <a href="tel:911" className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-300 dark:shadow-none animate-pulse">
              <Phone size={24} fill="currentColor" />
           </a>
        </Card>

        {/* Caretaker */}
        <Card className="flex items-center justify-between">
           <div>
              <h3 className="font-bold text-xl text-slate-800 dark:text-white">{caretaker.name}</h3>
              <p className="text-slate-500 dark:text-slate-400">{caretaker.relationship} (Caretaker)</p>
           </div>
           <a href={`tel:${caretaker.phone}`} className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-200 dark:shadow-none">
              <Phone size={24} fill="currentColor" />
           </a>
        </Card>

        {emergencyContacts.map(contact => (
           <Card key={contact.id} className="flex items-center justify-between">
            <div>
                <h3 className="font-bold text-xl text-slate-800 dark:text-white">{contact.name}</h3>
                <p className="text-slate-500 dark:text-slate-400">{contact.relationship}</p>
            </div>
            <a href={`tel:${contact.phone}`} className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200 dark:shadow-none">
                <Phone size={24} fill="currentColor" />
            </a>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
};

// --- SYMPTOM ANALYSIS SCREEN (GEMINI) ---
export const SymptomAnalysisScreen: React.FC = () => {
  const { user } = useAppStore();
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!symptoms) return;
    setLoading(true);
    setResult('');
    
    const analysis = await analyzeSymptoms(symptoms, user.age, user.gender);
    setResult(analysis);
    setLoading(false);
  };

  return (
    <PageContainer>
      <Header title="Check Symptoms" showBack={true} />
      <div className="p-4">
        <Card className="mb-6">
          <textarea 
            className="w-full h-32 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl outline-none text-lg resize-none focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            placeholder="Describe what you are feeling... (e.g. headache, dizziness)"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />
        </Card>
        
        <Button onClick={handleAnalyze} disabled={loading} className="mb-8">
          {loading ? 'Analyzing...' : 'Analyze Symptoms'}
        </Button>

        {result && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
             <div className="flex items-center gap-2 mb-4 text-blue-700 dark:text-blue-400">
                <FileText />
                <h2 className="text-xl font-bold">Analysis Result</h2>
             </div>
             <div className="prose prose-lg text-slate-700 dark:text-slate-300 mb-6 whitespace-pre-wrap leading-relaxed">
                {result}
             </div>
             
             <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-200 text-sm">
                <strong>Disclaimer:</strong> This is AI-generated and may produce false detections. This is NOT a medical diagnosis. Always consult a real doctor for any health concerns.
             </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};