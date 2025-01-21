import { Stack } from "expo-router";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

export default function RootLayout() {
  return (
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
  );
}

function AppContent() {
  const { colors } = useTheme();

  return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.BACKGROUND }]}>
        <StatusBar hidden={true} />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="buscar-sala" options={{ headerShown: false }} />
          <Stack.Screen name="game" options={{ headerShown: false }} />
          <Stack.Screen name="como-jugar" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
