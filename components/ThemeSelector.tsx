import React from 'react';
import { useTheme } from './ThemeProvider';
import IconButton from "@/components/IconButton";

const ThemeSelector = () => {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };
    if (theme==='light') {
        return(
            <IconButton
                icon="dark-mode"
                onPress={toggleTheme}
            />
        )
    } else {
        return(
            <IconButton
                icon="light-mode"
                onPress={toggleTheme}
            />
        )
    }
};
export default ThemeSelector;
