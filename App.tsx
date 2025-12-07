
import React, { useEffect } from 'react';
import { useAppStore } from './store';
import { ScreenName } from './types';
import { BottomNav, Toast } from './components/Components';
import { LoginScreen, OTPScreen, CaretakerScreen, LandingScreen } from './screens/AuthScreens';
import { Dashboard } from './screens/Dashboard';
import { MedicineScheduleScreen, LogScreen } from './screens/Medicine';
import { MedGalleryScreen } from './screens/Gallery';
import { AppointmentScreen, RoutineScreen, EmergencyScreen, SymptomAnalysisScreen } from './screens/Features';
import { ProfileScreen, NotificationSettings, ThemeSettings, FontSettings, LanguageSettings } from './screens/Settings';

const App: React.FC = () => {
  const { currentScreen, settings, toastMessage } = useAppStore();

  // Apply Font Scaling, Theme, and Background Image
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    
    // Theme Logic
    if (settings.theme === 'dark') {
      html.classList.add('dark');
    } else if (settings.theme === 'light') {
      html.classList.remove('dark');
    } else if (settings.theme === 'system') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    }

    // Font Sizing Logic (Scaling the root font size scales all rem units)
    if (settings.fontScale === 'sm') html.style.fontSize = '14px';
    else if (settings.fontScale === 'md') html.style.fontSize = '16px';
    else if (settings.fontScale === 'lg') html.style.fontSize = '19px';
    else if (settings.fontScale === 'xl') html.style.fontSize = '22px';

    // Background Image Logic
    if (settings.backgroundImage) {
      body.style.backgroundImage = `url(${settings.backgroundImage})`;
      body.style.backgroundSize = 'cover';
      body.style.backgroundPosition = 'center';
      body.style.backgroundAttachment = 'fixed';
      body.style.backgroundRepeat = 'no-repeat';
    } else {
      body.style.backgroundImage = '';
      body.style.backgroundSize = '';
      body.style.backgroundPosition = '';
      body.style.backgroundAttachment = '';
      body.style.backgroundRepeat = '';
    }

  }, [settings.fontScale, settings.theme, settings.backgroundImage]);

  const renderScreen = () => {
    switch (currentScreen) {
      case ScreenName.LANDING: return <LandingScreen />;
      case ScreenName.LOGIN: return <LoginScreen />;
      case ScreenName.OTP: return <OTPScreen />;
      case ScreenName.CARETAKER_INFO: return <CaretakerScreen />;
      case ScreenName.DASHBOARD: return <Dashboard />;
      case ScreenName.MEDICINE_SCHEDULE: return <MedicineScheduleScreen />;
      case ScreenName.LOG: return <LogScreen />;
      case ScreenName.MED_GALLERY: return <MedGalleryScreen />;
      case ScreenName.APPOINTMENTS: return <AppointmentScreen />;
      case ScreenName.ROUTINE: return <RoutineScreen />;
      case ScreenName.EMERGENCY: return <EmergencyScreen />;
      case ScreenName.SYMPTOMS: return <SymptomAnalysisScreen />;
      case ScreenName.PROFILE: return <ProfileScreen />;
      case ScreenName.NOTIFICATIONS: return <NotificationSettings />;
      case ScreenName.THEME: return <ThemeSettings />;
      case ScreenName.FONT: return <FontSettings />;
      case ScreenName.LANGUAGE: return <LanguageSettings />;
      default: return <LandingScreen />;
    }
  };

  return (
    <>
      {renderScreen()}
      <BottomNav />
      <Toast message={toastMessage?.msg || null} />
    </>
  );
};

export default App;
