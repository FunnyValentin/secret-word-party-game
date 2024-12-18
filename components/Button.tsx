import {StyleSheet, View, Pressable, Text, ViewStyle, TextStyle} from "react-native";
import { useFonts } from "expo-font";
import { useTheme } from "@/components/ThemeProvider";

type Props = {
    label: string;
    onPress: () => void;
    variant?: "primary" | "secondary" | "danger" | "success" | "info";
    additionalStyles?: {
        container?: ViewStyle;
        button?: ViewStyle;
        label?: TextStyle;
    };
};

export default function Button({ label, onPress, variant, additionalStyles }: Props) {
    const [fontsLoaded] = useFonts({
        "Lexend-SemiBold": require("../assets/fonts/Lexend-SemiBold.ttf"),
    });

    const { colors } = useTheme();

    // Define styles for variants
    const variants = {
        primary: {
            container: [styles.buttonContainer, { backgroundColor: colors.PRIMARY }],
            label: [styles.buttonLabel, { color: colors.PRIMARY_TEXT }],
        },
        secondary: {
            container: [styles.buttonContainer, { backgroundColor: colors.SECONDARY }],
            label: [styles.buttonLabel, { color: colors.TEXT }],
        },
        default: {
            container: [styles.buttonContainer, { backgroundColor: colors.BACKGROUND }],
            label: [styles.buttonLabel, { color: colors.TEXT }],
        },
        danger: {
            container: [styles.buttonContainer, { backgroundColor: colors.BACKGROUND }],
            label: [styles.buttonLabel, { color: colors.TEXT }],
        },
        success: {
            container: [styles.buttonContainer, { backgroundColor: colors.BACKGROUND }],
            label: [styles.buttonLabel, { color: colors.TEXT }],
        },
        info: {
            container: [styles.buttonContainer, { backgroundColor: colors.BACKGROUND }],
            label: [styles.buttonLabel, { color: colors.TEXT }],
        }
    };

    const variantStyles = variants[variant || "default"];

    // Always return a valid component
    if (!fontsLoaded) {
        return (
            <View style={[styles.loadingContainer, additionalStyles?.container]}>
                <Text style={styles.loadingText}>Cargando fuentes...</Text>
            </View>
        );
    }

    return (
        <View style={[variantStyles.container, additionalStyles?.container]}>
            <Pressable style={[styles.button, additionalStyles?.button]} onPress={onPress}>
                <Text style={[variantStyles.label, additionalStyles?.label]}>{label}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: 50,
        width: 300,
        borderRadius: 20,
    },
    button: {
        alignSelf: "center",
        justifyContent: "center",
        flexDirection: "row",
        width: "100%",
        height: "100%",
    },
    buttonLabel: {
        alignSelf: "center",
        fontSize: 18,
        fontFamily: "Lexend-SemiBold",
    },
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
    },
    loadingText: {
        fontSize: 16,
        color: "gray",
    },
});
