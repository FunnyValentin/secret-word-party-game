import React from 'react';
import {View, Button, StyleSheet, Pressable, Text} from 'react-native';
import { useTheme } from './ThemeProvider';
import Feather from '@expo/vector-icons/Feather';

const ThemeSelector = () => {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };
    if (theme==='light') {
        return(
            <Pressable onPress={toggleTheme} style={styles.lightButton}>
                <Feather style={styles.icon} name="moon" size={24} color="#6a6a6a" />
            </Pressable>
        )
    } else {
        return(
            <Pressable onPress={toggleTheme} style={styles.darkButton}>
                <Feather style={styles.icon} name="sun" size={24} color="#a6a6a6" />
            </Pressable>
        )
    }
};

const styles = StyleSheet.create({
    darkButton: {
        height: 32,
        width: 32,
        borderRadius: 16,
        backgroundColor: "#2c2c2c",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
    lightButton: {
        height: 32,
        width: 32,
        borderRadius: 16,
        backgroundColor: "#fbf9f5",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
    icon: {
    }
});

export default ThemeSelector;
