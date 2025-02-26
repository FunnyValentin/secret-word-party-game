import {StyleSheet, View, Pressable, Text, TextStyle, ViewStyle} from "react-native";
import { useTheme } from "@/components/ThemeProvider";
import { MaterialIcons } from "@expo/vector-icons";

type Props = {
    icon: keyof typeof MaterialIcons.glyphMap; // Ensure the icon prop matches a valid MaterialIcons name
    onPress: () => void;
    variant?: "primary" | "secondary" | "danger" | "success" | "info" | "ghost";
    label?: string;
    additionalStyles?: {
        container?: ViewStyle;
        button?: ViewStyle;
        icon?: TextStyle;
        text?: TextStyle;
    };
};

export default function IconButton({ icon, onPress, variant, label, additionalStyles }: Props) {
    const { colors } = useTheme();

    const variants = {
        primary: {
            container: [styles.buttonContainer, { backgroundColor: colors.PRIMARY }],
            icon: [styles.buttonIcon, { color: colors.PRIMARY_TEXT }],
        },
        secondary: {
            container: [styles.buttonContainer, { backgroundColor: colors.SECONDARY }],
            icon: [styles.buttonIcon, { color: colors.TEXT }],
        },
        default: {
            container: [styles.buttonContainer, { backgroundColor: colors.BACKGROUND }],
            icon: [styles.buttonIcon, { color: colors.TEXT }],
        },
        danger: {
            container: [styles.buttonContainer, { backgroundColor: colors.DANGER }],
            icon: [styles.buttonIcon, { color: colors.TEXT }],
        },
        success: {
            container: [styles.buttonContainer, { backgroundColor: colors.SUCCESS }],
            icon: [styles.buttonIcon, { color: colors.TEXT }],
        },
        info: {
            container: [styles.buttonContainer, { backgroundColor: colors.INFO }],
            icon: [styles.buttonIcon, { color: colors.TEXT }],
        },
        ghost: {
            container: [styles.buttonContainer],
            icon: [styles.buttonIcon, { color: colors.TEXT_SECONDARY }],
        }
    };

    const variantStyles = variants[variant || "default"];

    return (
        <View style={[variantStyles.container, additionalStyles?.container]}>
            <Pressable
                style={[styles.button, additionalStyles?.button]}
                onPress={onPress}
            >
                <MaterialIcons
                    name={icon}
                    style={[variantStyles.icon, additionalStyles?.icon]}
                />
                {label && (
                    <Text
                        style={[
                            styles.buttonText,
                            { color: (variantStyles.icon[1] as { color: string }).color },
                            additionalStyles?.text
                        ]}
                    >
                        {label}
                    </Text>
                )}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 24,
        width: "auto", // Allow dynamic width
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonIcon: {
        fontSize: 24,
        marginRight: 8,
        fontWeight: "bold",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
    },
});