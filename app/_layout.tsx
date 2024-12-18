import { Stack } from "expo-router";
import {ThemeProvider} from "@/components/ThemeProvider";

export default function RootLayout() {
  return <ThemeProvider>
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="buscar-sala" options={{ headerShown: false }} />
    </Stack>
  </ThemeProvider>

}
