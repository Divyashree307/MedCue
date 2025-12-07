
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Card, Header, PageContainer } from '../components/Components';
import { ScreenName, MedicineStatus, GalleryItem } from '../types';
import { Activity, Calendar, Phone, Pill, Camera, Images } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { medicineLogs, updateLogStatus, navigateTo, user, addToGallery, t } = useAppStore();
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  const todayLogs = medicineLogs.filter(log => log.date === filterDate);
  
  // Sort logs: Missed first (Urgent), then Pending, then Taken
  const sortedLogs = [...todayLogs].sort((a, b) => {
    const score = (status: MedicineStatus) => {
      if (status === MedicineStatus.MISSED) return 0;
      if (status === MedicineStatus.PENDING) return 1;
      return 2;
    };
    return score(a.status) - score(b.status);
  });

  const getStatusColor = (status: MedicineStatus) => {
    switch(status) {
      case MedicineStatus.TAKEN: return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
      case MedicineStatus.MISSED: return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
      default: return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
    }
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const newItem: GalleryItem = {
          id: Date.now().toString(),
          imageData: base64String,
          timestamp: new Date().toISOString()
        };
        addToGallery(newItem);
        alert("Photo saved to Med Gallery!");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <PageContainer>
      <Header title={`${t('hello')}, ${user.name.split(' ')[0] || 'User'}`} showProfile={true} />
      
      <div className="p-4 space-y-6">
        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card onClick={() => navigateTo(ScreenName.MEDICINE_SCHEDULE)} className="flex flex-col items-center justify-center p-4 active:bg-slate-50 dark:active:bg-slate-800">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2">
              <Pill size={24} />
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-200">{t('medicines')}</span>
          </Card>
          <Card onClick={() => navigateTo(ScreenName.EMERGENCY)} className="flex flex-col items-center justify-center p-4 active:bg-slate-50 dark:active:bg-slate-800 border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mb-2">
              <Phone size={24} />
            </div>
            <span className="font-semibold text-red-700 dark:text-red-400">{t('emergency')}</span>
          </Card>
           <Card onClick={() => navigateTo(ScreenName.APPOINTMENTS)} className="flex flex-col items-center justify-center p-4 active:bg-slate-50 dark:active:bg-slate-800">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 mb-2">
              <Calendar size={24} />
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-200">{t('doctors')}</span>
          </Card>
           <Card onClick={() => navigateTo(ScreenName.SYMPTOMS)} className="flex flex-col items-center justify-center p-4 active:bg-slate-50 dark:active:bg-slate-800">
            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-400 mb-2">
              <Activity size={24} />
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-200">{t('symptoms')}</span>
          </Card>
        </div>

        {/* Camera Section */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2 relative">
             <input 
                type="file" 
                accept="image/*" 
                capture="environment" 
                className="absolute inset-0 opacity-0 z-10 w-full h-full cursor-pointer"
                onChange={handleCameraCapture}
             />
             <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 text-white rounded-2xl p-4 shadow-lg shadow-blue-200 dark:shadow-none flex items-center justify-center gap-3 h-full">
                <Camera size={28} />
                <span className="font-bold text-lg">{t('verify_pill')}</span>
             </div>
          </div>
          <button 
             onClick={() => navigateTo(ScreenName.MED_GALLERY)}
             className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl p-4 flex flex-col items-center justify-center active:bg-slate-50 dark:active:bg-slate-700"
          >
             <Images size={24} className="mb-1" />
             <span className="text-xs font-bold">{t('gallery')}</span>
          </button>
        </div>

        {/* Daily Schedule */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('daily_schedule')}</h2>
            <input 
              type="date" 
              value={filterDate} 
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg px-2 py-1 text-sm font-medium text-slate-700 dark:text-slate-200"
            />
          </div>

          <div className="space-y-3">
            {sortedLogs.length === 0 ? (
              <div className="text-center p-8 text-slate-400">No medicines scheduled for this date.</div>
            ) : (
              sortedLogs.map(log => (
                <Card key={log.id} className={`flex justify-between items-center p-4 border-l-4 ${
                  log.status === MedicineStatus.MISSED ? 'border-l-red-500' : 
                  log.status === MedicineStatus.PENDING ? 'border-l-yellow-500' : 'border-l-green-500'
                }`}>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">{log.medicineName}</h3>
                    <div className="text-sm text-slate-500 dark:text-slate-400 font-medium flex gap-2">
                      <span>{t(log.timeSlot.toLowerCase())}</span>
                      <span>•</span>
                      <span>{log.status}</span>
                    </div>
                  </div>
                  
                  {log.status === MedicineStatus.PENDING && (
                     <button 
                        onClick={() => updateLogStatus(log.id, MedicineStatus.TAKEN)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md active:scale-95"
                     >
                        {t('take')}
                     </button>
                  )}
                  {log.status !== MedicineStatus.PENDING && (
                     <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(log.status)}`}>
                        {log.status}
                     </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
