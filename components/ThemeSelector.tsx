import React from 'react';
import {View, Button, StyleSheet, Pressable, Text} from 'react-native';
import { useTheme } from './ThemeProvider'; // Adjust the path
import {MaterialIcons} from "@expo/vector-icons";

const ThemeSelector = () => {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <Pressable style={styles.themeToggle} onPress={toggleTheme}>

        </Pressable>
    );
};

const styles = StyleSheet.create({
    themeToggle: {
        height: 32,
        width: 32,
        borderRadius: 16,
        backgroundColor: "#323232",
        alignSelf: "center",
    },
});

export default ThemeSelector;
