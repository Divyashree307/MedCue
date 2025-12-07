
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Button, Card, Header, Input, PageContainer, Select, PhoneInput } from '../components/Components';
import { AppSettings, ScreenName, EmergencyContact } from '../types';
import { Bell, Moon, Type, Languages, LogOut, ChevronRight, Check, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';

const validatePhone = (phone: string) => {
  const parts = phone.split(' ');
  if (parts.length < 2) return false;
  return /^\d{10}$/.test(parts[1]);
};

export const ProfileScreen: React.FC = () => {
  const { user, caretaker, doctor, updateUser, updateCaretaker, updateDoctor, setIsLoggedIn, navigateTo, emergencyContacts, addEmergencyContact, deleteEmergencyContact, t } = useAppStore();
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState<Partial<EmergencyContact>>({});
  const [contactError, setContactError] = useState('');

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigateTo(ScreenName.LOGIN);
  };

  const handleAddContact = () => {
    if (!newContact.name) {
      setContactError("Name is required");
      return;
    }
    if (!newContact.phone || !validatePhone(newContact.phone)) {
      setContactError("Phone number does not exist");
      return;
    }

    addEmergencyContact({
      id: Date.now().toString(),
      name: newContact.name,
      relationship: newContact.relationship || 'Friend',
      phone: newContact.phone
    });
    setNewContact({});
    setContactError('');
    setShowAddContact(false);
  };

  const SectionTitle = ({ title }: { title: string }) => (
    <h2 className="text-xl font-bold text-blue-900 dark:text-blue-400 mt-6 mb-3">{title}</h2>
  );

  return (
    <PageContainer>
      <Header title="Profile & Settings" showBack={true} showProfile={false} />
      <div className="p-4 pb-20">
        
        {/* Settings Links */}
        <Card className="mb-6 p-0 overflow-hidden">
           <button onClick={() => navigateTo(ScreenName.NOTIFICATIONS)} className="w-full flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700 active:bg-slate-50 dark:active:bg-slate-700 transition-colors">
              <div className="flex items-center gap-3"><Bell className="text-blue-500"/> <span className="font-bold text-lg text-slate-800 dark:text-slate-200">{t('notifications')}</span></div>
              <ChevronRight className="text-slate-300 dark:text-slate-600" />
           </button>
           <button onClick={() => navigateTo(ScreenName.THEME)} className="w-full flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700 active:bg-slate-50 dark:active:bg-slate-700 transition-colors">
              <div className="flex items-center gap-3"><Moon className="text-purple-500"/> <span className="font-bold text-lg text-slate-800 dark:text-slate-200">{t('theme')}</span></div>
              <ChevronRight className="text-slate-300 dark:text-slate-600" />
           </button>
           <button onClick={() => navigateTo(ScreenName.FONT)} className="w-full flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700 active:bg-slate-50 dark:active:bg-slate-700 transition-colors">
              <div className="flex items-center gap-3"><Type className="text-green-500"/> <span className="font-bold text-lg text-slate-800 dark:text-slate-200">{t('font_size')}</span></div>
              <ChevronRight className="text-slate-300 dark:text-slate-600" />
           </button>
           <button onClick={() => navigateTo(ScreenName.LANGUAGE)} className="w-full flex items-center justify-between p-5 active:bg-slate-50 dark:active:bg-slate-700 transition-colors">
              <div className="flex items-center gap-3"><Languages className="text-orange-500"/> <span className="font-bold text-lg text-slate-800 dark:text-slate-200">{t('language')}</span></div>
              <ChevronRight className="text-slate-300 dark:text-slate-600" />
           </button>
        </Card>

        {/* User Info */}
        <SectionTitle title="My Information" />
        <Card>
          <Input label="Name" value={user.name} onChange={(e) => updateUser({ ...user, name: e.target.value })} />
          <PhoneInput label="Phone" value={user.phone} onChange={(val) => updateUser({ ...user, phone: val })} />
        </Card>

        {/* Caretaker Info */}
        <SectionTitle title="Caretaker Information" />
        <Card>
          <Input label="Name" value={caretaker.name} onChange={(e) => updateCaretaker({ ...caretaker, name: e.target.value })} />
          <PhoneInput label="Phone" value={caretaker.phone} onChange={(val) => updateCaretaker({ ...caretaker, phone: val })} />
          
          <div className="mt-6 border-t border-slate-100 dark:border-slate-700 pt-4">
             <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-3">{t('additional_contacts')}</h3>
             
             <div className="space-y-3 mb-4">
               {emergencyContacts.map(contact => (
                  <div key={contact.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                     <div>
                        <p className="font-bold text-sm dark:text-white">{contact.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{contact.relationship} • {contact.phone}</p>
                     </div>
                     <button onClick={() => deleteEmergencyContact(contact.id)} className="text-red-500 p-2"><Trash2 size={16}/></button>
                  </div>
               ))}
             </div>

             {showAddContact ? (
               <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <Input label={t('name')} value={newContact.name || ''} onChange={e => setNewContact({...newContact, name: e.target.value})} />
                  <Input label={t('relationship')} value={newContact.relationship || ''} onChange={e => setNewContact({...newContact, relationship: e.target.value})} />
                  <PhoneInput label={t('contact_number')} value={newContact.phone || ''} error={contactError} onChange={val => setNewContact({...newContact, phone: val})} />
                  <div className="flex gap-2 mt-2">
                     <Button variant="secondary" onClick={() => setShowAddContact(false)}>Cancel</Button>
                     <Button onClick={handleAddContact}>Save</Button>
                  </div>
               </div>
             ) : (
               <Button variant="secondary" onClick={() => setShowAddContact(true)}>
                  <Plus size={18} /> {t('add_contact')}
               </Button>
             )}
          </div>
        </Card>

        {/* Doctor Info */}
        <SectionTitle title="Doctor Information" />
        <Card>
          <Input label="Doctor Name" value={doctor.name} onChange={(e) => updateDoctor({ ...doctor, name: e.target.value })} />
          <Input label="Specialist" value={doctor.specialist} onChange={(e) => updateDoctor({ ...doctor, specialist: e.target.value })} />
          <Input label="Hospital" value={doctor.hospital} onChange={(e) => updateDoctor({ ...doctor, hospital: e.target.value })} />
          <PhoneInput label="Contact" value={doctor.phone} onChange={(val) => updateDoctor({ ...doctor, phone: val })} />
        </Card>

        <div className="mt-8">
          <Button variant="danger" onClick={handleLogout}>
             <LogOut className="inline mr-2" size={20} /> {t('logout')}
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export const NotificationSettings: React.FC = () => {
  const { settings, updateSettings, showToast, t } = useAppStore();
  const [localSettings, setLocalSettings] = useState(settings.notifications);

  const updateLocal = (key: string, val: any) => setLocalSettings({ ...localSettings, [key]: val });

  const handleSave = () => {
    updateSettings({ notifications: localSettings });
    showToast(t('settings_updated'));
  };

  const ringtones = [
    "Default (Chime)", "Gentle Bell", "Classic Phone", "Flute", "Birds", 
    "Harp", "Piano", "Energizing", "Soft Echo", "Marimba",
    "Zen Garden", "Ocean Waves", "Raindrops", "Cosmic", "Vintage Ring",
    "Sunrise", "Breeze", "Galaxy", "Crystal", "Woodblock"
  ];

  return (
    <PageContainer>
      <Header title="Notification Settings" showBack={true} />
      <div className="p-4 space-y-6">
        
        {/* Ringtone */}
        <Card>
           <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><Bell className="text-blue-500" size={20}/> Ringtone</h3>
           <Select label="Select Ringtone" value={localSettings.ringtone} onChange={e => updateLocal('ringtone', e.target.value)}>
             {ringtones.map(r => <option key={r} value={r}>{r}</option>)}
           </Select>
        </Card>

        {/* Sound Duration */}
        <Card>
           <h3 className="font-bold text-slate-800 dark:text-white mb-4">Notification Sound Duration</h3>
           <Select label="Duration" value={localSettings.soundDuration} onChange={e => updateLocal('soundDuration', e.target.value)}>
             <option value="5 seconds">5 seconds</option>
             <option value="10 seconds">10 seconds</option>
             <option value="15 seconds">15 seconds</option>
             <option value="30 seconds">30 seconds</option>
             <option value="1 minute">1 minute</option>
             <option value="2 minutes">2 minutes</option>
             <option value="5 minutes">5 minutes</option>
           </Select>
        </Card>

        {/* Snooze */}
        <Card>
           <h3 className="font-bold text-slate-800 dark:text-white mb-4">Snooze Duration</h3>
           <Select label="Time" value={localSettings.snoozeDuration} onChange={e => updateLocal('snoozeDuration', e.target.value)}>
             <option value="1 minute">1 minute</option>
             <option value="3 minutes">3 minutes</option>
             <option value="5 minutes">5 minutes</option>
             <option value="10 minutes">10 minutes</option>
           </Select>
        </Card>

        {/* Appointment Reminders */}
        <Card>
           <h3 className="font-bold text-slate-800 dark:text-white mb-4">Appointment Reminders</h3>
           <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">When should we remind you of upcoming appointments?</p>
           <Select label="Reminder Timing" value={localSettings.apptReminderTiming} onChange={e => updateLocal('apptReminderTiming', e.target.value)}>
             <option value="10 days before">10 days before</option>
             <option value="5 days before">5 days before</option>
             <option value="1 day before">1 day before</option>
             <option value="12 hours before">12 hours before</option>
             <option value="6 hours before">6 hours before</option>
             <option value="2 hours before">2 hours before</option>
           </Select>
        </Card>

        {/* Caretaker Call */}
        <Card>
           <h3 className="font-bold text-slate-800 dark:text-white mb-4">Caretaker Missed Dose Call</h3>
           <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Time after missed dose to alert caretaker:</p>
           <Select label="Timing" value={localSettings.caretakerMissedTiming} onChange={e => updateLocal('caretakerMissedTiming', e.target.value)}>
             <option value="10 minutes">10 minutes</option>
             <option value="15 minutes">15 minutes</option>
             <option value="30 minutes">30 minutes</option>
             <option value="1 hour">1 hour</option>
           </Select>
        </Card>

        {/* Refill Reminder */}
        <Card>
           <h3 className="font-bold text-slate-800 dark:text-white mb-4">Refill Reminder</h3>
           <Select label="Remind me" value={localSettings.refillReminderTiming} onChange={e => updateLocal('refillReminderTiming', e.target.value)}>
             <option value="10 days before">10 days before</option>
             <option value="5 days before">5 days before</option>
             <option value="4 days before">4 days before</option>
             <option value="3 days before">3 days before</option>
             <option value="2 days before">2 days before</option>
             <option value="1 day before">1 day before</option>
           </Select>
        </Card>

        <Button onClick={handleSave}>Save Notification Settings</Button>
      </div>
    </PageContainer>
  );
};

export const ThemeSettings: React.FC = () => {
  const { settings, updateSettings, showToast, t } = useAppStore();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        updateSettings({ backgroundImage: result });
        showToast("Background Updated");
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    updateSettings({ backgroundImage: null });
    showToast("Background Removed");
  }

  return (
    <PageContainer>
      <Header title={t('theme')} showBack={true} />
      <div className="p-4">
        <Card className="space-y-4">
          {['system', 'light', 'dark'].map(tVal => (
            <button 
              key={tVal}
              onClick={() => updateSettings({ theme: tVal as any })}
              className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${
                settings.theme === tVal 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300' 
                : 'border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="capitalize text-lg font-bold">{tVal} Default</span>
            </button>
          ))}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
             <div className="flex items-center gap-2 mb-3">
               <ImageIcon className="text-slate-500" />
               <h3 className="font-medium text-slate-800 dark:text-slate-200">Custom Background Image</h3>
             </div>
             
             <div className="relative">
               <input 
                 type="file" 
                 accept="image/*"
                 onChange={handleImageUpload}
                 className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-300 transition-all"
               />
             </div>
             
             {settings.backgroundImage && (
                <div className="mt-4">
                  <div className="mb-4 h-32 rounded-lg overflow-hidden border border-slate-200">
                    <img src={settings.backgroundImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <Button variant="danger" onClick={clearImage}>Remove Background Image</Button>
                </div>
             )}
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export const FontSettings: React.FC = () => {
  const { settings, updateSettings, t } = useAppStore();
  const sizes: AppSettings['fontScale'][] = ['sm', 'md', 'lg', 'xl'];
  
  return (
    <PageContainer>
      <Header title={t('font_size')} showBack={true} />
      <div className="p-4">
        <Card>
           <div className="flex justify-between items-center mb-8 px-2 text-slate-800 dark:text-white">
             <span className="text-sm">A</span>
             <span className="text-3xl font-bold">A</span>
           </div>
           <input 
             type="range" 
             min="0" 
             max="3" 
             value={sizes.indexOf(settings.fontScale)} 
             onChange={(e) => updateSettings({ fontScale: sizes[parseInt(e.target.value)] })}
             className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
           />
           <p className="mt-8 text-center text-slate-500 dark:text-slate-400">
             Drag the slider to change text size.
           </p>
           <div className={`mt-4 p-4 border rounded bg-slate-50 dark:bg-slate-900 dark:border-slate-700 text-slate-800 dark:text-white`}>
              Sample Text: Medicine Reminder at 8:00 PM.
           </div>
        </Card>
      </div>
    </PageContainer>
  );
};

const LANGUAGES = [
  "English", "Español (Spanish)", "Français (French)", "Deutsch (German)", 
  "中文 (Chinese)", "हिन्दी (Hindi)", "العربية (Arabic)", "Português (Portuguese)", 
  "Русский (Russian)", "日本語 (Japanese)", "Italiano (Italian)", "한국어 (Korean)",
  "தமிழ் (Tamil)", "తెలుగు (Telugu)", "বাংলা (Bengali)", "اردو (Urdu)"
];

export const LanguageSettings: React.FC = () => {
  const { settings, updateSettings, showToast, t } = useAppStore();

  const handleSelect = (lang: string) => {
    updateSettings({ language: lang });
    setTimeout(() => {
        showToast("Language changed");
    }, 100);
  };

  return (
    <PageContainer>
      <Header title={t('language')} showBack={true} />
      <div className="p-4">
         <Card className="divide-y divide-slate-100 dark:divide-slate-700">
            {LANGUAGES.map(lang => (
              <div 
                key={lang} 
                onClick={() => handleSelect(lang)} 
                className={`flex justify-between items-center p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                  settings.language === lang ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                }`}
              >
                 <span className={`font-medium ${settings.language === lang ? 'text-blue-800 dark:text-blue-300 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                   {lang}
                 </span>
                 {settings.language === lang && <Check className="text-blue-600 dark:text-blue-400" size={20} />}
              </div>
            ))}
         </Card>
      </div>
    </PageContainer>
  );
};
