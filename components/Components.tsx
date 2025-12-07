
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { ChevronLeft, Home, Calendar, ClipboardList, Activity, Phone, Settings, User as UserIcon, Check, ChevronDown } from 'lucide-react';
import { ScreenName } from '../types';

export const Card: React.FC<{ children: React.ReactNode, className?: string, onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-5 border border-slate-100 dark:border-slate-700 transition-colors ${className}`}>
    {children}
  </div>
);

export const Button: React.FC<{ 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'danger' | 'success'; 
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}> = ({ children, onClick, variant = 'primary', className = '', type="button", disabled=false }) => {
  const baseStyle = "w-full py-4 rounded-xl font-bold text-center transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white shadow-lg shadow-blue-200 dark:shadow-none",
    secondary: "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-600",
    danger: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800",
    success: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
  };

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string, error?: string }> = ({ label, error, className = '', ...props }) => (
  <div className="mb-4">
    <label className="block text-slate-600 dark:text-slate-300 font-medium mb-2 ml-1">{label}</label>
    <input 
      className={`w-full h-14 px-4 rounded-xl border-2 outline-none text-slate-900 dark:text-white bg-white dark:bg-slate-900 transition-colors ${
        error 
        ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/30' 
        : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30'
      } ${className}`}
      {...props}
    />
    {error && <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>}
  </div>
);

const COUNTRY_CODES = [
  { code: '+1', country: 'USA/CA' },
  { code: '+91', country: 'India' },
  { code: '+44', country: 'UK' },
  { code: '+61', country: 'Australia' },
  { code: '+81', country: 'Japan' },
  { code: '+86', country: 'China' },
  { code: '+49', country: 'Germany' },
  { code: '+33', country: 'France' },
  { code: '+971', country: 'UAE' },
];

export const PhoneInput: React.FC<{ 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
  error?: string;
}> = ({ label, value, onChange, error }) => {
  // Extract code and number from value string like "+91 9876543210"
  const [selectedCode, setSelectedCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (value) {
      const parts = value.split(' ');
      if (parts.length > 1 && parts[0].startsWith('+')) {
        setSelectedCode(parts[0]);
        setPhoneNumber(parts.slice(1).join(' '));
      } else {
        setPhoneNumber(value);
      }
    }
  }, [value]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value;
    setSelectedCode(newCode);
    onChange(`${newCode} ${phoneNumber}`);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = e.target.value.replace(/\D/g, '').slice(0, 10); // Only digits, max 10
    setPhoneNumber(num);
    onChange(`${selectedCode} ${num}`);
  };

  return (
    <div className="mb-4">
      <label className="block text-slate-600 dark:text-slate-300 font-medium mb-2 ml-1">{label}</label>
      <div className="flex gap-2">
        <div className="relative w-24 flex-shrink-0">
          <select 
            value={selectedCode} 
            onChange={handleCodeChange}
            className="w-full h-14 pl-3 pr-8 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white appearance-none outline-none focus:border-blue-500"
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code}>{c.code}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-500">
            <ChevronDown size={16} />
          </div>
        </div>
        <input 
          type="tel"
          placeholder="1234567890"
          value={phoneNumber}
          onChange={handleNumberChange}
          className={`flex-1 h-14 px-4 rounded-xl border-2 outline-none text-slate-900 dark:text-white bg-white dark:bg-slate-900 transition-colors ${
            error 
            ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/30' 
            : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30'
          }`}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>}
    </div>
  );
};

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string, error?: string }> = ({ label, children, error, ...props }) => (
  <div className="mb-4">
    <label className="block text-slate-600 dark:text-slate-300 font-medium mb-2 ml-1">{label}</label>
    <div className="relative">
      <select 
        className={`w-full h-14 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none text-slate-900 dark:text-white bg-white dark:bg-slate-900 appearance-none transition-colors ${error ? 'border-red-500' : ''}`}
        {...props}
      >
        {children}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
        <ChevronDown size={18} />
      </div>
    </div>
    {error && <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>}
  </div>
);

export const BottomNav: React.FC = () => {
  const { navigateTo, currentScreen, t } = useAppStore();
  
  const navItems = [
    { icon: Home, label: t('dashboard'), screen: ScreenName.DASHBOARD },
    { icon: Calendar, label: t('medicines'), screen: ScreenName.MEDICINE_SCHEDULE },
    { icon: ClipboardList, label: t('log'), screen: ScreenName.LOG },
    { icon: Activity, label: t('routine'), screen: ScreenName.ROUTINE },
    { icon: Settings, label: t('more'), screen: ScreenName.PROFILE },
  ];

  if ([ScreenName.LOGIN, ScreenName.OTP, ScreenName.CARETAKER_INFO].includes(currentScreen)) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-2 pb-6 flex justify-between items-center z-50 transition-colors">
      {navItems.map((item) => (
        <button 
          key={item.label}
          onClick={() => navigateTo(item.screen)}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${currentScreen === item.screen ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <item.icon size={24} strokeWidth={2.5} />
          <span className="text-xs font-bold mt-1">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export const Header: React.FC<{ title: string, showBack?: boolean, showProfile?: boolean }> = ({ title, showBack = false, showProfile = true }) => {
  const { goBack, navigateTo, user } = useAppStore();
  
  return (
    <header className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-40 px-4 py-4 shadow-sm border-b border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        {showBack && (
          <button onClick={goBack} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <ChevronLeft size={24} className="text-slate-700 dark:text-slate-200" />
          </button>
        )}
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h1>
      </div>
      {showProfile && (
        <button onClick={() => navigateTo(ScreenName.PROFILE)} className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold transition-colors">
             {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={20} />}
          </div>
        </button>
      )}
    </header>
  );
};

export const PageContainer: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => {
  const { settings } = useAppStore();
  // Make background transparent if a custom background image is set, otherwise use theme colors
  const bgClass = settings.backgroundImage 
    ? 'bg-transparent' 
    : 'bg-slate-50 dark:bg-slate-950';

  return (
    <div className={`min-h-screen pb-24 transition-colors ${bgClass} ${className}`}>
      {children}
    </div>
  );
};

export const Toast: React.FC<{ message: string | null }> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-slate-800 dark:bg-slate-700 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 z-50 animate-bounce">
      <Check size={18} className="text-green-400" />
      <span className="font-bold text-sm">{message}</span>
    </div>
  );
};
