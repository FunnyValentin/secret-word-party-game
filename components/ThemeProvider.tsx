import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

const themes = {
    light: {
        BACKGROUND: '#efefe7',
        TEXT: '#070707',
        TEXT_SECONDARY: '#6a6a6a',
        CARD_BACKGROUND: '#fbf9f5',
        PRIMARY: 'hsl(50, 89%, 50%)',
        PRIMARY_TEXT: 'hsl(50, 100%, 13%)',
        SECONDARY: 'hsl(30, 89%, 50%)',
        DANGER: 'hsl(0, 89%, 50%)',
        SUCCESS: 'hsl(129, 89%, 50%)',
        INFO: 'hsl(207, 89%, 50%)',
    },
    dark: {
        BACKGROUND: '#121212',
        TEXT: '#f6f6f6',
        TEXT_SECONDARY: '#a6a6a6',
        CARD_BACKGROUND: '#2c2c2c',
        PRIMARY: 'hsl(50, 97%, 57%)',
        PRIMARY_TEXT: 'hsl(50, 100%, 13%)',
        SECONDARY: 'hsl(30, 93%, 56%)',
        DANGER: 'hsl(0, 88%, 57%)',
        SUCCESS: 'hsl(129, 95%, 59%)',
        INFO: 'hsl(207, 97%, 59%)',
    },
};

type Theme = keyof typeof themes;

type ThemeContextType = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    colors: typeof themes.light;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const systemTheme = useColorScheme(); // Detect system theme (light/dark)
    const [theme, setTheme] = useState<Theme>(systemTheme || 'light'); // Allow overriding

    const colors = themes[theme];

    return (
        <ThemeContext.Provider value={{ theme, setTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
