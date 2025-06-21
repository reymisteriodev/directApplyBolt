import React, { createContext, useContext, useState, useEffect } from 'react';

type UserType = 'seekers' | 'companies';

interface ThemeContextType {
  userType: UserType;
  setUserType: (type: UserType) => void;
  theme: {
    primary: string;
    primaryHover: string;
    primaryLight: string;
    primaryDark: string;
    gradient: string;
    gradientHover: string;
    accent: string;
    accentLight: string;
  };
}

const themes = {
  seekers: {
    primary: 'bg-blue-500',
    primaryHover: 'hover:bg-blue-600',
    primaryLight: 'bg-blue-50',
    primaryDark: 'bg-blue-900',
    gradient: 'from-blue-500 to-purple-600',
    gradientHover: 'from-blue-600 to-purple-700',
    accent: 'text-blue-600',
    accentLight: 'bg-blue-100'
  },
  companies: {
    primary: 'bg-slate-800',
    primaryHover: 'hover:bg-slate-900',
    primaryLight: 'bg-slate-50',
    primaryDark: 'bg-slate-900',
    gradient: 'from-slate-800 to-amber-600',
    gradientHover: 'from-slate-900 to-amber-700',
    accent: 'text-slate-800',
    accentLight: 'bg-slate-100'
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userType, setUserType] = useState<UserType>('seekers');

  const theme = themes[userType];

  // Apply theme to document root for CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    
    if (userType === 'seekers') {
      root.style.setProperty('--primary-color', '#3B82F6'); // blue-500
      root.style.setProperty('--primary-hover', '#2563EB'); // blue-600
      root.style.setProperty('--accent-color', '#8B5CF6'); // purple-500
    } else {
      root.style.setProperty('--primary-color', '#1E293B'); // slate-800
      root.style.setProperty('--primary-hover', '#0F172A'); // slate-900
      root.style.setProperty('--accent-color', '#F59E0B'); // amber-500
    }
  }, [userType]);

  const value = {
    userType,
    setUserType,
    theme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};