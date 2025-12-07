
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Button, Card, Header, Input, PageContainer, Select } from '../components/Components';
import { Medicine, DosageTime, MedicineStatus } from '../types';
import { Trash2, Plus } from 'lucide-react';

export const MedicineScheduleScreen: React.FC = () => {
  const { medicines, addMedicine, deleteMedicine, t } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newMed, setNewMed] = useState<Partial<Medicine>>({
    name: '', dosage: '', timing: [], startDate: '', endDate: '', instruction: 'After Food'
  });

  const toggleTiming = (t: DosageTime) => {
    const current = newMed.timing || [];
    if (current.includes(t)) {
      setNewMed({ ...newMed, timing: current.filter(x => x !== t) });
    } else {
      setNewMed({ ...newMed, timing: [...current, t] });
    }
  };

  const handleSave = () => {
    if (newMed.name && newMed.dosage && newMed.startDate) {
      addMedicine({
        id: Date.now().toString(),
        name: newMed.name,
        dosage: newMed.dosage,
        timing: newMed.timing || [],
        startDate: newMed.startDate,
        endDate: newMed.endDate || '',
        instruction: newMed.instruction as any
      });
      setShowAdd(false);
      setNewMed({ name: '', dosage: '', timing: [], startDate: '', endDate: '', instruction: 'After Food' });
    }
  };

  if (showAdd) {
    return (
      <PageContainer>
        <Header title={t('add_medicine')} showBack={true} />
        <div className="p-4">
          <Card className="space-y-4">
            <Input label="Tablet Name" value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} />
            <Input label="Dosage (e.g. 500mg)" value={newMed.dosage} onChange={e => setNewMed({...newMed, dosage: e.target.value})} />
            
            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-medium mb-2 ml-1">Timing</label>
              <div className="flex gap-2">
                {[DosageTime.MORNING, DosageTime.AFTERNOON, DosageTime.NIGHT].map(time => (
                  <button 
                    key={time}
                    onClick={() => toggleTiming(time)}
                    className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${
                      newMed.timing?.includes(time) 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                      : 'border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {t(time.toLowerCase())}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <Input type="date" label="Start Date" value={newMed.startDate} onChange={e => setNewMed({...newMed, startDate: e.target.value})} />
               <Input type="date" label="End Date" value={newMed.endDate} onChange={e => setNewMed({...newMed, endDate: e.target.value})} />
            </div>

            <Select label="Instruction" value={newMed.instruction} onChange={e => setNewMed({...newMed, instruction: e.target.value as any})}>
              <option value="Before Food">{t('before_food')}</option>
              <option value="After Food">{t('after_food')}</option>
            </Select>

            <div className="flex gap-3 pt-4">
              <Button variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Medicine</Button>
            </div>
          </Card>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header title={t('medicines')} showBack={true} />
      <div className="p-4 space-y-4">
        {medicines.map(med => (
          <Card key={med.id} className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{med.name}</h3>
              <p className="text-slate-500 dark:text-slate-400">{med.dosage} • {t(med.instruction.toLowerCase().replace(' ', '_'))}</p>
              <div className="flex gap-2 mt-2">
                {med.timing.map(time => (
                   <span key={time} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-md font-bold uppercase">{t(time.toLowerCase())}</span>
                ))}
              </div>
            </div>
            <button onClick={() => deleteMedicine(med.id)} className="p-3 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-full">
              <Trash2 size={20} />
            </button>
          </Card>
        ))}
        
        <Button onClick={() => setShowAdd(true)} className="mt-6">
          <Plus size={20} /> {t('add_medicine')}
        </Button>
      </div>
    </PageContainer>
  );
};

export const LogScreen: React.FC = () => {
  const { medicineLogs, updateLogStatus, t } = useAppStore();
  const [activeTab, setActiveTab] = useState<MedicineStatus>(MedicineStatus.PENDING);

  // Filter logs based on tab
  const filteredLogs = medicineLogs.filter(log => log.status === activeTab);

  const TabButton = ({ status, label, colorClass }: { status: MedicineStatus, label: string, colorClass: string }) => (
    <button 
      onClick={() => setActiveTab(status)}
      className={`flex-1 py-3 rounded-full font-bold text-sm transition-all ${
        activeTab === status 
          ? `${colorClass} text-white shadow-md transform scale-105` 
          : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
      }`}
    >
      {label}
    </button>
  );

  return (
    <PageContainer>
      <Header title={t('log')} showBack={false} />
      <div className="p-4">
        
        {/* Tab Buttons */}
        <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-full">
          <TabButton status={MedicineStatus.PENDING} label={t('pending')} colorClass="bg-yellow-500" />
          <TabButton status={MedicineStatus.TAKEN} label={t('taken')} colorClass="bg-green-600" />
          <TabButton status={MedicineStatus.MISSED} label={t('missed')} colorClass="bg-red-600" />
        </div>

        <div className="space-y-4">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-10">
               <div className="inline-block p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-2 text-slate-400">
                  {activeTab === MedicineStatus.PENDING ? '🎉' : '📂'}
               </div>
               <p className="text-slate-400 font-medium">No items in {activeTab.toLowerCase()} list.</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <Card key={log.id} className="flex justify-between items-center border-l-4 border-l-slate-300 dark:border-l-slate-600">
                 <div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">{log.medicineName}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t(log.timeSlot.toLowerCase())} • {log.date}</p>
                 </div>
                 
                 {/* Action Buttons based on context */}
                 {activeTab === MedicineStatus.PENDING && (
                    <div className="flex gap-2">
                       <button onClick={() => updateLogStatus(log.id, MedicineStatus.TAKEN)} className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-2 rounded-lg font-bold text-xs">{t('take')}</button>
                       <button onClick={() => updateLogStatus(log.id, MedicineStatus.MISSED)} className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-300 px-3 py-2 rounded-lg font-bold text-xs">MISS</button>
                    </div>
                 )}
                 {activeTab === MedicineStatus.TAKEN && (
                    <span className="text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full text-xs">Done</span>
                 )}
                 {activeTab === MedicineStatus.MISSED && (
                    <button onClick={() => updateLogStatus(log.id, MedicineStatus.TAKEN)} className="text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full text-xs">{t('mark_taken')}</button>
                 )}
              </Card>
            ))
          )}
        </div>
      </div>
    </PageContainer>
  );
};
