
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Button, Card, Input, PageContainer, Select, PhoneInput } from '../components/Components';
import { ScreenName, Gender } from '../types';
import { ChevronRight } from 'lucide-react';

const validateGmail = (email: string) => {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
};

const validatePhone = (phone: string) => {
  // Check if it ends with exactly 10 digits (ignoring country code part which comes before space)
  const parts = phone.split(' ');
  if (parts.length < 2) return false;
  return /^\d{10}$/.test(parts[1]);
};

export const LandingScreen: React.FC = () => {
  const { navigateTo } = useAppStore();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-50 dark:from-slate-950 dark:to-slate-900 transition-colors">
       
       <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
          
          {/* Logo Composition Container */}
          <div className="relative flex flex-col items-center justify-center mb-12">
             
             {/* Combined SVG: Curved Text + Icon */}
             <div className="w-80 h-80 relative flex items-center justify-center">
                <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-xl">
                    {/* 
                       Path for the curved slogan. 
                       M 40,160 starts left-middle.
                       A 110,110 defines the radius of the arc.
                       The arc goes up and lands at 260,160.
                    */}
                    <path id="curvePath" d="M 40,165 A 110,110 0 0,1 260,165" fill="none" />
                    
                    {/* Curved Slogan Text */}
                    <text className="fill-purple-800 dark:fill-purple-300 font-bold tracking-wider" style={{ fontSize: '19px', fontWeight: '700', letterSpacing: '1px' }}>
                        <textPath href="#curvePath" startOffset="50%" textAnchor="middle">
                            Health on Cue, Just for You
                        </textPath>
                    </text>

                    {/* Central Icon Group */}
                    {/* Translate moves the 100x100 icon to the center of the 300x300 viewBox */}
                    <g transform="translate(100, 110)"> 
                        {/* Stopwatch Body */}
                        <circle cx="50" cy="55" r="38" stroke="#7e22ce" strokeWidth="5" className="dark:stroke-purple-400" fill="white" fillOpacity="0.5"/>
                        
                        {/* Stopwatch Knob */}
                        <rect x="42" y="8" width="16" height="6" rx="1" fill="#7e22ce" className="dark:fill-purple-400" />
                        <rect x="47" y="14" width="6" height="6" fill="#7e22ce" className="dark:fill-purple-400" />
                        
                        {/* Stopwatch Ticker Button (Diagonal) */}
                        <rect x="75" y="20" width="10" height="6" rx="1" transform="rotate(45 75 20)" fill="#7e22ce" className="dark:fill-purple-400" />

                        {/* Pill (Diagonal Overlay) */}
                        <g transform="rotate(45 50 55)">
                           {/* Light half background */}
                           <rect x="25" y="40" width="50" height="30" rx="15" fill="#e9d5ff" stroke="#7e22ce" strokeWidth="3" className="dark:fill-purple-200 dark:stroke-purple-400" />
                           {/* Dark half path */}
                           <path d="M 50 40 L 50 70 L 60 70 C 68.28 70 75 63.28 75 55 C 75 46.72 68.28 40 60 40 Z" fill="#7e22ce" className="dark:fill-purple-500" />
                        </g>
                    </g>
                </svg>
             </div>

             {/* App Title */}
             <h1 className="text-7xl text-purple-900 dark:text-purple-300 -mt-16 drop-shadow-sm select-none" style={{ fontFamily: '"Brush Script MT", "Comic Sans MS", cursive', fontStyle: 'italic' }}>
               Care Cue
             </h1>
          </div>

          {/* Continue Button */}
          <button 
            onClick={() => navigateTo(ScreenName.LOGIN)}
            className="w-72 py-5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold text-2xl rounded-full shadow-xl shadow-purple-200 dark:shadow-none transform transition hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            Continue <ChevronRight strokeWidth={3} />
          </button>

       </div>

       {/* Footer Text */}
       <div className="pb-8 pt-4 px-6 text-center z-10">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium tracking-wide">
            Click 'Continue' to start your journey for better health.
          </p>
       </div>
    </div>
  );
};

export const LoginScreen: React.FC = () => {
  const { user, updateUser, navigateTo, showToast, t } = useAppStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleGetOTP = () => {
    const newErrors: Record<string, string> = {};

    if (!user.name.trim()) newErrors.name = "Name is required";
    if (!user.age) newErrors.age = "Age is required";
    
    if (!validateGmail(user.email)) {
      newErrors.email = "Email ID does not exist";
    }

    if (!validatePhone(user.phone)) {
      newErrors.phone = "Phone number does not exist";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast("Please correct the highlighted errors", "error");
      return;
    }

    navigateTo(ScreenName.OTP);
  };

  return (
    <PageContainer className="p-6 flex flex-col justify-center">
      <div className="mb-8 mt-10">
        <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-400 mb-2">{t('welcome')}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Let's set up your profile.</p>
      </div>

      <Card className="mb-6">
        <Input 
          label="Your Name" 
          placeholder="Enter your full name" 
          value={user.name} 
          error={errors.name}
          onChange={(e) => {
             updateUser({ ...user, name: e.target.value });
             setErrors({...errors, name: ''});
          }} 
        />
        <Select 
          label="Gender" 
          value={user.gender} 
          onChange={(e) => updateUser({ ...user, gender: e.target.value as Gender })}
        >
          <option value={Gender.MALE}>{t('male')}</option>
          <option value={Gender.FEMALE}>{t('female')}</option>
          <option value={Gender.OTHER}>{t('other')}</option>
        </Select>
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Age" 
            type="number" 
            placeholder="Age" 
            value={user.age} 
            error={errors.age}
            onChange={(e) => {
              const ageVal = e.target.value;
              let newDob = user.dob;
              
              // Automatically calculate birth year and set DOB to Jan 1st of that year
              if (ageVal && !isNaN(Number(ageVal)) && Number(ageVal) > 0 && Number(ageVal) < 120) {
                 const year = new Date().getFullYear() - Number(ageVal);
                 // Format as YYYY-MM-DD
                 newDob = `${year}-01-01`;
              }

              updateUser({ ...user, age: ageVal, dob: newDob });
              setErrors({...errors, age: ''});
            }} 
          />
          <Input 
            label="Date of Birth" 
            type="date" 
            value={user.dob} 
            onChange={(e) => updateUser({ ...user, dob: e.target.value })} 
          />
        </div>
        
        <PhoneInput 
          label="Phone Number" 
          value={user.phone} 
          error={errors.phone}
          onChange={(val) => {
            updateUser({ ...user, phone: val });
            setErrors({...errors, phone: ''});
          }} 
        />

        <Input 
          label="Email ID" 
          type="email" 
          placeholder="you@gmail.com" 
          value={user.email} 
          error={errors.email}
          onChange={(e) => {
            updateUser({ ...user, email: e.target.value });
            setErrors({...errors, email: ''});
          }} 
        />
      </Card>

      <Button onClick={handleGetOTP}>
        Get OTP
      </Button>
    </PageContainer>
  );
};

export const OTPScreen: React.FC = () => {
  const { navigateTo } = useAppStore();
  const [otp, setOtp] = useState('');

  return (
    <PageContainer className="p-6 flex flex-col justify-center">
      <div className="mb-8 mt-10 text-center">
        <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-400 mb-2">Verify Phone</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Enter the 4-digit code sent to you.</p>
      </div>

      <Card className="mb-8 p-8">
        <div className="flex justify-center gap-4 mb-6">
           <input 
              type="text" 
              maxLength={4}
              className="w-full text-center text-3xl tracking-widest h-16 border-b-2 border-slate-300 dark:border-slate-600 focus:border-blue-500 outline-none bg-transparent text-slate-900 dark:text-white"
              placeholder="0 0 0 0"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
           />
        </div>
        <div className="text-center">
          <button className="text-blue-600 dark:text-blue-400 font-semibold py-2">Resend OTP</button>
        </div>
      </Card>

      <Button onClick={() => navigateTo(ScreenName.CARETAKER_INFO)}>
        Verify
      </Button>
    </PageContainer>
  );
};

export const CaretakerScreen: React.FC = () => {
  const { caretaker, updateCaretaker, navigateTo, setIsLoggedIn, showToast, t } = useAppStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleComplete = () => {
    const newErrors: Record<string, string> = {};

    if (!caretaker.name.trim()) newErrors.name = "Name is required";
    
    if (!validateGmail(caretaker.email)) {
      newErrors.email = "Email ID does not exist";
    }

    if (!validatePhone(caretaker.phone)) {
      newErrors.phone = "Phone number does not exist";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast("Please correct the highlighted errors", "error");
      return;
    }

    setIsLoggedIn(true);
    navigateTo(ScreenName.DASHBOARD);
  }

  return (
    <PageContainer className="p-6 flex flex-col justify-center">
      <div className="mb-8 mt-4">
        <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-400 mb-2">Caretaker</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Who should we contact in emergency?</p>
      </div>

      <Card className="mb-6">
        <Input 
          label="Caretaker Name" 
          placeholder="Full name" 
          value={caretaker.name} 
          error={errors.name}
          onChange={(e) => {
            updateCaretaker({ ...caretaker, name: e.target.value });
            setErrors({...errors, name: ''});
          }} 
        />
        <Select 
          label="Gender" 
          value={caretaker.gender} 
          onChange={(e) => updateCaretaker({ ...caretaker, gender: e.target.value as Gender })}
        >
          <option value={Gender.MALE}>{t('male')}</option>
          <option value={Gender.FEMALE}>{t('female')}</option>
          <option value={Gender.OTHER}>{t('other')}</option>
        </Select>
        <Input 
          label="Age" 
          type="number"
          placeholder="Age" 
          value={caretaker.age} 
          onChange={(e) => updateCaretaker({ ...caretaker, age: e.target.value })} 
        />
        <Input 
          label="Relationship" 
          placeholder="e.g. Son, Daughter, Nurse" 
          value={caretaker.relationship} 
          onChange={(e) => updateCaretaker({ ...caretaker, relationship: e.target.value })} 
        />
        
        <PhoneInput 
          label="Phone Number" 
          value={caretaker.phone} 
          error={errors.phone}
          onChange={(val) => {
            updateCaretaker({ ...caretaker, phone: val });
            setErrors({...errors, phone: ''});
          }} 
        />

        <Input 
          label="Email ID" 
          type="email"
          placeholder="caretaker@gmail.com" 
          value={caretaker.email} 
          error={errors.email}
          onChange={(e) => {
            updateCaretaker({ ...caretaker, email: e.target.value });
            setErrors({...errors, email: ''});
          }} 
        />
      </Card>

      <Button onClick={handleComplete}>
        Complete Setup
      </Button>
    </PageContainer>
  );
};
